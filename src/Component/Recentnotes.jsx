import { useEffect, useState, useMemo, useDeferredValue } from "react";
import {
    TrashSimple, Star, DotsThreeVertical, FadersHorizontal, SquaresFour, CircleNotch
} from "@phosphor-icons/react";
import { useSelector, useDispatch } from "react-redux";
import { deleteNote, setNotes, appendNotes, updateNoteInPlace } from "../redux/NotesCreation/NotesCreationSlice.js";
import { setnoteid, setcurrentnoteinfo } from "../redux/currentnoteinfoslice/currentnoteinfoslice.js";
import { useNavigate } from "react-router-dom";
import service from "@/AppWrite/Setgetuserdatas/config.js";
import StorageService from "../AppWrite/Setgetuserdatas/StorageImages/ImageUpload.js";
import { Query } from "appwrite";

export default function RecentNotes({ searchQuery = "", isCreatingNote = false }) {
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
    }, []);

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
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            loadMoreNotes();
        }
    };

    const deferredSearchQuery = useDeferredValue(searchQuery);

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            const titleMatch = (note.notes_title || "").toLowerCase().includes(deferredSearchQuery.toLowerCase());
            const descMatch = (note.notes_contect || "").toLowerCase().includes(deferredSearchQuery.toLowerCase());
            return titleMatch || descMatch;
        });
    }, [notes, deferredSearchQuery]);

    const truncateTitle = (title) => {
        const words = title.split(' ');
        if (words.length > 5) {
            return words.slice(0, 5).join(' ') + '...';
        }
        return title;
    };

    const toggleNoteMenu = (noteId) => {
        setOpenNoteMenuId(prevId => prevId === noteId ? null : noteId);
    };

    const toggleStar = async (e, note) => {
        e.stopPropagation();
        const newImportance = !note.is_note_important;
        const updatedNote = { ...note, is_note_important: newImportance };
        dispatch(updateNoteInPlace(updatedNote));

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
            dispatch(updateNoteInPlace(note));
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

    const confirmDelete = async () => {
        if (noteToDelete) {
            dispatch(deleteNote(noteToDelete));
            const noteData = notes.find(n => n.$id === noteToDelete);
            const targetNoteId = noteToDelete;
            setNoteToDelete(null);

            try {
                if (noteData && noteData.notes_images && noteData.notes_images.length > 0) {
                    for (const imgRaw of noteData.notes_images) {
                        try {
                            const img = typeof imgRaw === 'string' ? JSON.parse(imgRaw) : imgRaw;
                            if (img.fileId) {
                                await StorageService.deleteImage(img.fileId);
                            }
                        } catch (err) {}
                    }
                }
                await service.deleteNote(targetNoteId);
            } catch (error) {
                console.error("Error completely deleting note:", error);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-[25rem]">
            {/* Header Area */}
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h2 className="text-white text-3xl font-bold tracking-tight">Recent Notes</h2>
                    <p className="text-[#a1a1aa] text-sm mt-1">Continue where you left off or ask AI to summarize.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] rounded-lg text-sm font-medium text-[#e5e5e5] transition-colors">
                        <FadersHorizontal className="size-4" /> Filter
                    </button>
                    <button className="flex items-center justify-center p-1.5 bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] rounded-lg text-[#e5e5e5] transition-colors">
                        <SquaresFour className="size-5" />
                    </button>
                </div>
            </div>

            {/* Note Grid */}
            <div className="flex-1">
                {/* LOADING STATE */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <CircleNotch className="size-8 text-[#8b5cf6] animate-spin" />
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && filteredNotes.length === 0 && !isCreatingNote && (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#262626] rounded-xl bg-[#0a0a0a]">
                        <p className="text-[#a1a1aa] text-sm font-medium">Notes not found.</p>
                    </div>
                )}

                {/* NOTES GRID */}
                {!loading && (
                    <div
                        onScroll={handleScroll}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 pb-10"
                    >
                        {/* Skeleton Loader for AI Note Generation */}
                        {isCreatingNote && (
                            <div className="relative flex flex-col gap-4 p-5 h-48 bg-[#121212] border border-[#262626] rounded-xl overflow-hidden animate-pulse">
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" />
                                
                                <div className="flex justify-between items-center w-full">
                                    <div className="flex gap-2">
                                        <div className="h-6 w-20 bg-[#1a1a1a] rounded-full" />
                                        <div className="h-6 w-24 bg-[#8b5cf6]/20 rounded-full" />
                                    </div>
                                    <div className="h-4 w-12 bg-[#1a1a1a] rounded" />
                                </div>

                                <div className="mt-2 space-y-3">
                                    <div className="h-7 w-3/4 bg-[#1a1a1a] rounded-lg" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-[#1a1a1a] rounded" />
                                        <div className="h-4 w-5/6 bg-[#1a1a1a] rounded" />
                                        <div className="h-4 w-4/6 bg-[#1a1a1a] rounded" />
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                    <CircleNotch className="size-4 text-[#8b5cf6] animate-spin" />
                                    <span className="text-xs font-medium text-[#8b5cf6]">AI is writing...</span>
                                </div>
                            </div>
                        )}

                        {/* Real Notes */}
                        {filteredNotes.map((note) => (
                            <div
                                onClick={() => handleNoteClick(note)}
                                key={note.$id}
                                className="relative flex flex-col h-48 bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] rounded-xl transition-all duration-300 cursor-pointer group"
                            >
                                <div className="p-5 flex flex-col h-full">
                                    
                                    {/* Top Metadata Row */}
                                    <div className="flex justify-between items-start w-full mb-3">
                                        <div className="flex gap-2">
                                            <span className="px-2.5 py-1 bg-[#1a1a1a] border border-[#262626] text-[#a1a1aa] text-[10px] uppercase tracking-wider font-semibold rounded-full">
                                                General
                                            </span>
                                        </div>
                                        <span className="text-[11px] font-medium text-[#52525b]">
                                            {new Date(note.$updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-2 flex-1">
                                        <h3 className="text-white text-lg font-bold leading-tight line-clamp-2 pr-8">
                                            {truncateTitle(note.notes_title || "Untitled")}
                                        </h3>
                                        <p className="text-[#a1a1aa] text-sm leading-relaxed line-clamp-3">
                                            {note.notes_contect ? note.notes_contect.replace(/<[^>]+>/g, '') : "No content"}
                                        </p>
                                    </div>

                                    {/* Hover Action Icons */}
                                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button 
                                            className="p-1 rounded-md bg-[#262626] text-white/40 hover:text-yellow-400 transition-colors"
                                            onClick={(e) => toggleStar(e, note)}
                                        >
                                            <Star size={16} weight={note.is_note_important ? "fill" : "regular"} className={note.is_note_important ? "text-yellow-400" : ""} />
                                        </button>
                                        <button 
                                            className="p-1 rounded-md bg-[#262626] text-white/40 hover:text-white transition-colors"
                                            onClick={(e) => { e.stopPropagation(); toggleNoteMenu(note.$id); }}
                                        >
                                            <DotsThreeVertical size={16} weight="bold" />
                                        </button>
                                    </div>
                                    
                                    {/* Menu Dropdown */}
                                    {openNoteMenuId === note.$id && (
                                        <div className="absolute top-12 right-4 w-32 bg-[#1a1a1a] border border-[#262626] rounded-lg shadow-2xl z-20 flex flex-col py-1">
                                            <button className="px-4 py-2 text-sm text-[#e5e5e5] hover:bg-[#262626] hover:text-white text-left transition-colors">Edit</button>
                                            <button 
                                                className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNoteToDelete(note.$id);
                                                    setOpenNoteMenuId(null);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {fetchingMore && (
                            <div className="col-span-full flex justify-center py-4">
                                <CircleNotch className="size-6 text-[#52525b] animate-spin" />
                            </div>
                        )}
                    </div>
                )}

                {/* CONFIRMATION MODAL */}
                {noteToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 shadow-2xl w-[90%] max-w-md flex flex-col gap-4">
                            <h3 className="text-white text-xl font-semibold">Delete Note</h3>
                            <p className="text-[#a1a1aa] text-sm">Are you sure you want to delete this note? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setNoteToDelete(null)}
                                    className="px-4 py-2 rounded-lg text-[#e5e5e5] bg-[#262626] hover:bg-[#3f3f46] transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors font-medium text-sm"
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
