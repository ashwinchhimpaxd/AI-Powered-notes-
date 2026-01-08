import { useEffect, useState } from "react";
import {
    TrashSimple,
    Star, DotsThreeVertical
} from "@phosphor-icons/react";
// import { databases } from "../appwrite"; // <-- adjust import according to your setup

export default function RecentNotes() {
    const [notes, setNotes] = useState([
        {
            $id: "temp1",
            title: "Welcome Note",
            description: "Your notes will appear here once you start writing!",
            $updatedAt: new Date().toISOString(),
        },
        {
            $id: "temp2",
            title: "How to Use",
            description: "Create notes using the editor and they will show up here.",
            $updatedAt: new Date().toISOString(),
        },
        {
            $id: "temp3", // Ensure unique ID
            title: "How to Use this AI powered Notes for better workflow", // Longer title for testing
            description: "Create notes using the editor and they will show up here.",
            $updatedAt: new Date().toISOString(),
        },
        {
            $id: "temp4", // Ensure unique ID
            title: "Another Note Title",
            description: "This is another description.",
            $updatedAt: new Date().toISOString(),
        },
        {
            $id: "temp5", // Ensure unique ID
            title: "Short Title",
            description: "A short description.",
            $updatedAt: new Date().toISOString(),
        },
    ]);
    const [loading, setLoading] = useState(true);
    // State to hold the ID of the note whose menu is open
    const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
    // Changed ISimportant to a Set to store multiple important note IDs
    const [importantNoteIds, setImportantNoteIds] = useState(new Set());

    useEffect(() => {
        async function getNotes() {
            try {
                // Ensure 'databases' is imported and correctly configured
                // For demonstration, commenting out actual API call
                // const response = await databases.listDocuments(
                //     "DATABASE_ID",   // <-- replace
                //     "COLLECTION_ID"  // <-- replace
                // );
                // setNotes(response.documents);

                // For now, simulating loading for the static notes above
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error("Error fetching notes:", error);
            } finally {
                setLoading(false);
            }
        }

        getNotes();
    }, []);

    // Function to truncate title to 4 words
    const truncateTitle = (title) => {
        const words = title.split(' ');
        if (words.length > 4) {
            return words.slice(0, 4).join(' ') + '...';
        }
        return title;
    };

    // Function to toggle the menu for a specific note
    const toggleNoteMenu = (noteId) => {
        setOpenNoteMenuId(prevId => prevId === noteId ? null : noteId);
    };

    // This function for making note mark important
    const Mark_Important_Fx = (noteId) => {

        setImportantNoteIds(prevIds => {
            const newIds = new Set(prevIds); // Create a new Set from the previous one
            if (newIds.has(noteId)) {
                newIds.delete(noteId); // If already important, unmark it
            } else {
                newIds.add(noteId); // If not important, mark it
            }
            return newIds; // Return the new Set to update state
        });
    };


    return (
        <div className="border-b-1 border-gray-400/30 flex flex-col justify-center   ">
            <h2 className="text-white text-[2.5rem] font-bold px-4 pb-2 pt-4" style={{ color: "var( --primary-text-color)" }}>
                Recent Notes
            </h2>

            {/* LOADING STATE */}
            {loading && (
                <p className="text-white/60 text-center relative bottom-10 text-[1.2rem] py-10 ">Loading...</p>
            )}

            {/* EMPTY STATE */}
            {!loading && notes.length === 0 && (
                <p className="capitalize text-white/90 text-center relative bottom-10 text-[1.2rem] py-10 ">
                    Notes not found.
                </p>
            )}

            {/* NOTES GRID */}
            {!loading && notes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5 overflow-y-scroll h-[25rem] recent-sec-scroller cursor-pointer ">
                    {notes.map((note) => (
                        <div
                            key={note.$id} // Ensure $id is unique for each note
                            className="relative flex flex-col gap-4 p-5 max-h-[10rem]  transition-all duration-300 bg-white/5 rounded-lg group hover:bg-white/10 "
                        >
                            {/* Conditionally render menu if this note's ID matches openNoteMenuId */}
                            {openNoteMenuId === note.$id && (
                                <div className="absolute border border-white/30 top-8 left-[8.5rem] w-24 h-fit flex flex-col gap-1 justify-center items-center !bg-[#242424] rounded-md shadow-lg z-10">
                                    <p className="p-2 text-white/80 hover:bg-white/10 w-full text-center text-sm">Edit</p>
                                    <p className="p-2 text-white/80 hover:bg-white/10 w-full text-center text-sm">Delete</p>
                                </div>
                            )}

                            {/* icons of delete and imp */}
                            <div className="absolute top-4 right-4  w-[25%] flex gap-1 justify-evenly items-center">
                                <button className="text-white/40 hover:text-primary transition-colors"
                                    onClick={() => Mark_Important_Fx(note.$id)} // Call the function to toggle important status
                                    aria-label="Mark as important"
                                >
                                    <span className="material-symbols-outlined fill text-xl cursor-pointer">
                                        {/* Check if the current note.$id exists in the Set of importantNoteIds */}
                                        <Star weight={importantNoteIds.has(note.$id) ? "fill" : "regular"} fill="white" />
                                    </span>
                                </button>

                                <button className="text-white/40 hover:text-white transition-colors relative" // Added relative here
                                    onClick={() => toggleNoteMenu(note.$id)} // Call toggleNoteMenu with current note's ID
                                    aria-label="More options"
                                >
                                    <span className="material-symbols-outlined text-[1.5rem] cursor-pointer">
                                        <DotsThreeVertical fill="white" weight="bold" />
                                    </span>

                                </button>
                            </div>

                            <div className="flex flex-col gap-3 ">
                                <p className="text-white text-base font-medium line-clamp-2">
                                    {truncateTitle(note.title)} {/* Applied truncateTitle function here */}
                                </p>
                                <p className="text-white/80 text-sm mt-1 line-clamp-2">
                                    {note.description}
                                </p>
                            </div>

                            <p className="text-white/40 text-xs mt-auto">
                                Last edited: {new Date(note.$updatedAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
