import React, { useCallback, useState } from "react";
import {
  TextB, TextItalic, LinkSimple, Panorama, Highlighter,
  TextAUnderline, TextHOne, TextHTwo, Paragraph,
  TextAlignCenter, TextAlignJustify, TextAlignLeft, TextAlignRight,
  ListBullets, ListNumbers, TextStrikethrough, Code, Quotes,
  Palette, FileText, Sparkle, CircleNotch,
} from "@phosphor-icons/react";

import { useNoteSave } from "./DataSetterMethodonappwrite/Usenotesave.js";
import {
  ToolbarButton,
  HighlightPicker,
  ColorPicker,
  LinkInput,
  FontSizeDropdown,
} from "./Toolbarcomponents.jsx";

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

function runEditorCommand(editor, label, value) {
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
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () =>
          editor.chain().focus().setImage({ src: reader.result }).run();
        reader.readAsDataURL(file);
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

function IconGroup({ icons, groupLabel, editor, activePopover, onTogglePopover }) {
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
                  runEditorCommand(editor, "Highlight", color);
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
                  runEditorCommand(editor, "TextColor", color);
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
                  runEditorCommand(editor, "SaveLink", url);
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
              onClick={() => runEditorCommand(editor, item.label)}
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
  } = useNoteSave(editor);

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
            disabled={isSaving || isNoteSaved}
            className={`group active:scale-95 transition-all duration-150 cursor-pointer relative inline-flex h-9 items-center justify-center overflow-hidden bg-blue-700 px-4 font-medium text-neutral-50 rounded-full ${
              isSaving || isNoteSaved ? "opacity-80 cursor-default" : ""
            }`}
          >
            <span className="absolute h-0 w-0 rounded-full bg-blue-800 transition-all duration-600 group-hover:h-54 group-hover:w-40" />
            <span className="relative flex justify-center items-center leading-[20px] gap-2 text-sm z-10">
              {isSaving ? (
                <><CircleNotch className="size-5 animate-spin" weight="bold" /> Saving...</>
              ) : isNoteSaved ? (
                <><FileText className="size-5" weight="fill" /> Saved</>
              ) : (
                <><FileText className="size-5" weight="fill" /> Save</>
              )}
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
        />
      </div>
    </div>
  );
}