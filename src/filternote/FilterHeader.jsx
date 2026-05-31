import React from "react";
import { Funnel, X } from "@phosphor-icons/react";

/**
 * FilterHeader Component
 * Renders the top title and close button of the filter popup.
 */
const FilterHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between pb-5 border-b border-white/5">
      <div className="flex items-center gap-2.5">
        <Funnel size={18} className="text-purple-400" weight="fill" />
        <h3 className="text-white text-lg font-bold tracking-wide">Filter Notes</h3>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors"
        aria-label="Close filters"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
};

export default FilterHeader;
