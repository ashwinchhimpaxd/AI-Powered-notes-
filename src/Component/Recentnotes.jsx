import { useEffect, useState, useMemo, useDeferredValue } from "react";
import {
    TrashSimple,
    Star, DotsThreeVertical
} from "@phosphor-icons/react";
import { useSelector, useDispatch } from "react-redux";
import { deleteNote, setNotes, appendNotes, updateNoteInSlice } from "../redux/NotesCreation/NotesCreationSlice.js";
import { setnoteid, setcurrentnoteinfo } from "../redux/currentnoteinfoslice/currentnoteinfoslice.js";
import { useNavigate } from "react-router-dom";
import service from "@/AppWrite/Setgetuserdatas/config.js";
import StorageService from "../AppWrite/Setgetuserdatas/StorageImages/ImageUpload.js";
import { Query } from "appwrite";

export default function RecentNotes({ searchQuery = "" }) {
    const notes = useSelector((state) => state.NotesCreation.notes) || [];
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);

    // Initial fetch from Server IF Redux slice is empty
    useEffect(() => {
        if (!notes || notes.length === 0) {
            setLoading(true);
            service.getNotes([
                Query.limit(8),
                Query.orderDesc("$updatedAt")
            ]).then((response) => {
                // Check if docs exist
                if (response && response.documents) {

                    dispatch(setNotes(response.documents));
                    if (response.documents.length < 8) setHasMore(false);
                }
            }).catch((error) => {
                console.error("Error fetching initial notes:", error);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, []); // Only runs on mount

    // Load More function for Infinite Scroll
    const loadMoreNotes = async () => {
        if (fetchingMore || !hasMore || notes.length === 0) return;

        setFetchingMore(true);
        const lastNoteId = notes[notes.length - 1].$id;

        try {
            const response = await service.getNotes([
                Query.limit(8),
                Query.orderDesc("$updatedAt"),
                Query.cursorAfter(lastNoteId)
            ]);

            if (response && response.documents && response.documents.length > 0) {
                dispatch(appendNotes(response.documents));
            }
            if (!response || !response.documents || response.documents.length < 8) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching more notes:", error);
        } finally {
            setFetchingMore(false);
        }
    };

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        // If user scrolled to the bottom (with a 50px buffer)
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            loadMoreNotes();
        }
    };

    // Defer the search query to keep typing lag-free on the Dashboard
    const deferredSearchQuery = useDeferredValue(searchQuery);

    // Cache the filtered results so it doesn't recalculate if user opens a dropdown menu
    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            const titleMatch = (note.notes_title || "").toLowerCase().includes(deferredSearchQuery.toLowerCase());
            const descMatch = (note.notes_contect || "").toLowerCase().includes(deferredSearchQuery.toLowerCase());
            return titleMatch || descMatch;
        });
    }, [notes, deferredSearchQuery]);

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

    // This function sets a note to important directly from dashboard
    const toggleStar = async (e, note) => {
        e.stopPropagation(); // prevent opening the note
        const newImportance = !note.is_note_important;

        // Optimistic UI update
        const updatedNote = { ...note, is_note_important: newImportance };
        dispatch(updateNoteInSlice(updatedNote));

        try {
            await service.updateNote(note.$id, {
                slug: note.slug,
                Notes_title: note.notes_title,
                Notes_contents: note.notes_contect,
                notes_images: note.notes_images || [],
                Is_note_important: newImportance
            });
        } catch (error) {
            console.error("Failed to toggle important state:", error);
            // Revert back on fail
            dispatch(updateNoteInSlice(note));
        }
    };

    const handleNoteClick = (note) => {
        dispatch(setnoteid(note.$id));
        dispatch(setcurrentnoteinfo({
            title: note.notes_title || "",
            slug: note.slug || "",
            content: note.notes_contect || "",
            images: note.notes_images || [],
            isimportant: note.is_note_important || false
        }));
        navigate("/editor");
    };

    // Function to confirm and execute deletion
    const confirmDelete = async () => {
        if (noteToDelete) {
            // Optimistic UI Update: instantly remove from UI/Redux to feel fast
            dispatch(deleteNote(noteToDelete));

            const noteData = notes.find(n => n.$id === noteToDelete);
            const targetNoteId = noteToDelete; // snapshot it before clearing

            setNoteToDelete(null); // Close modal instantly

            try {
                // Delete orphaned images from Appwrite Storage
                if (noteData && noteData.notes_images && noteData.notes_images.length > 0) {
                    for (const imgRaw of noteData.notes_images) {
                        try {
                            const img = typeof imgRaw === 'string' ? JSON.parse(imgRaw) : imgRaw;
                            if (img.fileId) {
                                await StorageService.deleteImage(img.fileId);
                                console.log(`Deleted orphaned image: ${img.fileId}`);
                            }
                        } catch (err) {
                            console.error("Failed to parse and delete image during note deletion:", imgRaw, err);
                        }
                    }
                }

                // Delete Note Document from Appwrite Database
                await service.deleteNote(targetNoteId);
                console.log(`Successfully deleted note ${targetNoteId}`);
            } catch (error) {
                console.error("Error completely deleting note:", error);
                // Optionally could revert UI optimistic update on fail, but mostly unlikely to fail completely.
            }
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
                    <div
                        onScroll={handleScroll}
                        className="grid grid-cols-1 min-h-[25rem] max-h-[25rem] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5 overflow-y-scroll recent-sec-scroller cursor-pointer "
                    >
                        {filteredNotes.map((note) => (
                            <div
                                onClick={() => handleNoteClick(note)}
                                key={note.$id} // Ensure $id is unique for each note
                                className="relative flex flex-col gap-4 p-5 max-h-[10rem]  transition-all duration-300 bg-white/5 rounded-lg group hover:bg-white/10 cursor-pointer"
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
                                    <button className="text-white/40 hover:text-yellow-400 transition-colors"
                                        onClick={(e) => toggleStar(e, note)}
                                        aria-label="Mark as important"
                                    >
                                        <span className="material-symbols-outlined fill text-xl cursor-pointer">
                                            <Star weight={note.is_note_important ? "fill" : "regular"} className={note.is_note_important ? "text-yellow-400" : "text-white"} />
                                        </span>
                                    </button>

                                    <button className="text-white/40 hover:text-white transition-colors relative" // Added relative here
                                        onClick={(e) => { e.stopPropagation(); toggleNoteMenu(note.$id); }} // Call toggleNoteMenu with current note's ID
                                        aria-label="More options"
                                    >
                                        <span className="material-symbols-outlined text-[1.5rem] cursor-pointer">
                                            <DotsThreeVertical fill="white" weight="bold" />
                                        </span>

                                    </button>
                                </div>

                                <div className="flex flex-col gap-3 ">
                                    <p className="text-white text-base font-medium line-clamp-2">
                                        {truncateTitle(note.notes_title || "Untitled")}
                                    </p>
                                    <p className="text-white/80 text-sm mt-1 line-clamp-2">
                                        {/* Strip HTML tags from content for a clean preview description */}
                                        {note.notes_contect ? note.notes_contect.replace(/<[^>]+>/g, '') : "No content"}
                                    </p>
                                </div>

                                <p className="text-white/40 text-xs mt-auto">
                                    Last edited: {new Date(note.$updatedAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                        {/* show small loading indicator at the bottom if fetching more */}
                        {fetchingMore && (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center py-4">
                                <p className="text-white/50 text-sm">Loading more notes...</p>
                            </div>
                        )}
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
