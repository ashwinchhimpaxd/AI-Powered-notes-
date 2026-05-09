import React, { memo } from "react";
import { EditorContent } from "@tiptap/react";
import BubbleToolbar from "./BubbleToolbar.jsx";

/**
 * The writing canvas: renders the BubbleMenu and EditorContent.
 * Kept intentionally minimal — all logic lives in hooks.
 */
const EditorCanvas = memo(function EditorCanvas({ editor }) {
  if (!editor) return null;

  return (
    <div className="w-full max-w-[75vw] mt-24 mb-40 px-6 z-10 ">
      <BubbleToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="w-full text-[1.05rem] text-white/85 antialiased "
      />
    </div>
  );
});

export default EditorCanvas;
