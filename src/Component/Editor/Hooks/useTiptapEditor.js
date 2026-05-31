// here we make tiptap editor first phase of making editor initialization of editor 

import { useEffect, useCallback } from "react";
import { useEditor } from "@tiptap/react";
import { useSelector } from "react-redux";
import { TIPTAP_EXTENSIONS } from "../constants/tiptapExtensions.js";

/**
 * Initialises the Tiptap editor.
 * Slash callbacks are passed as stable refs so the editor is never recreated
 * when slash state changes.
 *
 * Placeholder text is handled entirely by @tiptap/extension-placeholder via CSS.
 * It is never part of the actual note content.
 */
export function useTiptapEditor({
  onSlashOpenRef,
  onSlashQueryRef,
  onSlashCloseRef,
  slashOpenRef,
  onEditorReady,
}) {
  const reduxNoteData = useSelector((s) => s.currentnoteinfoslice.currentnoteinfo);

  // Stable keydown handler — never changes, reads callbacks via refs
  const handleKeyDown = useCallback((view, event) => {
    if (event.key === "/") {
      const { from } = view.state.selection;
      const coords = view.coordsAtPos(from);

      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - coords.bottom;
      const menuHeight = 360; // Max height of menu (360px list + header)

      let top;
      if (spaceBelow < menuHeight) {
        // Agar niche jagah nahi hai -> Open UPWARDS (cursor ke upar)
        top = coords.top + window.scrollY - menuHeight - 12;
        // Clamp to screen top so it doesn't go off-screen
        top = Math.max(12 + window.scrollY, top);
      } else {
        // Agar niche jagah hai -> Open DOWNWARDS (cursor ke niche)
        top = coords.bottom + window.scrollY + 12;
      }

      const viewportWidth = window.innerWidth;
      const menuWidth = 320; // w-80 width
      let left = coords.left + window.scrollX;

      // Horizontal boundary check (Right overflow protection)
      if (left + menuWidth > viewportWidth) {
        left = Math.max(12, viewportWidth - menuWidth - 24);
      }

      onSlashOpenRef.current?.({ top, left });
    } else if (slashOpenRef.current) {
      if (event.key === "Escape" || event.key === " ") {
        onSlashCloseRef.current?.();
      } else if (event.key === "Backspace") {
        onSlashQueryRef.current?.("BACKSPACE");
      } else if (event.key.length === 1) {
        onSlashQueryRef.current?.(event.key);
      }
    }
    return false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — reads everything via refs

  const editor = useEditor({
    extensions: TIPTAP_EXTENSIONS,
    content: "",          // always start empty; Placeholder extension handles the hint
    editorProps: {
      attributes: { class: "min-h-[60vh] outline-none focus:outline-none leading-relaxed" },
      handleKeyDown,
    },
  });

  useEffect(() => {
    if (!editor) return;

    // Load existing note content from Redux (only on mount)
    setTimeout(() => {
      if (editor.isDestroyed) return;
      if (reduxNoteData?.content) {
        editor.commands.setContent(reduxNoteData.content);
      }
      // If no content: leave the editor empty — Placeholder extension shows the hint
    }, 0);

    if (onEditorReady) onEditorReady(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return { editor };
}
