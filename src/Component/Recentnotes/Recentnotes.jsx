import { useEffect, useState, useDeferredValue, memo, useCallback, useRef } from "react";
import { SquaresFour, List, CircleNotch, FadersHorizontal } from "@phosphor-icons/react";
import { useSelector, useDispatch } from "react-redux";
import { deleteNote, setNotes, appendNotes, updateNoteInPlace, selectNoteIds, selectNoteById } from "../../redux/NotesCreation/NotesCreationSlice.js";
import { setnoteid, setcurrentnoteinfo } from "../../redux/currentnoteinfoslice/currentnoteinfoslice.js";
import { useNavigate } from "react-router-dom";
import service from "@/AppWrite/Setgetuserdatas/config.js";
import StorageService from "../../AppWrite/Setgetuserdatas/StorageImages/ImageUpload.js";
import { Query } from "appwrite";
import { executeOptimisticToggle } from "../../utils/optimisticToggle.js";
import NoteCard from "./NoteCard";
import NoteSkeleton from "./NoteSkeleton";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { selectFilteredNoteIds } from "../../redux/NotesCreation/NotesSelector.js";

const RecentNotes = memo(({ searchQuery = "", isCreatingNote = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isGridView, setIsGridView] = useState(true);
    const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);

    const noteIds = useSelector(selectNoteIds);
    const noteData = useSelector((state) =>
        noteToDelete ? selectNoteById(state, noteToDelete) : null
    );

    const lastNoteId = noteIds.length > 0 ? noteIds[noteIds.length - 1] : null;
    const lastNote = useSelector((state) =>
        lastNoteId ? selectNoteById(state, lastNoteId) : null
    );

    const currentuserID = useSelector((state) => state.UserAuthantication.UserData?.userdetaild?.$id) || "";

    // Initial fetch from Server IF Redux slice is empty
    useEffect(() => {
        if (!currentuserID) return;
        if (noteIds.length > 0) return;

        const fetchNotes = async () => {
            try {
                setLoading(true);
                const response = await service.getNotes([
                    Query.limit(8),
                    Query.orderDesc("$updatedAt"),
                    Query.equal("user_unique_id", currentuserID)
                ]);

                if (response?.documents) {
                    dispatch(setNotes(response.documents));
                    if (response.documents.length < 8) {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [currentuserID, noteIds.length, dispatch]);

    const fetchingRef = useRef(false);
    const lastNoteIdForCursor = lastNote?.$id;

    // Load More function for Infinite Scroll
    const loadMoreNotes = useCallback(async () => {
        if (fetchingRef.current || fetchingMore || !hasMore || !lastNoteIdForCursor) return;

        fetchingRef.current = true;
        setFetchingMore(true);

        try {
            const response = await service.getNotes([
                Query.limit(8),
                Query.orderDesc("$updatedAt"),
                Query.cursorAfter(lastNoteIdForCursor)
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
            fetchingRef.current = false;
            setFetchingMore(false);
        }
    }, [fetchingMore, hasMore, lastNoteIdForCursor, dispatch]);

    // handle delete notes 
    const handleDeleteMenu = useCallback((id) => {
        setNoteToDelete(id);
        setOpenNoteMenuId(null);
    }, []);

    const handleScroll = useCallback((e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            loadMoreNotes();
        }
    }, [loadMoreNotes]);

    const deferredSearchQuery = useDeferredValue(searchQuery);

    const filteredNoteIds = useSelector((state) =>
        selectFilteredNoteIds(state, deferredSearchQuery)
    );

    const toggleNoteMenu = useCallback((noteId) => {
        setOpenNoteMenuId(prevId => prevId === noteId ? null : noteId);
    }, []);

    const toggleStar = useCallback((e, note) => {
        e.stopPropagation();

        executeOptimisticToggle({
            key: `note-important-${note.$id}`,
            initialValue: note.is_note_important,
            originalData: note,
            onOptimisticUpdate: (newImportance) => {
                const updatedNote = { ...note, is_note_important: newImportance };
                dispatch(updateNoteInPlace(updatedNote));
            },
            apiCall: async (newImportance) => {
                await service.updateNote(note.$id, {
                    slug: note.slug,
                    Notes_title: note.notes_title,
                    Notes_contents: note.notes_contect,
                    notes_images: note.notes_images || [],
                    Is_note_important: newImportance
                });
            },
            onRollback: (originalNote) => {
                dispatch(updateNoteInPlace(originalNote));
            }
        });
    }, [dispatch]);

    const handleNoteClick = useCallback((note) => {
        dispatch(setnoteid(note.$id));
        dispatch(setcurrentnoteinfo({
            title: note.notes_title || "",
            slug: note.slug || "",
            content: note.notes_contect || "",
            images: note.notes_images || [],
            isimportant: note.is_note_important || false
        }));
        if (note.slug) {
            navigate(`/Dashboard/editor/${note.slug}`);
        } else {
            navigate("/Dashboard/editor");
        }
    }, [dispatch, navigate]);

    const confirmDelete = useCallback(async () => {
        if (noteToDelete) {
            const targetNoteId = noteToDelete;
            const targetNoteData = noteData;
            dispatch(deleteNote(targetNoteId));
            setNoteToDelete(null);

            try {
                if (targetNoteData && targetNoteData.notes_images && targetNoteData.notes_images.length > 0) {
                    for (const imgRaw of targetNoteData.notes_images) {
                        try {
                            const img = typeof imgRaw === 'string' ? JSON.parse(imgRaw) : imgRaw;
                            if (img.fileId) {
                                await StorageService.deleteImage(img.fileId);
                            }
                        } catch (err) { }
                    }
                }
                await service.deleteNote(targetNoteId);
            } catch (error) {
                console.error("Error completely deleting note:", error);
            }
        }
    }, [noteToDelete, dispatch, noteData]);

    return (
        <div className="flex flex-col min-h-[25rem]">
            {/* Header Area */}
            <div className="flex items-end justify-between mb-6 ">
                <div>
                    <h2 className="text-white text-3xl font-bold tracking-tight">Recent Notes</h2>
                    <p className="text-[#a1a1aa] text-sm mt-1">Continue where you left off or ask AI to summarize.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] rounded-lg text-sm font-medium text-[#e5e5e5] transition-colors">
                        <FadersHorizontal className="size-4" /> Filter
                    </button>
                    {/* Toggle Button */}
                    <button
                        id="grid-btn"
                        onClick={() => setIsGridView(!isGridView)}
                        className="flex items-center cursor-pointer justify-center p-1.5 bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] rounded-lg text-[#e5e5e5] transition-colors"
                        title={isGridView ? "Switch to List View" : "Switch to Grid View"}
                    >
                        {/* Swaps the icon based on the current state */}
                        {isGridView ? <List className="size-5" /> : <SquaresFour className="size-5" />}
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
                {!loading && filteredNoteIds.length === 0 && !isCreatingNote && (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#262626] rounded-xl bg-[#0a0a0a]">
                        <p className="text-[#a1a1aa] text-sm font-medium">Notes not found.</p>
                    </div>
                )}

                {/* NOTES GRID */}
                {!loading && (
                    <div
                        onScroll={handleScroll}
                        // Conditionally apply Grid or List (flex-col) classes here:
                        className={`gap-5 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 pb-10 transition-all duration-300 ${isGridView
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            : "flex flex-col w-full  mx-auto" // List view classes
                            }`}
                    >
                        {/* Skeleton Loader for AI Note Generation */}
                        {isCreatingNote && <NoteSkeleton isGridView={isGridView} />}

                        {filteredNoteIds.map((id) => (
                            <NoteCard
                                key={id}
                                noteId={id}
                                isGridView={isGridView}
                                openMenu={openNoteMenuId === id}
                                onToggleMenu={toggleNoteMenu}
                                onToggleStar={toggleStar}
                                onDelete={handleDeleteMenu}
                                onClick={handleNoteClick}
                            />
                        ))}
                        {fetchingMore && (
                            <div className="col-span-full flex justify-center py-4">
                                <CircleNotch className="size-6 text-[#52525b] animate-spin" />
                            </div>
                        )}
                    </div>
                )}
                {/* CONFIRMATION MODAL */}
                <DeleteConfirmationModal
                    isOpen={!!noteToDelete}
                    onClose={() => setNoteToDelete(null)}
                    onConfirm={confirmDelete}
                />
            </div>
        </div>
    );
});

export default RecentNotes;
