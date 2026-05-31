import React, { memo, useState } from "react";
import { Sparkle, DownloadSimple, FloppyDisk, CircleNotch } from "@phosphor-icons/react";

/**
 * Fixed top bar: title (click-to-edit), summary, export, and save buttons.
 *
 * @param {object}   props
 * @param {string}   props.title
 * @param {function} props.setTitle
 * @param {function} props.commitTitle
 * @param {boolean}  props.isSaving
 * @param {boolean}  props.isNoteSaved
 * @param {function} props.onSave
 * @param {function} props.onSummary
 */
const EditorTopbar = memo(function EditorTopbar({ title, setTitle, commitTitle, isSaving, isNoteSaved, onSave, onSummary, }) {

  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-2xl border-b-2 border-white/20">
      {/* Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-6">
        {!isEditing && title.trim().length > 0 ? (
          <h2
            onClick={() => setIsEditing(true)}
            className="text-lg font-semibold text-white/90 cursor-text truncate hover:text-white transition-colors"
            title="Click to edit title"
          >
            {title}
          </h2>
        ) : (
          <input
            type="text"
            placeholder="Untitled Note…"
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
            className="text-lg font-semibold bg-transparent text-white border-b border-purple-500/60 outline-none placeholder-white/30 w-56"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Summary */}
        <button
          onClick={onSummary}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-md transition-all text-sm"
        >
          <Sparkle weight="fill" size={14} className="text-purple-400" />
          Summary
        </button>

        {/* PDF export (placeholder) */}
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white backdrop-blur-md transition-all"
          title="Export PDF"
        >
          <DownloadSimple weight="bold" size={16} />
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving || isNoteSaved}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isNoteSaved
            ? "bg-white/5 border border-white/10 text-white/40 cursor-default"
            : "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10"
            }`}
        >
          {isSaving
            ? <><CircleNotch className="animate-spin" size={14} /> Saving…</>
            : isNoteSaved
              ? <><FloppyDisk size={17} /> Saved</>
              : <><FloppyDisk size={17} /> save</>
          }
        </button>
      </div>
    </div>
  );
});

export default EditorTopbar;
