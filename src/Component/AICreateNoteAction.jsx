import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowSquareOut, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import service from '../AppWrite/Setgetuserdatas/config.js';
import { addNoteToTop } from '../redux/NotesCreation/NotesCreationSlice.js';
import { setnoteid, setcurrentnoteinfo } from '../redux/currentnoteinfoslice/currentnoteinfoslice.js';

const AICreateNoteAction = ({ content, isGenerating }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.UserAuthantication.UserData);

    const [cleanText, setCleanText] = useState(content);
    const [noteData, setNoteData] = useState(null);
    const [creationStatus, setCreationStatus] = useState('idle'); // idle, creating, success, error
    const [createdNoteId, setCreatedNoteId] = useState(null);

    useEffect(() => {
        // Parse the content for the [CREATE_NOTE] tag
        const createNoteRegex = /\[CREATE_NOTE\]([\s\S]*?)\[\/CREATE_NOTE\]/;
        const match = content.match(createNoteRegex);

        if (match) {
            // Remove the tag from the displayed text
            setCleanText(content.replace(createNoteRegex, '').trim());

            // Only try to create if we haven't started yet and not currently generating (to avoid partial JSON parses)
            if (creationStatus === 'idle' && !isGenerating) {
                try {
                    const jsonString = match[1].trim();
                    const parsedData = JSON.parse(jsonString);
                    if (parsedData.title && parsedData.content) {
                        setNoteData(parsedData);
                        createNoteInBackend(parsedData);
                    }
                } catch (error) {
                    console.error("Failed to parse AI Note JSON:", error);
                    setCreationStatus('error');
                }
            }
        } else {
            setCleanText(content);
        }
    }, [content, isGenerating]); // Re-run when content or generating state changes

    const createNoteInBackend = async (data) => {
        setCreationStatus('creating');
        try {
            const userId = userData?.userdetaild?.userId || 
                           userData?.userdetaild?.$id || 
                           userData?.userId || 
                           userData?.$id || 
                           "anonymous";

            // Generate a basic slug
            const cleanTitle = data.title.trim().replace(/\s+/g, " ");
            const generatedSlug = cleanTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

            const response = await service.createNote({
                Notes_title: data.title,
                slug: generatedSlug,
                Notes_contents: data.content,
                notes_images: [],
                Is_note_important: false,
                User_Unique_ID: userId,
            });

            if (response && response.$id) {
                setCreatedNoteId(response.$id);
                // Immediately add to Redux Recent Notes slice
                dispatch(addNoteToTop(response));
                setCreationStatus('success');
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Failed to create note from AI command:", error);
            setCreationStatus('error');
        }
    };

    const handleOpenNote = () => {
        if (!createdNoteId || !noteData) return;
        
        const cleanTitle = noteData.title.trim().replace(/\s+/g, " ");
        const generatedSlug = cleanTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

        // Set the current note info in Redux
        dispatch(setnoteid(createdNoteId));
        dispatch(setcurrentnoteinfo({
            title: noteData.title,
            slug: generatedSlug,
            content: noteData.content,
            images: [],
            isimportant: false
        }));

        // Navigate to the editor
        if (generatedSlug) {
            navigate(`/Dashboard/editor/${generatedSlug}`);
        } else {
            navigate('/Dashboard/editor');
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Display the clean text response from AI */}
            {cleanText && (
                <p className="text-sm whitespace-pre-wrap text-white">
                    {cleanText}
                </p>
            )}

            {/* Display the Interactive Note Creation Card */}
            {noteData && (
                <div className="mt-2 bg-black/20 border border-white/10 rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-md">
                            <FileText className="size-6 text-primary" weight="duotone" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white text-sm font-medium line-clamp-1">
                                {noteData.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                {creationStatus === 'creating' && (
                                    <>
                                        <CircleNotch className="size-3.5 text-blue-400 animate-spin" />
                                        <span className="text-xs text-blue-400">Creating note...</span>
                                    </>
                                )}
                                {creationStatus === 'success' && (
                                    <>
                                        <CheckCircle className="size-3.5 text-green-400" />
                                        <span className="text-xs text-green-400">Saved to Recent Notes</span>
                                    </>
                                )}
                                {creationStatus === 'error' && (
                                    <span className="text-xs text-red-400">Failed to create note</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {creationStatus === 'success' && (
                        <button
                            onClick={handleOpenNote}
                            className="w-full flex items-center justify-center gap-2 py-2 mt-1 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors text-sm"
                        >
                            <ArrowSquareOut className="size-4" /> Open Note
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AICreateNoteAction;
