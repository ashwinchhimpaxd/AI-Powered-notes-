import React from "react";

/**
 * NoteTypeFilter Component
 * Segmented control for choosing All Notes, Important, or Non-Important notes.
 */
const NoteTypeFilter = ({ selectedType, setSelectedType }) => {
  const types = [
    { id: "all", label: "All Notes" },
    { id: "important", label: "Important" },
    { id: "non-important", label: "Non-Important" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
        Note Type
      </span>
      <div className="bg-[#0e0e10]/80 p-1 rounded-xl flex gap-1 border border-white/5">
        {types.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? "bg-[#25252b] text-[#b49cf8] border border-white/5 shadow-md shadow-black/40"
                  : "text-white/40 hover:text-white/60"
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
