import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Underline from '@tiptap/extension-underline'
import TextAlign from "@tiptap/extension-text-align";
import { TextB, TextItalic, LinkSimple, Panorama, Highlighter, TextAUnderline, TextHOne, TextHTwo, Paragraph, HeadCircuit, TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight } from "@phosphor-icons/react";
import { Extension } from "@tiptap/react";
import { useState, useRef } from 'react'



const TabIndent = Extension.create({
  name: 'tabIndent',

  addKeyboardShortcuts() {
    return {
      Tab: () => {
        this.editor.commands.insertContent('\u00A0\u00A0\u00A0\u00A0') // 4 non-breaking spaces
        return true // prevent default
      },
    }
  },
})
const Editor = () => {
  let editorFocus = false;
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const linkInputRef = useRef(null);

  const editor = useEditor({
   
    onUpdate: ({ editor }) => {
      const json = editor.getHTML();
    },

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
          HTMLAttributes: {
            class: null,
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "paragraph",
          },
        },
        link: false,
        underline: false,
      }),
      Link.configure({
        openOnClick: true,
        autolink: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
          target: "_blank"
        }
      }),

      Image.configure({
        HTMLAttributes: {
          class: "editorimg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Underline,
      TabIndent,
    ],
    content: "<p className='font-bold text-red-600'>Ai powered notes ' Remove default content '</p>",
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
      <div className="flex gap-6 justify-center items-center w-full absolute top-8">
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
        ].map(({ label, icon }, idx) => {

          const onClick = () => {

            switch (label) {
              case "Bold": return editor.chain().focus().toggleBold().run();
              case "Italic": {

                return editor.chain().focus().toggleItalic().run()
              };
              case "H1": return editor.chain().focus().toggleHeading({ level: 1 }).run();
              case "H2": return editor.chain().focus().toggleHeading({ level: 2 }).run();
              case "Paragraph": return editor.chain().focus().setParagraph().run();
              case "Center": return editor.chain().focus().setTextAlign("center").run();
              case "Justify": return editor.chain().focus().setTextAlign("justify").run();
              case "Left": return editor.chain().focus().setTextAlign("left").run();
              case "Right": return editor.chain().focus().setTextAlign("right").run();
              case "Link": {
                setShowLinkInput(true);
                setTimeout(() => {
                  linkInputRef.current?.focus();
                }, 0);
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

          return (
            <button
              key={label}
              className={`cursor-pointer text-[1.5rem]  text-white font-[900] px-4 py-2 rounded-xl  transition-all duration-250 border border-[#555353] flex items-center justify-center hover:bg-black/30
              `}
              onClick={onClick}
              title={label}
            >
              {icon}
            </button>
          );
        })}
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="absolute top-[13%] right-[10%] z-50 rounded-lg p-3 transition-all duration-300">
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
        </div>
      )}
      {/* Editor Content */}
      <div className="absolute top-[11%] left-0 right-0 bottom-0 overflow-y-auto border-t-2 border-gray-600">
        <EditorContent
          editor={editor}
          className="w-full h-full p-4 text-white font-light text-[2rem]"
        />
      </div>

    </div>
  );
};

export default Editor;


