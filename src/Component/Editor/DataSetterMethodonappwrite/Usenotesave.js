import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setcurrentnoteinfo,
    setnoteid,
} from "../../../redux/currentnoteinfoslice/currentnoteinfoslice.js";
import service from "../../../AppWrite/Setgetuserdatas/config.js";

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
    const noteTitle = useSelector((state) => state.currentnoteinfoslice.currentnoteinfo.title);

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
    const lastSavedContent = useRef("");
    const lastSavedText = useRef("");
    const lastSavedTitle = useRef("");
    const lastSavedSlug = useRef("");
    const timeoutRef = useRef(null);
    const isSavingRef = useRef(false);

    // Sync refs whenever state/redux updates
    useEffect(() => { userDataRef.current = userData; }, [userData]);
    useEffect(() => { reduxNoteIdRef.current = reduxNoteId; }, [reduxNoteId]);
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
            dispatch(setcurrentnoteinfo({ title: cleanTitle, slug: generatedSlug }));
        } else {
            setSlug("");
            dispatch(setcurrentnoteinfo({ title: "", slug: "" }));
        }

        // Check if title or slug actually changed from last save
        if (cleanTitle !== lastSavedTitle.current || generatedSlug !== lastSavedSlug.current) {
            setIsNoteSaved(false);
        }
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

            if (currentNoteId) {
                // UPDATE existing note
                await service.updateNote(currentNoteId, {
                    slug: currentSlug,
                    Notes_title: currentTitle,
                    Notes_contents: currentContent,
                    Notes_Images_urls: [],
                    Is_note_important: false,
                });
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
                    Notes_Images_urls: [],
                    Is_note_important: false,
                    User_Unique_ID: userId,
                });

                if (response?.$id) {
                    dispatch(setnoteid(response.$id));
                }
            }

            // Successfully saved — update all refs
            lastSavedContent.current = currentContent;
            lastSavedText.current = textContent;
            lastSavedTitle.current = currentTitle;
            lastSavedSlug.current = currentSlug;
            setIsNoteSaved(true);
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

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => handleSave(editor), 3000);
        };

        editor.on("update", handleUpdate);

        return () => {
            editor.off("update", handleUpdate);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [editor]);

    return { title, setTitle, slug, isSaving, isNoteSaved, commitTitle, handleSave };
}