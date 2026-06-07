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
    <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-background/10 backdrop-blur-sm border-b border-border">
      {/* Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-6">
        {!isEditing && title.trim().length > 0 ? (
          <h2
            onClick={() => setIsEditing(true)}
            className="text-lg font-semibold text-foreground/90 cursor-text truncate hover:text-foreground transition-colors"
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
            className="text-lg font-semibold bg-transparent text-foreground border-b border-purple-500/60 outline-none placeholder-foreground/30 w-56"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Summary */}
        <button
          onClick={onSummary}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/50 border border-border text-foreground/80 hover:bg-muted hover:text-foreground backdrop-blur-md transition-all text-sm cursor-pointer"
        >
          <Sparkle weight="fill" size={14} className="text-purple-400" />
          Summary
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving || isNoteSaved}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${isNoteSaved
            ? "bg-card/55 border-border text-foreground/45 cursor-default"
            : "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90 shadow-lg"
            }`}
        >
          {isSaving
            ? <><CircleNotch className="animate-spin" size={14} /> Saving…</>
            : isNoteSaved
              ? <><FloppyDisk size={17} /> Saved</>
              : <><FloppyDisk size={17} /> Save</>
          }
        </button>
      </div>
    </div>
  );
});

export default EditorTopbar;
