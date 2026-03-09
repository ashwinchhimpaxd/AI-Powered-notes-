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
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontSize from "./FontSize";
import { useEffect, useState } from "react";
import EditorToolbar from "../Editor/Toolbar"; // ✅ IMPORT TOOLBAR
import AIAssistantChat from "../AIAssistantChat";


function Editor2({ onEditorReady }) {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const extensions = [
    StarterKit.configure({
      blockquote: {
        HTMLAttributes: {
          class: "border-l-4 border-slate-400 bg-slate-100 dark:bg-white/5 dark:border-white/20 text-slate-700 dark:text-slate-300 pl-4 py-3 italic my-4 rounded-r-md",
        },
      },
    }),
    Highlight.configure({ HTMLAttributes: { class: "editor-text-highlighted" }, multicolor: true }),
    Underline,
    Link.extend({ inclusive: false }).configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: { class: "text-sky-400 underline cursor-pointer" },
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
    TextStyle,
    Color,
    FontSize,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ];
  const editor = useEditor({
    extensions,
    content: "start typing here",
    immediatelyRender: true,
    editorProps: {
      attributes: {
        class: "min-h-[800px] outline-none prose max-w-none",
      },
      handleClick: (view, pos, event) => {
        const { target } = event;
        if (event.altKey && target && target.tagName === "A") {
          const href = target.getAttribute("href");
          if (href) {
            window.open(href, "_blank");
            return true;
          }
        }
        return false;
      },
    },

    onUpdate: async ({ editor }) => {
      const content = JSON.stringify(editor.getJSON());
      localStorage.setItem("editor_content", content);
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
    <div className="flex flex-col w-full h-full overflow-hidden bg-gray-100 dark:bg-neutral-900">
      {/* ✅ TOOLBAR COMPONENT */}
      <div className="w-full relative z-[100] shadow-sm border-b border-gray-300 dark:border-white/10 bg-[#1e1e1e]">
        <EditorToolbar
          editor={editor}
          Usertype={" "}
          isAiChatOpen={isAiChatOpen}
          toggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
        />
      </div>

      <div className="flex-1 overflow-hidden w-full flex">
        {/* ✅ EDITOR CANVAS (A4 Page Style) */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center py-10 px-4 transition-all duration-300 ease-in-out">
          <EditorContent
            editor={editor}
            className="w-full max-w-[816px] min-h-[1056px] bg-white shadow-xl px-[4rem] py-[5rem] text-[1.1rem] leading-relaxed text-black rounded-sm border border-gray-200 outline-none focus:outline-none"
          />
        </div>

        {/* ✅ AI CHAT SIDEBAR */}
        <div
          className={`overflow-y-auto bg-transparent border-l border-white/5 transition-all duration-300 ease-in-out shrink-0`}
          style={{ width: isAiChatOpen ? '40vw' : '0px' }}
        >
          <div className="w-[39vw] h-full p-4 overflow-hidden">
            <h3 className="text-white text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--primary-text-color)" }}>
              AI Assistant
            </h3>
            <div className="h-[calc(100%-3rem)]">
              <AIAssistantChat isSidebar={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor2;
