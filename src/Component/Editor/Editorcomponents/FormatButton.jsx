import React, { memo } from "react";

/**
 * A single formatting button for the BubbleMenu toolbar.
 * Uses onMouseDown + preventDefault so the editor doesn't lose focus.
 */
const FormatButton = memo(function FormatButton({ editor, command, icon, level, onClick }) {
  const isActive = level
    ? editor.isActive(command, { level })
    : editor.isActive(command);

  const handleClick = () => {
    if (onClick) return onClick();
    if (level) {
      editor.chain().focus().toggleHeading({ level }).run();
    } else {
      const cap = command.charAt(0).toUpperCase() + command.slice(1);
      editor.chain().focus()[`toggle${cap}`]().run();
    }
  };

  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); handleClick(); }}
      className={`p-2 rounded-xl transition-all duration-150 ${
        isActive
          ? "bg-white/20 text-white"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
    >
      {icon}
    </button>
  );
});

export default FormatButton;
