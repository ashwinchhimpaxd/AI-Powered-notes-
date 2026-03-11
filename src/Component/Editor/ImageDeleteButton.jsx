import React, { useEffect, useState } from "react";
import { Trash } from "@phosphor-icons/react";

const ImageDeleteButton = ({ editor }) => {
    const [buttonState, setButtonState] = useState({
        visible: false,
        top: 0,
        left: 0,
        pos: null, // ProseMirror position of the image node
    });

    useEffect(() => {
        if (!editor) return;

        let hideTimeout;

        const handleMouseMove = (event) => {
            try {
                if (editor.isDestroyed || !editor.view || !editor.view.dom) return;
            } catch (error) {
                return; // Editor view not available yet
            }

            const target = event.target;

            // If mouse moves over an image that belongs to the editor
            if (target && target.tagName === "IMG" && editor.view.dom.contains(target)) {

                // Clear any pre-existing timeout to hide the button
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                }

                // Calculate position for the button (Top Right of the image)
                const rect = target.getBoundingClientRect();

                // We need to find the node's position in the document so we can delete it
                const pos = editor.view.posAtDOM(target, 0);

                if (pos !== null) {
                    setButtonState({
                        visible: true,
                        // Placing it at the top right corner of the image, with a small offset
                        top: rect.top + 8,
                        left: rect.right - 36, // 36px from the right edge
                        pos: pos
                    });
                }
            } else {
                // Determine if we're hovering over the button itself
                const isHoveringButton = event.target.closest('#tiptap-image-delete-btn');

                if (!isHoveringButton && buttonState.visible) {
                    // Add a small delay so moving mouse from image to button doesn't hide it instantly
                    if (hideTimeout) clearTimeout(hideTimeout);

                    hideTimeout = setTimeout(() => {
                        setButtonState(prev => ({ ...prev, visible: false }));
                    }, 150);
                }
            }
        };

        const handleScroll = () => {
            // Hide button on scroll to avoid alignment issues
            if (buttonState.visible) {
                setButtonState(prev => ({ ...prev, visible: false }));
            }
        };

        // Attach event listener to document
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("scroll", handleScroll, true); // true to capture all scroll events

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("scroll", handleScroll, true);
            if (hideTimeout) clearTimeout(hideTimeout);
        };
    }, [editor, buttonState.visible]);

    if (!buttonState.visible || buttonState.pos === null) return null;

    const handleDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();

        try {
            if (!editor || editor.isDestroyed || !editor.view) return;
        } catch (error) {
            return;
        }

        if (editor && buttonState.pos !== null) {
            // Log the pos for debugging
            console.log("Deleting node at pos: ", buttonState.pos);

            try {
                // Resolving position and deleting the node. 
                // Images are usually inline nodes, we select it and delete.
                const tr = editor.state.tr;
                const nodeSize = tr.doc.nodeAt(buttonState.pos)?.nodeSize || 1;

                editor.view.dispatch(
                    tr.delete(buttonState.pos, buttonState.pos + nodeSize)
                );

                // Hide button after successful deletion
                setButtonState({ visible: false, top: 0, left: 0, pos: null });
            } catch (error) {
                console.error("Error deleting image: ", error);
            }
        }
    };

    return (
        <button
            id="tiptap-image-delete-btn"
            onClick={handleDelete}
            style={{
                top: buttonState.top,
                left: buttonState.left,
            }}
            className="fixed z-[9999] p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow-md transition-colors duration-200 cursor-pointer flex items-center justify-center opacity-90 hover:opacity-100"
            title="Delete Image"
        >
            <Trash size={18} weight="fill" />
        </button>
    );
};

export default ImageDeleteButton;
