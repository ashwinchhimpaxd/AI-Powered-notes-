import React, { useCallback, useState } from "react";
import {
  TextB, TextItalic, LinkSimple, Panorama, Highlighter,
  TextAUnderline, TextHOne, TextHTwo, Paragraph,
  TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight,
  ListBullets, ListNumbers, TextStrikethrough, Code, Quotes,
  Palette, FileText, Sparkle, CircleNotch, Star,
} from "@phosphor-icons/react";

import { useNoteSave } from "./DataSetterMethodonappwrite/Usenotesave.js";
import {
  ToolbarButton,
  HighlightPicker,
  ColorPicker,
  LinkInput,
  FontSizeDropdown,
} from "./Toolbarcomponents.jsx";
import { useImageUpload } from "./Hooks/useImageUpload.js";

// ─── Toolbar icon group definitions ──────────────────────────────────────

const FORMATTING_ICONS = [
  { label: "Bold",      icon: <TextB /> },
  { label: "Italic",    icon: <TextItalic /> },
  { label: "Underline", icon: <TextAUnderline /> },
  { label: "Strike",    icon: <TextStrikethrough /> },
  { label: "Code",      icon: <Code /> },
  { label: "Highlight", icon: <Highlighter /> },
  { label: "TextColor", icon: <Palette /> },
];

const TYPOGRAPHY_ICONS = [
  { label: "H1",         icon: <TextHOne /> },
  { label: "H2",         icon: <TextHTwo /> },
  { label: "Paragraph",  icon: <Paragraph /> },
  { label: "Blockquote", icon: <Quotes /> },
];

const LIST_ALIGN_ICONS = [
  { label: "Bullet",  icon: <ListBullets /> },
  { label: "Number",  icon: <ListNumbers /> },
  { label: "Left",    icon: <TextAlignLeft /> },
  { label: "Center",  icon: <TextAlignCenter /> },
  { label: "Right",   icon: <TextAlignRight /> },
  { label: "Justify", icon: <TextAlignJustify /> },
];

const INSERT_ICONS = [
  { label: "Link",  icon: <LinkSimple /> },
  { label: "Image", icon: <Panorama /> },
];

// ─── Editor command dispatcher ────────────────────────────────────────────

function runEditorCommand(editor, label, value, handleImageUpload) {
  switch (label) {
    case "Bold":       return editor.chain().focus().toggleBold().run();
    case "Italic":     return editor.chain().focus().toggleItalic().run();
    case "Underline":  return editor.chain().focus().toggleUnderline().run();
    case "Strike":     return editor.chain().focus().toggleStrike().run();
    case "Code":       return editor.chain().focus().toggleCode().run();
    case "Highlight":  return editor.chain().focus().toggleHighlight({ color: value.color }).run();
    case "TextColor":  return editor.chain().focus().setColor(value.color).run();
    case "FontSize":   return editor.chain().focus().setFontSize(value).run();
    case "H1":         return editor.chain().focus().unsetFontSize().toggleHeading({ level: 1 }).run();
    case "H2":         return editor.chain().focus().unsetFontSize().toggleHeading({ level: 2 }).run();
    case "Paragraph":  return editor.chain().focus().unsetFontSize().setParagraph().run();
    case "Blockquote": return editor.chain().focus().toggleBlockquote().run();
    case "Bullet":     return editor.chain().focus().toggleBulletList().run();
    case "Number":     return editor.chain().focus().toggleOrderedList().run();
    case "Left":       return editor.chain().focus().setTextAlign("left").run();
    case "Center":     return editor.chain().focus().setTextAlign("center").run();
    case "Right":      return editor.chain().focus().setTextAlign("right").run();
    case "Justify":    return editor.chain().focus().setTextAlign("justify").run();
    case "Image": {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = input.files?.[0];
        if (file && handleImageUpload) {
          handleImageUpload(editor, file);
        }
      };
      input.click();
      return;
    }
    case "SaveLink": {
      if (!value) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
      }
      return;
    }
    default: return;
  }
}

// ─── IconGroup ────────────────────────────────────────────────────────────
// Renders a labelled group of toolbar icons, with special handling for
// Highlight, TextColor and Link (which have their own sub-components).

