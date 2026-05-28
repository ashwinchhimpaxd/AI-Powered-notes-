import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setcurrentnoteinfo,
    setnoteid,
} from "../../../redux/currentnoteinfoslice/currentnoteinfoslice.js";
import { addNoteToTop, updateNoteInSlice } from "../../../redux/NotesCreation/NotesCreationSlice.js";
import service from "../../../AppWrite/Setgetuserdatas/config.js";
import StorageService from "../../../AppWrite/Setgetuserdatas/StorageImages/ImageUpload.js";

// Helper to extract plain text from HTML
const getPlainText = (html) => {
    if (!html) return "";
    try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent.trim();
    } catch (e) {
        return html.replace(/<[^>]*>/g, '').trim();
    }
};

// Helper to strip all whitespace for strict content-only text comparison
const cleanText = (text) => {
    return (text || "").replace(/\s/g, "");
};

/**
 * useNoteSave
 * Handles all save logic: autosave (debounce), manual save,
 * slug generation, Redux dispatch.
 * Completely separate from UI — EditorToolbar just calls this hook.
 */
export function useNoteSave(editor, slashOpenRef) {
    const dispatch = useDispatch();

    // Redux state
    const reduxNoteId = useSelector((state) => state.currentnoteinfoslice.noteid);
    const userData = useSelector((state) => state.UserAuthantication.UserData);
    const noteData = useSelector((state) => state.currentnoteinfoslice.currentnoteinfo);
    const noteTitle = noteData.title;

    // Load note entities from Redux store to avoid server GET requests (getNote)
    const notesEntities = useSelector((state) => state.NotesCreation.entities);
    const notesEntitiesRef = useRef(notesEntities);
    useEffect(() => {
        notesEntitiesRef.current = notesEntities;
    }, [notesEntities]);

    // Local state - Initialise directly with current Redux values to prevent flicker of "Untitled Note..."
    const initialCleanTitle = noteTitle?.trim()?.replace(/\s+/g, " ") || "";
    const initialGeneratedSlug = initialCleanTitle
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    const [title, setTitle] = useState(initialCleanTitle);
    const [slug, setSlug] = useState(initialGeneratedSlug);
    const [isSaving, setIsSaving] = useState(false);
    const [isNoteSaved, setIsNoteSaved] = useState(true);

    // Refs — keep latest values accessible inside async callbacks & timeouts
    const userDataRef = useRef(userData);
    const reduxNoteIdRef = useRef(reduxNoteId);
    const titleRef = useRef(title);
    const slugRef = useRef(slug);
    const noteDataRef = useRef(noteData);

    // Sync refs whenever state/redux updates
    useEffect(() => { userDataRef.current = userData; }, [userData]);
    useEffect(() => { reduxNoteIdRef.current = reduxNoteId; }, [reduxNoteId]);
    useEffect(() => { noteDataRef.current = noteData; }, [noteData]);
    useEffect(() => { titleRef.current = title; }, [title]);
    useEffect(() => { slugRef.current = slug; }, [slug]);

    // Initialize last saved values with the loaded note's values to prevent false changes on mount
    const lastSavedContent = useRef(noteData?.content || "");
    const lastSavedText = useRef(noteData?.content ? getPlainText(noteData.content) : "");
    const lastSavedTitle = useRef(initialCleanTitle);
    const lastSavedSlug = useRef(initialGeneratedSlug);
    
    const timeoutRef = useRef(null);
    const isSavingRef = useRef(false);
    const isLoaded = useRef(false);

    // Hydrate title, slug, and refs when a note is loaded or switched (runs on mount and on noteid change)
    useEffect(() => {
        if (!reduxNoteId || !noteTitle) return;

        const cleanTitle = noteTitle.trim().replace(/\s+/g, " ");
        const generatedSlug = cleanTitle
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

        setTitle(cleanTitle);
        setSlug(generatedSlug);

        // Synchronize last saved refs to match the newly loaded note
        lastSavedTitle.current = cleanTitle;
        lastSavedSlug.current = generatedSlug;
        
        if (noteDataRef.current?.content) {
            lastSavedContent.current = noteDataRef.current.content;
            lastSavedText.current = getPlainText(noteDataRef.current.content);
        }

        dispatch(setcurrentnoteinfo({ 
            ...noteDataRef.current, 
            title: cleanTitle, 
            slug: generatedSlug 
        }));
    }, [reduxNoteId]); // Triggered when note ID loads or switches

    /**
     * commitTitle — call this onBlur or onEnter from the title input.
     * Cleans whitespace, generates a slug, updates local state + Redux.
     */
    const commitTitle = (rawTitle) => {
        const cleanTitle = rawTitle.trim().replace(/\s+/g, " ");
        const generatedSlug = cleanTitle
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

        setTitle(cleanTitle);

        if (cleanTitle.length > 0) {
            setSlug(generatedSlug);
            dispatch(setcurrentnoteinfo({ ...noteDataRef.current, title: cleanTitle, slug: generatedSlug }));
        } else {
            setSlug("");
            dispatch(setcurrentnoteinfo({ ...noteDataRef.current, title: "", slug: "" }));
        }

        // Check if title or slug actually changed from last save
        if (cleanTitle !== lastSavedTitle.current || generatedSlug !== lastSavedSlug.current) {
            setIsNoteSaved(false);
        }
    };

    const toggleImportant = (editorInstance) => {
        const newValue = !noteDataRef.current.isimportant;
        dispatch(setcurrentnoteinfo({ ...noteDataRef.current, isimportant: newValue }));
        setIsNoteSaved(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => handleSave(editorInstance), 3000);
    };

    /**
     * handleSave — safe to call from the save button OR autosave timer.
     * Guards: already saving, empty note, no meaningful changes.
     */
    const handleSave = async (currentEditor) => {
        if (!currentEditor) return;
        if (isSavingRef.current) return;

        // Cancel any pending autosave so it doesn't double-fire
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const currentContent = currentEditor.getHTML();
        const textContent = currentEditor.getText().trim();
        const currentTitle = titleRef.current;
        const currentSlug = slugRef.current;

        // Skip empty notes (no text and no images)
        if (textContent === "" && !currentContent.includes("<img")) return;

        // Extract images helper
        const getImagesString = (html) => {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                return Array.from(doc.querySelectorAll('img'))
                    .map(img => img.getAttribute('src'))
                    .filter(Boolean)
                    .join(",");
            } catch (e) {
                return "";
            }
        };

        // Detect if content changed (ignoring all whitespaces and newlines)
        const contentChanged = cleanText(currentEditor.getText()) !== cleanText(lastSavedText.current) ||
            getImagesString(currentContent) !== getImagesString(lastSavedContent.current);

        // Detect if title or slug changed
        const metadataChanged = currentTitle !== lastSavedTitle.current ||
            currentSlug !== lastSavedSlug.current;

        if (!contentChanged && !metadataChanged) {
            console.log("No meaningful change detected");
            setIsNoteSaved(true);
            return;
        }

        setIsSaving(true);
        isSavingRef.current = true;

        try {
            const currentNoteId = reduxNoteIdRef.current;
            const currentUserData = userDataRef.current;

            // Extract images from the current HTML Content
            const parser = new DOMParser();
            const doc = parser.parseFromString(currentContent, 'text/html');
            const images = Array.from(doc.querySelectorAll('img'))
                .map(img => ({
                    fileId: img.getAttribute('data-file-id'),
                    url: img.getAttribute('src')
                }))
                .filter(img => img.fileId && img.url && img.url.startsWith('http')); // Only keep valid ones

            const stringifiedImages = images.map(img => JSON.stringify(img)); // Array of JSON {fileId, url} strings
            const currentImagesFileIds = images.map(img => img.fileId);

            // Images to delete (local pending ones + orphaned old ones)
            let fileIdsToDelete = new Set();

            // Unused pending appwrite images
            const pendingImages = JSON.parse(localStorage.getItem("pending_appwrite_images") || "[]");
            pendingImages.forEach(id => {
                if (!currentImagesFileIds.includes(id)) {
                    fileIdsToDelete.add(id);
                }
            });

            if (currentNoteId) {
                // Get old note locally from Redux store instead of fetching from Server!
                const oldNote = notesEntitiesRef.current[currentNoteId];
                const oldImagesRaw = oldNote?.notes_images || [];

                const oldImages = oldImagesRaw.map(str => {
                    try { return JSON.parse(str); } catch (e) { return null; }
                }).filter(Boolean);

                oldImages.forEach(img => {
                    if (img.fileId && !currentImagesFileIds.includes(img.fileId)) {
                        fileIdsToDelete.add(img.fileId);
                    }
                });

                // UPDATE existing note
                const updatedNoteResponse = await service.updateNote(currentNoteId, {
                    slug: currentSlug,
                    Notes_title: currentTitle,
                    Notes_contents: currentContent,
                    notes_images: stringifiedImages, // Save the JSON string array
                    Is_note_important: noteDataRef.current.isimportant || false,
                });

                if (updatedNoteResponse) {
                    dispatch(updateNoteInSlice(updatedNoteResponse));
                }
            } else {
                // CREATE new note
                const userId =
                    currentUserData?.userdetaild?.userId ||
                    currentUserData?.userdetaild?.$id ||
                    currentUserData?.userId ||
                    currentUserData?.$id ||
                    "anonymous";

                const response = await service.createNote({
                    Notes_title: currentTitle,
                    slug: currentSlug,
                    Notes_contents: currentContent,
                    notes_images: stringifiedImages, // Save the JSON string array
                    Is_note_important: noteDataRef.current.isimportant || false,
                    User_Unique_ID: userId,
                });

                if (response && response.$id) {
                    dispatch(setnoteid(response.$id));
                    dispatch(addNoteToTop(response));
                }
            }

            // Successfully saved — Cleanup unused storage images
            if (fileIdsToDelete.size > 0) {
                const fileIdsArray = Array.from(fileIdsToDelete);
                for (const id of fileIdsArray) {
                    try {
                        await StorageService.deleteImage(id);
                    } catch (error) {
                        console.error(`Failed to delete orphaned image ${id}:`, error);
                    }
                }
            }

            // Clear the pending images tracking as everything is properly vetted and saved/deleted now
            localStorage.removeItem("pending_appwrite_images");

            // successfully saved — update all refs
            lastSavedContent.current = currentContent;
            lastSavedText.current = currentEditor.getText();
            lastSavedTitle.current = currentTitle;
            lastSavedSlug.current = currentSlug;
            setIsNoteSaved(true);

            // Update Redux state with full note data so it persists on refresh
            dispatch(setcurrentnoteinfo({
                title: currentTitle,
                slug: currentSlug,
                content: currentContent,
                images: stringifiedImages,
                isimportant: noteDataRef.current.isimportant || false,
            }));
        } catch (error) {
            console.error("Error saving note:", error);
        } finally {
            setIsSaving(false);
            isSavingRef.current = false;
        }
    };

    // Autosave: debounce 3 seconds after every editor change
    useEffect(() => {
        if (!editor) return;

        const handleUpdate = () => {
            // Ignore updates during programmatic loading phase
            if (!isLoaded.current) return;

            const currentContent = editor.getHTML();
            
            // Sync with Redux slice on every change to prevent data loss on unwanted refresh
            dispatch(setcurrentnoteinfo({
                title: titleRef.current,
                slug: slugRef.current,
                content: currentContent,
                images: noteDataRef.current.images || [], // Maintain existing images in Redux
                isimportant: noteDataRef.current.isimportant || false,
            }));

            // 1. IGNORE updates completely if the AI slash menu is currently open!
            if (slashOpenRef?.current) {
                return;
            }

            // 2. IGNORE updates if the only change is a trailing '/' (menu trigger fallback)
            if (editor.getText().trim().endsWith("/")) {
                return;
            }

            // Extract images helper
            const getImagesString = (html) => {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    return Array.from(doc.querySelectorAll('img'))
                        .map(img => img.getAttribute('src'))
                        .filter(Boolean)
                        .join(",");
                } catch (e) {
                    return "";
                }
            };

            // Only mark as unsaved and trigger autosave if meaningful text content or images changed
            // Stripping all whitespaces/newlines strictly ensures NO triggers on whitespace/empty line additions!
            if (cleanText(editor.getText()) !== cleanText(lastSavedText.current) ||
                getImagesString(currentContent) !== getImagesString(lastSavedContent.current)) {
                
                setIsNoteSaved(false);

                // Only schedule handleSave when there is actual unsaved changes!
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => handleSave(editor), 3000);
            }
        };

        editor.on("update", handleUpdate);

        // Schedule capture of Tiptap normalized content after loading setContent completes
        isLoaded.current = false;
        const timer = setTimeout(() => {
            if (editor.isDestroyed) return;
            lastSavedContent.current = editor.getHTML();
            lastSavedText.current = editor.getText();
            isLoaded.current = true;
            console.log("Editor content normalized and initialized successfully.");
        }, 100);

        return () => {
            editor.off("update", handleUpdate);
            clearTimeout(timer);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [editor]);

    return { title, setTitle, slug, isSaving, isNoteSaved, commitTitle, handleSave, toggleImportant, isImportant: noteData?.isimportant };
}