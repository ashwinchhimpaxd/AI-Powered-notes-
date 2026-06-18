import React from "react";

const TYPES = [
  { id: "all", label: "All Notes" },
  { id: "important", label: "Important" },
  { id: "non-important", label: "Non-Important" },
];

/**
 * NoteTypeFilter Component
 * Segmented control for choosing All Notes, Important, or Non-Important notes.
 */
const NoteTypeFilter = ({ selectedType, setSelectedType }) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
        Note Type
      </span>
      <div className="bg-background/80 p-1 rounded-xl flex gap-1 border border-border">
        {TYPES.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <button
              type="button"
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-muted text-[#b49cf8] border border-border shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NoteTypeFilter;