function IconGroup({ icons, groupLabel, editor, activePopover, onTogglePopover, handleImageUpload }) {
  return (
    <div className="flex flex-col items-center justify-between border-r-[1px] border-white/10 px-4 h-full min-w-max">
      <div className="flex gap-1 items-center justify-center flex-1">
        {icons.map((item) => {
          if (item.label === "Highlight") {
            return (
              <HighlightPicker
                key={item.label}
                icon={item.icon}
                isOpen={activePopover === "Highlight"}
                onToggle={() => onTogglePopover("Highlight")}
                onPick={(color) => {
                  runEditorCommand(editor, "Highlight", color, handleImageUpload);
                  onTogglePopover(null);
                }}
              />
            );
          }

          if (item.label === "TextColor") {
            return (
              <ColorPicker
                key={item.label}
                icon={item.icon}
                isOpen={activePopover === "TextColor"}
                onToggle={() => onTogglePopover("TextColor")}
                onPick={(color) => {
                  runEditorCommand(editor, "TextColor", color, handleImageUpload);
                  onTogglePopover(null);
                }}
              />
            );
          }

          if (item.label === "Link") {
            return (
              <LinkInput
                key={item.label}
                icon={item.icon}
                currentHref={editor.getAttributes("link").href}
                isOpen={activePopover === "Link"}
                onToggle={() => onTogglePopover("Link")}
                onSave={(url) => {
                  runEditorCommand(editor, "SaveLink", url, handleImageUpload);
                  onTogglePopover(null);
                }}
              />
            );
          }

          return (
            <ToolbarButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={() => runEditorCommand(editor, item.label, null, handleImageUpload)}
            />
          );
        })}
      </div>
      {groupLabel && (
        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mt-3 mb-1">
          {groupLabel}
        </span>
      )}
    </div>
  );
}

// ─── EditorToolbar ────────────────────────────────────────────────────────

