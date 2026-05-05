import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontSize from "./FontSize";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import service from "../../AppWrite/Setgetuserdatas/config";
import { setcurrentnoteinfo } from "../../redux/currentnoteinfoslice/currentnoteinfoslice";
import EditorToolbar from "../Editor/Toolbar"; // ✅ IMPORT TOOLBAR
import AIAssistantChat from "../AIAssistantChat";
import ImageDeleteButton from "./ImageDeleteButton"; // ✅ IMPORT IMAGE DELETE BUTTON
import StorageService from "../../AppWrite/Setgetuserdatas/StorageImages/ImageUpload";

// ✅ Custom Image Extension to support data-file-id
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-file-id": {
        default: null,
        parseHTML: element => element.getAttribute('data-file-id'),
        renderHTML: attributes => {
          if (!attributes['data-file-id']) {
            return {};
          }
          return { 'data-file-id': attributes['data-file-id'] };
        }
      },
      loading: {
        default: "lazy",
      },
    };
  },
});

// Define extensions outside to prevent duplicate extension warnings on re-renders
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
  CustomImage.configure({
    inline: true,
    resize: {
      enabled: true,
      directions: ['top', 'bottom', 'left', 'right'],
      minWidth: 50,
      minHeight: 50,
      alwaysPreserveAspectRatio: true,
    },
  }),
  TextStyle,
  Color,
  FontSize,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
];

function Editor2({ onEditorReady }) {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const dispatch = useDispatch();
  const reduxNoteId = useSelector((state) => state.currentnoteinfoslice.noteid);
  const reduxNoteData = useSelector((state) => state.currentnoteinfoslice.currentnoteinfo);
  const [isNoteLoaded, setIsNoteLoaded] = useState(false);

  // Clean up any pending Appwrite images left over from a previous abandoned session
  useEffect(() => {
    const cleanupPendingImages = async () => {
      const pendingImages = JSON.parse(localStorage.getItem("pending_appwrite_images") || "[]");
      if (pendingImages.length > 0) {
        console.log("Cleaning up orphaned pending images...");
        for (const fileId of pendingImages) {
          try {
            await StorageService.deleteImage(fileId);
          } catch (error) {
            console.error(`Failed to delete orphaned image ${fileId}:`, error);
          }
        }
        localStorage.removeItem("pending_appwrite_images");
      }
    };
    cleanupPendingImages();
  }, []);


  const editor = useEditor({
    extensions,
    content: reduxNoteData?.content || "",
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

  // Load content priority: Redux (Instant UX) -> Server (Fallback if Cache Cleared)
  useEffect(() => {
    if (!editor) return;
    let isMounted = true;

    const loadNote = async () => {
      // 1. If Redux has the content already, load it INSTANTLY. (Fast UX - No API wait)
      if (reduxNoteData && typeof reduxNoteData.content === 'string') {
          setTimeout(() => {
             if (isMounted && !editor.isDestroyed) {
                 if (editor.getHTML() !== reduxNoteData.content) {
                     editor.commands.setContent(reduxNoteData.content);
                 }
                 setIsNoteLoaded(true);
             }
          }, 50); // slight delay to ensure editor DOM is fully painted
          return;
      }

      // 2. Fallback: If Redux is empty but we have an ID (e.g. cleared cache), fetch from Server
      if (reduxNoteId) {
        try {
           const serverNote = await service.getNote(reduxNoteId);
           // NOTE: Appwrite stores the content in 'notes_contect' (typo in schema)
           if (serverNote && typeof serverNote.notes_contect === 'string' && isMounted) {
               dispatch(setcurrentnoteinfo({
                   title: serverNote.Notes_title || "",
                   slug: serverNote.slug || "",
                   content: serverNote.notes_contect,
                   images: serverNote.notes_images || [],
                   isimportant: serverNote.Is_note_important || false,
               }));
               setTimeout(() => {
                 if (isMounted && !editor.isDestroyed) {
                    editor.commands.setContent(serverNote.notes_contect);
                    setIsNoteLoaded(true);
                 }
               }, 50);
               return; 
           }
        } catch (error) {
           console.error("Failed to load from server fallback", error);
        }
      }

      if (isMounted) setIsNoteLoaded(true);
    };

    loadNote();

    return () => { isMounted = false; };
  }, [editor, reduxNoteId, reduxNoteData?.content, dispatch]);



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
          isAiChatOpen={isAiChatOpen}
          toggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
        />
      </div>

      <div className="flex-1 overflow-hidden w-full flex">
        {/* ✅ EDITOR CANVAS (A4 Page Style) */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center py-10 px-4 transition-all duration-300 ease-in-out relative">
          <ImageDeleteButton editor={editor} />
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
              <AIAssistantChat isSidebar={true} editor={editor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor2;
