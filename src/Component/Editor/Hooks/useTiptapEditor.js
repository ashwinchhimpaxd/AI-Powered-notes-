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
      const coords   = view.coordsAtPos(from);
      onSlashOpenRef.current?.({ top: coords.bottom + window.scrollY + 12, left: coords.left + window.scrollX });
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