export default function Toolbar({ editor, isAiChatOpen, toggleAiChat }) {
  if (!editor) return null;

  // All save/slug/Redux logic lives in the hook — toolbar is pure UI
  const {
    title,
    setTitle,
    isSaving,
    isNoteSaved,
    commitTitle,
    handleSave,
    toggleImportant,
    isImportant,
  } = useNoteSave(editor);

  const { isUploading, handleImageUpload } = useImageUpload();

  const [isEditing, setIsEditing] = useState(false);
  const [activePopover, setActivePopover] = useState(null);

  const togglePopover = useCallback((name) => {
    setActivePopover((prev) => (prev === name ? null : name));
  }, []);

  const currentFontSize = editor.getAttributes("textStyle").fontSize;

  return (
    <div className="relative z-50 bg-[#1e1e1e] shadow-md border-b border-black/50">

      {/* ── Title bar ── */}
      <div className="w-full border-b-[1px] border-white/5 min-h-12 justify-between items-center flex px-5 py-2 bg-[#2a2a2a]">

        {!isEditing && title.trim().length > 0 ? (
          <h2
            onClick={() => setIsEditing(true)}
            className="text-xl font-semibold p-1 cursor-text text-white"
          >
            {title}
          </h2>
        ) : (
          <input
            type="text"
            placeholder="Enter Note Title..."
            className="text-xl font-semibold p-1 border-b border-blue-500 outline-none bg-transparent text-white placeholder-gray-400 placeholder:text-base placeholder:font-normal"
            autoFocus={isEditing}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              commitTitle(title);
              if (title.trim().length > 0) setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitTitle(title);
                if (title.trim().length > 0) setIsEditing(false);
              }
            }}
          />
        )}

        <div className="flex items-center gap-3">
          {/* Important Star Toggle */}
          <button
            onClick={() => toggleImportant(editor)}
            title={isImportant ? "Unmark as Important" : "Mark as Important"}
            className={`group active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center p-2 rounded-full  ${
              isImportant
                ? " text-yellow-400"
                : "bg-transparent border-transparent text-white hover:bg-white/10"
            }`}
          >
            <Star className="size-5" weight={isImportant ? "fill" : "regular"} />
          </button>

          {/* AI chat toggle */}
          <button
            onClick={toggleAiChat}
            title="Toggle AI Chat"
            className={`group active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center p-2 rounded-full border ${
              isAiChatOpen
                ? "bg-[#18181b] border-white/20 text-[#a9c9f9]"
                : "bg-transparent border-transparent text-white hover:bg-white/10"
            }`}
          >
            <Sparkle className="size-5" weight={isAiChatOpen ? "fill" : "regular"} />
          </button>

          {/* Save button */}
          <button
            onClick={() => handleSave(editor)}
            disabled={isSaving || isNoteSaved || isUploading}
            className={`group flex items-center justify-center font-[1000] text-white outline-none bg-[#212121] hover:bg-black active:scale-95 rounded-[15px] px-[1em] py-[0.7em] pl-[0.9em] cursor-pointer border-none transition-transform duration-150 ${
              (isSaving || isNoteSaved || isUploading) ? "opacity-80 cursor-default" : ""
            }`}
          >
            <div className="svg-wrapper-1 flex items-center justify-center">
              <div className="svg-wrapper transition-all duration-[0.5s] ease-linear group-hover:scale-[1.25]">
                {isUploading ? (
                  <CircleNotch weight="bold" className="w-[30px] h-[30px] animate-spin block origin-center transition-transform duration-300 ease-in-out group-hover:translate-x-[1.2em] group-hover:scale-[1.1] text-[#9b9999] group-hover:text-white" />
                ) : isSaving ? (
                  <CircleNotch weight="bold" className="w-[30px] h-[30px] animate-spin block origin-center transition-transform duration-300 ease-in-out group-hover:translate-x-[1.2em] group-hover:scale-[1.1] text-[#9b9999] group-hover:text-white" />
                ) : isNoteSaved ? (
                  <FileText weight="fill" className="w-[30px] h-[30px] block origin-center transition-transform duration-300 ease-in-out group-hover:translate-x-[1.2em] group-hover:scale-[1.1] text-[#9b9999] group-hover:text-white" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-[30px] h-[30px] block origin-center transition-transform duration-300 ease-in-out group-hover:translate-x-[1.2em] group-hover:scale-[1.1] text-[#9b9999] group-hover:text-white"
                  >
                    <path
                      d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"
                    ></path>
                  </svg>
                )}
              </div>
            </div>
            <span className="block ml-[0.3em] overflow-hidden transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:duration-[0.5s] group-hover:ease-linear whitespace-nowrap text-base sm:text-[20px]">
              {isUploading ? "Uploading..." : isSaving ? "Saving..." : isNoteSaved ? "Saved" : "Save"}
            </span>
          </button>
        </div>
      </div>

      {/* ── Formatting toolbar ── */}
      <div
        id="text-formatting"
        className="flex items-center flex-wrap px-4 min-h-[96px] py-3 gap-x-2 gap-y-4"
      >
        <IconGroup
          icons={FORMATTING_ICONS}
          groupLabel="Font"
          editor={editor}
          activePopover={activePopover}
          onTogglePopover={togglePopover}
        />

        <FontSizeDropdown
          currentSize={currentFontSize}
          isOpen={activePopover === "FontSize"}
          onToggle={() => togglePopover("FontSize")}
          onPick={(size) => {
            runEditorCommand(editor, "FontSize", size);
            setActivePopover(null);
          }}
        />

        <IconGroup
          icons={TYPOGRAPHY_ICONS}
          groupLabel="Styles"
          editor={editor}
          activePopover={activePopover}
          onTogglePopover={togglePopover}
        />
        <IconGroup
          icons={LIST_ALIGN_ICONS}
          groupLabel="Paragraph"
          editor={editor}
          activePopover={activePopover}
          onTogglePopover={togglePopover}
        />
        <IconGroup
          icons={INSERT_ICONS}
          groupLabel="Insert"
          editor={editor}
          activePopover={activePopover}
          onTogglePopover={togglePopover}
          handleImageUpload={handleImageUpload}
        />
      </div>
    </div>
  );
}