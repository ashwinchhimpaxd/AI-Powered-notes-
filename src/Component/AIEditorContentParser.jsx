import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, CircleNotch } from "@phosphor-icons/react";

const AIEditorContentParser = ({ content, isGenerating, editor }) => {
    const [cleanText, setCleanText] = useState(content);
    const [actionStatus, setActionStatus] = useState(null); // 'appending', 'rewriting', 'completed'
    const originalHtmlRef = useRef(null);
    const hasProcessedCompletion = useRef(false);

    useEffect(() => {
        if (!editor) {
            setCleanText(content);
            return;
        }

        const appendRegex = /\[APPEND_TO_NOTE\]([\s\S]*?)(?:\[\/APPEND_TO_NOTE\]|$)/;
        const rewriteRegex = /\[REWRITE_NOTE\]([\s\S]*?)(?:\[\/REWRITE_NOTE\]|$)/;

        let match = content.match(appendRegex);
        if (match) {
            if (originalHtmlRef.current === null) {
                originalHtmlRef.current = editor.getHTML();
            }
            
            const textBeforeTag = content.substring(0, match.index);
            let tagContent = match[1];
            // Remove the closing tag if it partially matches during streaming
            tagContent = tagContent.replace(/\[\/?A?P?P?E?N?D?_?T?O?_?N?O?T?E?\]?/g, "");

            setCleanText(textBeforeTag.trim());
            setActionStatus(isGenerating ? 'appending' : 'completed');
            
            // Stream to editor
            editor.commands.setContent(originalHtmlRef.current + tagContent);
            return;
        }

        match = content.match(rewriteRegex);
        if (match) {
            const textBeforeTag = content.substring(0, match.index);
            let tagContent = match[1];
            tagContent = tagContent.replace(/\[\/?R?E?W?R?I?T?E?_?N?O?T?E?\]?/g, "");

            setCleanText(textBeforeTag.trim());
            setActionStatus(isGenerating ? 'rewriting' : 'completed');
            
            // Stream to editor
            editor.commands.setContent(tagContent);
            return;
        }

        // If no tags found, just display normal text
        setCleanText(content);
        if (!isGenerating && !match) {
            setActionStatus(null);
        }
    }, [content, isGenerating, editor]);

    return (
        <div className="flex flex-col gap-2">
            {/* Display the clean conversational text before any tags */}
            {cleanText && (
                <p className="text-sm whitespace-pre-wrap text-white">
                    {cleanText}
                </p>
            )}

            {/* Display the Status Widget if an editor action is triggered */}
            {actionStatus && (
                <div className="mt-2 bg-black/20 border border-white/10 rounded-lg p-3 flex items-center gap-3">
                    {(actionStatus === 'appending' || actionStatus === 'rewriting') && (
                        <>
                            <CircleNotch className="size-4 text-blue-400 animate-spin" />
                            <p className="text-xs text-blue-400">
                                {actionStatus === 'appending' ? 'Appending to editor...' : 'Rewriting note in editor...'}
                            </p>
                        </>
                    )}
                    {actionStatus === 'completed' && (
                        <>
                            <CheckCircle className="size-4 text-green-400" />
                            <p className="text-xs text-green-400">
                                Editor successfully updated.
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AIEditorContentParser;
