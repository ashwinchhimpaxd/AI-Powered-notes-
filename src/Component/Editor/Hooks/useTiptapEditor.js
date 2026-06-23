// here we make tiptap editor first phase of making editor initialization of editor 

import { useEffect, useCallback, useRef } from "react";
import { useEditor } from "@tiptap/react";
import { useSelector } from "react-redux";
import { TIPTAP_EXTENSIONS } from "../constants/tiptapExtensions.js";

/**
 * Initialises the Tiptap editor.
 * Slash callbacks are passed as stable refs so the editor is never recreated
 * when slash state changes.
 *
 * Uses onUpdate to detect slash commands reliably across Desktop and Mobile.
 */
export function useTiptapEditor({
  onSlashOpenRef,
  onSlashQueryRef,
  onSlashCloseRef,
  slashOpenRef,
  onEditorReady,
}) {
  const reduxNoteData = useSelector((s) => s.currentnoteinfoslice.currentnoteinfo);

  // Track if user explicitly closed the menu via Escape so we don't immediately reopen it
  const ignoreSlashRef = useRef(false);

  // Stable keydown handler for explicit keys like Escape
  const handleKeyDown = useCallback((view, event) => {
    if (slashOpenRef.current && event.key === "Escape") {
      ignoreSlashRef.current = true;
      onSlashCloseRef.current?.();
      return true; // Handled
    }
    return false;
  }, [slashOpenRef, onSlashCloseRef]);

  const editor = useEditor({
    extensions: TIPTAP_EXTENSIONS,
    content: "",
    onUpdate: ({ editor }) => {
      const { state } = editor;
      const { selection } = state;

      // We only care about text cursors
      if (!selection.empty) {
        if (slashOpenRef.current) onSlashCloseRef.current?.();
        return;
      }

      const { $from } = selection;
      // Get the text from the start of the current block up to the cursor
      const textBeforeCursor = $from.parent.textBetween(0, $from.parentOffset, null, '\ufffc');

      // Match a slash at the start of a block or after a space, followed by alphanumeric query
      const match = textBeforeCursor.match(/(?:^|\s)\/([a-zA-Z0-9-]*)$/);

      if (match && !ignoreSlashRef.current) {
        const query = match[1];

        if (!slashOpenRef.current) {
          // Open menu: Calculate coordinates
          const coords = editor.view.coordsAtPos(selection.from);

          const viewportHeight = window.innerHeight;
          const spaceBelow = viewportHeight - coords.bottom;
          const menuHeight = 360;

          let top;
          if (spaceBelow < menuHeight) {
            // Open UPWARDS
            top = coords.top + window.scrollY - menuHeight - 12;
            top = Math.max(12 + window.scrollY, top);
          } else {
            // Open DOWNWARDS
            top = coords.bottom + window.scrollY + 12;
          }

          const viewportWidth = window.innerWidth;
          const menuWidth = 320;
          let left = coords.left + window.scrollX;

          if (left + menuWidth > viewportWidth) {
            left = Math.max(12, viewportWidth - menuWidth - 24);
          }

          onSlashOpenRef.current?.({ top, left });
        }

        // Sync the query text
        onSlashQueryRef.current?.(query);
      } else {
        // If there's no match (e.g. user typed a space after the command), close the menu
        if (slashOpenRef.current) {
          onSlashCloseRef.current?.();
        }

        // Reset the ignore flag if the user deletes the slash or moves away
        if (!match) {
          ignoreSlashRef.current = false;
        }
      }
    },
    /*
    Trajectory ID: 038b0719-86c3-4241-a29b-cedb5a51add8
Error: HTTP 503 Service Unavailable
Sherlog: 
TraceID: 0x893856c48e9fcc97
Headers: {"Alt-Svc":["h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000"],"Content-Length":["518"],"Content-Type":["text/event-stream"],"Date":["Mon, 22 Jun 2026 12:08:51 GMT"],"Server":["ESF"],"Server-Timing":["gfet4t7; dur=2136"],"Vary":["Origin","X-Origin","Referer"],"X-Cloudaicompanion-Trace-Id":["893856c48e9fcc97"],"X-Content-Type-Options":["nosniff"],"X-Frame-Options":["SAMEORIGIN"],"X-Xss-Protection":["0"]}

{
  "error": {
    "code": 503,
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "domain": "cloudcode-pa.googleapis.com",
        "metadata": {
          "model": "gemini-pro-agent"
        },
        "reason": "MODEL_CAPACITY_EXHAUSTED"
      },
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "9s"
      }
    ],
    "message": "No capacity available for model gemini-pro-agent on the server",
    "status": "UNAVAILABLE"
  }
}
     */
    editorProps: {
      attributes: { class: "min-h-[60vh] outline-none focus:outline-none leading-relaxed" },
      handleKeyDown,
    },
  }, []);

  const isHydratedRef = useRef(false);

  useEffect(() => {
    if (!editor) return;

    // Load existing note content from Redux (only on mount)

    if (editor.isDestroyed) return;
    if (!isHydratedRef.current) {
      if (reduxNoteData?.content) {
        editor.commands.setContent(reduxNoteData.content);
      }
      if (onEditorReady) onEditorReady(editor);
      isHydratedRef.current = true;
    }
  }, [editor, reduxNoteData, onEditorReady]);

  return { editor };
}

