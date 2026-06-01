import { Query } from "appwrite";

/**
 * Dynamically builds an array of Appwrite queries based on the filters, cursor, and limits.
 * 
 * @param {Object} params
 * @param {string} params.userId - Authenticated user's unique ID
 * @param {Object} params.filter - Filter state
 * @param {string} params.filter.importance - "all" | "important" | "non-important"
 * @param {string} params.filter.sort - "newest" | "oldest"
 * @param {string|null} params.filter.startDate - "YYYY-MM-DD" or null
 * @param {string|null} params.filter.endDate - "YYYY-MM-DD" or null
 * @param {string|null} params.lastCursor - Unique document ID of the last item in current list
 * @param {number} params.limit - Number of notes to return (default 8)
 * @returns {Array} List of Appwrite Query objects
 */
export function buildAppwriteQueries({ userId, filter, lastCursor, limit = 8 }) {
    const queries = [];

    // 1. Mandatory User Scope Isolation
    queries.push(Query.equal("user_unique_id", userId));

    // 2. Limit constraint for pagination
    queries.push(Query.limit(limit));

    // 3. Importance Filtering
    if (filter.importance === "important") {
        queries.push(Query.equal("is_note_important", true));
    } else if (filter.importance === "non-important" || filter.importance === "nonImportant") {
        queries.push(Query.equal("is_note_important", false));
    }

    // 4. Date Range Filters
    if (filter.startDate) {
        try {
            const startObj = new Date(filter.startDate);
            if (!isNaN(startObj.getTime())) {
                queries.push(Query.greaterThanEqual("$createdAt", startObj.toISOString()));
            }
        } catch (e) {
            console.error("Invalid startDate format:", filter.startDate, e);
        }
    }
    if (filter.endDate) {
        try {
            // Include complete day up to 23:59:59.999 UTC
            const endObj = new Date(filter.endDate);
            if (!isNaN(endObj.getTime())) {
                endObj.setUTCHours(23, 59, 59, 999);
                queries.push(Query.lessThanEqual("$createdAt", endObj.toISOString()));
            }
        } catch (e) {
            // Fallback for simple date addition if string
            try {
                const endObj = new Date(`${filter.endDate}T23:59:59.999Z`);
                if (!isNaN(endObj.getTime())) {
                    queries.push(Query.lessThanEqual("$createdAt", endObj.toISOString()));
                }
            } catch (err) {
                console.error("Invalid endDate format:", filter.endDate, err);
            }
        }
    }

    // 5. Sorting Queries
    if (filter.sort === "oldest") {
        queries.push(Query.orderAsc("$createdAt"));
    } else {
        queries.push(Query.orderDesc("$createdAt"));
    }

    // 6. Cursor Pagination (Sequential Offset Anchor)
    if (lastCursor) {
        queries.push(Query.cursorAfter(lastCursor));
    }

    return queries;
}
