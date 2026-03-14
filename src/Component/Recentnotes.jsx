import { useEffect, useState } from "react";
import {
    TrashSimple,
    Star, DotsThreeVertical
} from "@phosphor-icons/react";
import { useSelector, useDispatch } from "react-redux";
import { deleteNote } from "../redux/NotesCreation/NotesCreationSlice.js";
// import { databases } from "../appwrite"; // <-- adjust import according to your setup

export default function RecentNotes({ searchQuery = "" }) {
    const notes = useSelector((state) => state.NotesCreation.notes);
    const dispatch = useDispatch();

    const filteredNotes = notes && Object.values(notes).filter((note) => {
        const titleMatch = note.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = note.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || descMatch;
    });

    const [loading, setLoading] = useState(true);
    // State to hold the ID of the note whose menu is open
    const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
    // Changed ISimportant to a Set to store multiple important note IDs
    const [importantNoteIds, setImportantNoteIds] = useState(new Set());
    // State for the note to be deleted, controls the modal visibility
    const [noteToDelete, setNoteToDelete] = useState(null);

    useEffect(() => {
        async function getNotes() {
            const settime = setTimeout(() => {
                setLoading(false);
            }, 0);
            // try {
            //     // Ensure 'databases' is imported and correctly configured
            //     // For demonstration, commenting out actual API call
            //     // const response = await databases.listDocuments(
            //     //     "DATABASE_ID",   // <-- replace
            //     //     "COLLECTION_ID"  // <-- replace
            //     // );
            //     // setNotes(response.documents);

            //     // For now, simulating loading for the static notes above
            //     await new Promise(resolve => setTimeout(resolve, 1000));

            // } catch (error) {
            //     console.error("Error fetching notes:", error);
            // } finally {
            //     setLoading(false);
            // }
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

    // Function to confirm and execute deletion
    const confirmDelete = () => {
        if (noteToDelete) {
            dispatch(deleteNote(noteToDelete));
            setNoteToDelete(null);
        }
    };


    return (
        <div className="border-b-1 border-gray-400/30 flex flex-col justify-center min-h-[25rem] ">
            <h2 className="text-white text-[2.5rem] font-bold px-4 pb-2 pt-4 w-full" style={{ color: "var( --primary-text-color)" }}>
                Recent Notes
            </h2>
            <div className="min-h-[25rem] max-h-[25rem]">
                {/* LOADING STATE */}
                {loading && (
                    <p className="text-white/60 text-center text-[1.2rem] py-10 ">Loading...</p>
                )}

                {/* EMPTY STATE */}
                {!loading && filteredNotes.length === 0 && (
                    <p className="capitalize text-white/90 text-center text-[1.2rem] py-10 ">
                        Notes not found.
                    </p>
                )}

                {/* NOTES GRID */}
                {!loading && filteredNotes.length > 0 && (
                    <div className="grid grid-cols-1 min-h-[25rem] max-h-[25rem] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5 overflow-y-scroll recent-sec-scroller cursor-pointer ">
                        {filteredNotes.map((note) => (
                            <div
                                key={note.$id} // Ensure $id is unique for each note
                                className="relative flex flex-col gap-4 p-5 max-h-[10rem]  transition-all duration-300 bg-white/5 rounded-lg group hover:bg-white/10 "
                            >
                                {/* Conditionally render menu if this note's ID matches openNoteMenuId */}
                                {openNoteMenuId === note.$id && (
                                    <div className="absolute border border-white/30 top-8 left-[8.5rem] w-24 h-fit flex flex-col gap-1 justify-center items-center !bg-[#242424] rounded-md shadow-lg z-10">
                                        <p className="p-2 text-white/80 hover:bg-white/10 w-full text-center text-sm cursor-pointer">Edit</p>
                                        <p
                                            className="p-2 text-white/80 hover:bg-white/10 w-full text-center text-sm cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNoteToDelete(note.$id);
                                                setOpenNoteMenuId(null);
                                            }}
                                        >
                                            Delete
                                        </p>
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

                {/* CONFIRMATION MODAL */}
                {noteToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-[#242424] border border-white/10 rounded-xl p-6 shadow-2xl w-[90%] max-w-md flex flex-col gap-4">
                            <h3 className="text-white text-xl font-semibold">Delete Note</h3>
                            <p className="text-white/70">Are you sure you want to delete this note? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setNoteToDelete(null)}
                                    className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
