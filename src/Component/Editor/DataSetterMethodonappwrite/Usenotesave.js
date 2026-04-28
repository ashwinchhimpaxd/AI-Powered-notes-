import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setcurrentnoteinfo,
    setnoteid,
} from "../../../redux/currentnoteinfoslice/currentnoteinfoslice.js";
import { addNoteToTop, updateNoteInSlice } from "../../../redux/NotesCreation/NotesCreationSlice.js";
import service from "../../../AppWrite/Setgetuserdatas/config.js";
import StorageService from "../../../AppWrite/Setgetuserdatas/StorageImages/ImageUpload.js";

/**
 * useNoteSave
 * Handles all save logic: autosave (debounce), manual save,
 * slug generation, Redux dispatch.
 * Completely separate from UI — EditorToolbar just calls this hook.
 */
export function useNoteSave(editor) {
    const dispatch = useDispatch();

    // Redux state
    const reduxNoteId = useSelector((state) => state.currentnoteinfoslice.noteid);
    const userData = useSelector((state) => state.UserAuthantication.UserData);
    const noteData = useSelector((state) => state.currentnoteinfoslice.currentnoteinfo);
    const noteTitle = noteData.title;

    // Local state
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isNoteSaved, setIsNoteSaved] = useState(true);
    // Refs — keep latest values accessible inside async callbacks & timeouts
    const userDataRef = useRef(userData);
    const reduxNoteIdRef = useRef(reduxNoteId);
    const titleRef = useRef(title);
    const slugRef = useRef(slug);
    const noteDataRef = useRef(noteData);
    const lastSavedContent = useRef("");
    const lastSavedText = useRef("");
    const lastSavedTitle = useRef("");
    const lastSavedSlug = useRef("");
    const timeoutRef = useRef(null);
    const isSavingRef = useRef(false);

    // Sync refs whenever state/redux updates
    useEffect(() => { userDataRef.current = userData; }, [userData]);
    useEffect(() => { reduxNoteIdRef.current = reduxNoteId; }, [reduxNoteId]);
    useEffect(() => { noteDataRef.current = noteData; }, [noteData]);
    useEffect(() => { titleRef.current = title; }, [title]);
    useEffect(() => { slugRef.current = slug; }, [slug]);

    // On mount: hydrate title + slug from Redux if a note is already loaded
    useEffect(() => {
        if (!noteTitle) return;
        const cleanTitle = noteTitle.trim().replace(/\s+/g, " ");
        const generatedSlug = cleanTitle
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

        setTitle(cleanTitle);
        setSlug(generatedSlug);
        // Initialize last saved values to match current state (since it's loaded from DB)
        lastSavedTitle.current = cleanTitle;
        lastSavedSlug.current = generatedSlug;
        
        dispatch(setcurrentnoteinfo({ title: cleanTitle, slug: generatedSlug }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        dispatch(setcurrentnoteinfo({
            ...noteDataRef.current,
            isimportant: newValue
        }));
        setIsNoteSaved(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => handleSave(editorInstance), 1000);
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

        // Strip function to remove ALL whitespace and &nbsp; for comparison
        const strip = (str) => str.replace(/\s/g, "").replace(/&nbsp;/g, "").replace(/<br\s*\/?>/g, "");
        
        // Detect if content changed (ignoring whitespace)
        const contentChanged = strip(currentContent) !== strip(lastSavedContent.current) || 
                             textContent !== lastSavedText.current;
        
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
                // Fetch old note to find removed images from notes_images array
                const oldNote = await service.getNote(currentNoteId);
                const oldImagesRaw = oldNote.notes_images || [];
                
                const oldImages = oldImagesRaw.map(str => {
                  try { return JSON.parse(str); } catch(e) { return null; }
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
            lastSavedText.current = textContent;
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
            const currentContent = editor.getHTML();
            const textContent = editor.getText().trim();
            const strip = (str) => str.replace(/\s/g, "").replace(/&nbsp;/g, "").replace(/<br\s*\/?>/g, "");

            // Only mark as unsaved if meaningful content changed
            if (strip(currentContent) !== strip(lastSavedContent.current) || 
                textContent !== lastSavedText.current) {
                setIsNoteSaved(false);
            }

            // Sync with Redux slice on every change to prevent data loss on unwanted refresh
            dispatch(setcurrentnoteinfo({
                title: titleRef.current,
                slug: slugRef.current,
                content: currentContent,
                images: [], // Images array fully syncs on actual server save
                isimportant: noteDataRef.current.isimportant || false,
            }));

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => handleSave(editor), 3000);
        };

        editor.on("update", handleUpdate);

        return () => {
            editor.off("update", handleUpdate);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [editor]);

    return { title, setTitle, slug, isSaving, isNoteSaved, commitTitle, handleSave, toggleImportant, isImportant: noteData?.isimportant };
}