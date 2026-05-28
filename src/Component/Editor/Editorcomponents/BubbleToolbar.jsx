import React, { memo } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  TextB, TextItalic, TextUnderline, TextHOne, TextHTwo,
  ListBullets, ListNumbers, Highlighter, Quotes,
  LinkSimple, ChatTeardropText,
} from "@phosphor-icons/react";
import FormatButton from "./FormatButton.jsx";

/**
 * Glassmorphism bubble toolbar that appears on text selection.
 */
const BubbleToolbar = memo(function BubbleToolbar({ editor }) {
  if (!editor) return null;

  const handleLinkClick = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top" }}
      className="flex items-center gap-0.5 p-1.5 rounded-2xl bg-[#18181b]/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/60"
    >
      <FormatButton editor={editor} command="bold" icon={<TextB size={16} />} />
      <FormatButton editor={editor} command="italic" icon={<TextItalic size={16} />} />
      <FormatButton editor={editor} command="underline" icon={<TextUnderline size={16} />} />
      <div className="w-px h-4 bg-white/10 mx-1" />
      <FormatButton editor={editor} command="heading" level={1} icon={<TextHOne size={16} />} />
      <FormatButton editor={editor} command="heading" level={2} icon={<TextHTwo size={16} />} />
      <div className="w-px h-4 bg-white/10 mx-1" />
      <FormatButton editor={editor} command="bulletList" icon={<ListBullets size={16} />} />
      <FormatButton editor={editor} command="orderedList" icon={<ListNumbers size={16} />} />
      <div className="w-px h-4 bg-white/10 mx-1" />
      <FormatButton editor={editor} command="highlight"   icon={<Highlighter size={16} />} />
      <FormatButton editor={editor} command="blockquote"  icon={<Quotes size={16} />} />
      <FormatButton editor={editor} command="link"        icon={<LinkSimple size={16} />} onClick={handleLinkClick} />
      <div className="w-px h-4 bg-white/10 mx-1" />
      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-xs font-semibold">
        <ChatTeardropText weight="fill" size={14} />
        AI
      </button>
    </BubbleMenu>
  );
});

export default BubbleToolbar;
