import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, CircleNotch } from "@phosphor-icons/react";

const AIEditorContentParser = ({ content, isGenerating, editor }) => {
    const originalHtmlRef = useRef(null);

    const appendRegex = /\[APPEND_TO_NOTE\]([\s\S]*?)(?:\[\/APPEND_TO_NOTE\]|$)/;
    const rewriteRegex = /\[REWRITE_NOTE\]([\s\S]*?)(?:\[\/REWRITE_NOTE\]|$)/;

    let cleanText = content;
    let actionStatus = null;

    const matchAppend = content ? content.match(appendRegex) : null;
    const matchRewrite = content ? content.match(rewriteRegex) : null;

    if (matchAppend) {
        cleanText = content.substring(0, matchAppend.index).trim();
        actionStatus = isGenerating ? 'appending' : 'completed';
    } else if (matchRewrite) {
        cleanText = content.substring(0, matchRewrite.index).trim();
        actionStatus = isGenerating ? 'rewriting' : 'completed';
    }

    useEffect(() => {
        if (!editor || !content) {
            return;
        }

        const appendRegex = /\[APPEND_TO_NOTE\]([\s\S]*?)(?:\[\/APPEND_TO_NOTE\]|$)/;
        const rewriteRegex = /\[REWRITE_NOTE\]([\s\S]*?)(?:\[\/REWRITE_NOTE\]|$)/;

        let match = content.match(appendRegex);
        if (match) {
            if (originalHtmlRef.current === null) {
                originalHtmlRef.current = editor.getHTML();
            }
            
            let tagContent = match[1];
            // Remove the closing tag if it partially matches during streaming
            tagContent = tagContent.replace(/\[\/?A?P?P?E?N?D?_?T?O?_?N?O?T?E?\]?/g, "");

            // Stream to editor
            editor.commands.setContent(originalHtmlRef.current + tagContent);
            return;
        }

        match = content.match(rewriteRegex);
        if (match) {
            let tagContent = match[1];
            tagContent = tagContent.replace(/\[\/?R?E?W?R?I?T?E?_?N?O?T?E?\]?/g, "");

            // Stream to editor
            editor.commands.setContent(tagContent);
            return;
        }
    }, [content, editor]);

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
