import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Underline from '@tiptap/extension-underline'
import TextAlign from "@tiptap/extension-text-align";
import Bold from '@tiptap/extension-bold'
import { TextB, TextItalic, LinkSimple, Panorama, Highlighter, TextAUnderline, TextHOne, TextHTwo, Paragraph, HeadCircuit, TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight } from "@phosphor-icons/react";
import { Extension } from "@tiptap/react";
import { useState, useRef } from 'react'
import { Dropcursor } from '@tiptap/extensions'




const Editor =  () => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [content, setContent] = useState("");
  const linkInputRef = useRef(null);
  const editor = useEditor({

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      localStorage.setItem("editor_content", html);
    },

    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
          target: "_blank"
        }
      }),

      Image.configure({
        resize: {
          enabled: true,
          directions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
          min: { width: 50, height: 50 },
          preserveAspectRatio: true,
          className: {
            wrapper: 'my-resize-wrapper',
            handle: 'my-resize-handle',
            container: 'my-resize-container',
            resizing: 'is-resizing',
          },
        },
        HTMLAttributes: { class: 'editorimg' },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Underline,
      TabIndent,
      Bold
    ],
    content: localStorage.getItem("editor_content") || "<p>Start typing...</p>",
    shouldRerenderOnTransaction: true,
    immediatelyRender: true,
  });

  // Fix: Use TipTap's setLink command correctly
  const handleLinkSubmit = () => {
    const url = linkValue.trim();
    if (!url) return;

    const { state } = editor;
    const { from, to } = state.selection;

    if (from === to) {
      // No text selected: insert the link as text with the link mark
      editor.chain().focus()
        .insertContent({
          type: 'text',
          text: url,
          marks: [
            {
              type: 'link',
              attrs: { href: url, target: "_blank" }
            }
          ]
        })
        .run();
    } else {
      // Text selected: apply link to selection
      editor.chain().focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    }

    setShowLinkInput(false);
    setLinkValue("");
  };

  if (!editor) return null;

  return (
    <div className="relative border rounded-4xl h-screen w-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-[0.05rem]  justify-end items-center w-full absolute top-7 right-10">
        {[
          { label: "Bold", icon: <TextB /> },
          { label: "Italic", icon: <TextItalic /> },
          { label: "H1", icon: <TextHOne /> },
          { label: "H2", icon: <TextHTwo /> },
          { label: "Paragraph", icon: <Paragraph /> },
          { label: "Center", icon: <TextAlignCenter /> },
          { label: "Justify", icon: <TextAlignJustify /> },
          { label: "Left", icon: <TextAlignLeft /> },
          { label: "Right", icon: <TextAlignRight /> },
          { label: "Highlight", icon: <Highlighter /> },
          { label: "Underline", icon: <TextAUnderline /> },
          { label: "Link", icon: <LinkSimple /> },
          { label: "Image", icon: <Panorama /> },
          { label: "Ai chat Assistant", icon: <HeadCircuit /> },
        ].map(({ label, icon }) => {
          const onClick = () => {

            switch (label) {
              case "Bold": {
                return editor.chain().focus().toggleBold().run();
              }
              case "Italic": return editor.chain().focus().toggleItalic().run()
              case "H1": return editor.chain().focus().toggleHeading({ level: 1 }).run();
              case "H2": return editor.chain().focus().toggleHeading({ level: 2 }).run();
              case "Paragraph": return editor.chain().focus().setParagraph().run();
              case "Center": return editor.chain().focus().setTextAlign("center").run();
              case "Justify": return editor.chain().focus().setTextAlign("justify").run();
              case "Left": return editor.chain().focus().setTextAlign("left").run();
              case "Right": return editor.chain().focus().setTextAlign("right").run();
              case "Link": {
                setShowLinkInput(true);

                linkInputRef.current?.focus();

                return;
              }
              case "Image": {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";

                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = reader.result;
                    editor.chain().focus().setImage({ src: base64 }).run();
                  };
                  reader.readAsDataURL(file);
                };

                input.click();
                return;
              }
              case "Highlight": return editor.chain().focus().toggleHighlight().run();
              case "Underline": return editor.chain().focus().toggleUnderline().run();
              default: return;
            }
          };
          const isActive = (() => {
            switch (label) {
              case "Bold": return editor.isActive("bold");
              case "Italic": return editor.isActive("italic");
              case "Underline": return editor.isActive("underline");
              case "Highlight": return editor.isActive("highlight");
              // for headings:
              case "H1": return editor.isActive("heading", { level: 1 });
              case "H2": return editor.isActive("heading", { level: 2 });
              // and so on...
              default: return false;
            }
          })();
          return (
            <div className="group relative z-10" key={label}>
              <button
                className={`cursor-pointer text-[1.5rem]  text-white font-[900] px-4 py-2 rounded-xl  transition-all duration-250   flex items-center justify-center hover:bg-black/30
                `}
                onClick={onClick}
                style={{
                  backgroundColor: isActive ? "red" : "transparent",
                }}
              >
                {icon}
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 mb-0 px-2 py-1 bg-gray-500 text-white text-[0.9rem] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {label}
              </div>
            </div>
          );

        })}
      </div>

      {/* Link Input */}
      {
        showLinkInput && (
          <div className="flex justify-center items-center absolute  top-[13%] right-[10%] z-50 rounded-lg p-3 transition-all duration-300 ">
            <input
              ref={linkInputRef}
              type="text"
              placeholder="Paste your link and press Enter"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLinkSubmit();
                }
                if (e.key === "Escape") {
                  setShowLinkInput(false);
                  setLinkValue("");
                }
              }}
              className="bg-[#111] text-white border-none  p-2 rounded w-72 focus:outline-none"
            />
            <p className="absolute text-gray-400 right-5 m-auto  p-[0.2em] text-[1.1rem] cursor-pointer" onClick={() => setShowLinkInput(false)}
            >X</p>
          </div>
        )
      }
      {/* Editor Content */}
      <div className="absolute top-[11%] left-0 right-0 bottom-0 overflow-y-auto border-t-2 border-gray-600">
        <EditorContent
          editor={editor}
          className="w-full h-full p-4 text-white font-light text-[2rem]"
        />
      </div>

    </div >
  );
};

export default Editor;


