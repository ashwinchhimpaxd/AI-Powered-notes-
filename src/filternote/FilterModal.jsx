import React, { useEffect } from "react";
import FilterHeader from "./FilterHeader";
import NoteTypeFilter from "./NoteTypeFilter";
import SortOrderFilter from "./SortOrderFilter";
import DateRangeFilter from "./DateRangeFilter";
import FilterFooter from "./FilterFooter";

/**
 * FilterModal Component
 * Parent modal that wraps all filter sub-components.
 * Displays on top of everything with a rich glass-blur background effect.
 */
const FilterModal = ({ isOpen, onClose }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop overlay with blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal card container */}
      <div className="relative w-full max-w-[400px] bg-[#121214]/90 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] flex flex-col gap-6 p-6 transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <FilterHeader onClose={onClose} />

        {/* Filters content */}
        <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] pr-1.5 scrollbar-none">
          <NoteTypeFilter />
          <SortOrderFilter />
          <DateRangeFilter />
        </div>

        {/* Footer actions */}
        <FilterFooter onClose={onClose} />
      </div>
    </div>
  );
};

export default FilterModal;
