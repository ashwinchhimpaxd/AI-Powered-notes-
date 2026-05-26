import { createSelector } from "@reduxjs/toolkit";
import {
    selectAllNotes,
    selectNoteIds
} from "./NotesCreationSlice";

export const selectFilteredNoteIds = createSelector(
    [
        selectAllNotes,
        selectNoteIds,
        (_, search) => search
    ],
    (notes, noteIds, search) => {
        const query = search ? search.trim().toLowerCase() : "";

        if (!query) {
            return noteIds;
        }

        return notes
            .filter((note) => {
                const title = note.notes_title?.toLowerCase() || "";
                const content = note.notes_contect?.toLowerCase() || "";

                return (
                    title.includes(query) ||
                    content.includes(query)
                );
            })
            .map(note => note.$id);
    }
);

export const selectNoteStatistics = createSelector(
    [selectAllNotes],
    (notes) => {
        const totalCount = notes.length;
        const importantCount = notes.filter((n) => n.is_note_important).length;
        return { totalCount, importantCount };
    }
);