import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align";
import Text from "@tiptap/extension-text";
import { BulletList } from "@tiptap/extension-list";
import { Dropcursor } from "@tiptap/extensions";
import { useEffect } from "react";
import EditorToolbar from "../Editor/Toolbar"; // ✅ IMPORT TOOLBAR


function Editor2({ onEditorReady }) {
  const extensions = [
    StarterKit,
    Highlight.configure({ HTMLAttributes: { class: "editor-text-highlighted" }, multicolor: true }),
    Underline,
    Link.configure({
      openOnClick: true,
      HTMLAttributes: { class: "text-sky-400 underline" },
    }),
    Image.configure({
      inline: true,
      resize: {
        enabled: true,
        directions: ['top', 'bottom', 'left', 'right'], // can be any direction or diagonal combination
        minWidth: 50,
        minHeight: 50,
        alwaysPreserveAspectRatio: true,
      },
    }),
    Dropcursor,
    BulletList,
    Text,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ];
  const editor = useEditor({
    extensions,
    content: localStorage.getItem("editor_content") || "start typing here",
    immediatelyRender: true,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      localStorage.setItem("editor_content", html);
    },
  });


  // ✅ Jaise hi editor ready ho, parent ko bhej diya
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col  relative w-full h-full border-[0.3px] border-white/30 rounded-2xl overflow-hidden">
      {/* ✅ TOOLBAR COMPONENT */}
      <EditorToolbar editor={editor} className="z-10!" />

      {/* ✅ EDITOR */}
      <div className="flex-1 overflow-y-auto ">
        <EditorContent
          editor={editor}
          className="w-full h-full  p-[0.8rem]  text-[1.5rem] text-black border-2 bg-[#e9e7e7]"
        />
      </div>
    </div>
  );
}

export default Editor2;
