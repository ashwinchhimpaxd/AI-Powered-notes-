import React from "react";
import { Funnel, X } from "@phosphor-icons/react";

/**
 * FilterHeader Component
 * Renders the top title and close button of the filter popup.
 */
const FilterHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between pb-5 border-b border-border">
      <div className="flex items-center gap-2.5">
        <Funnel size={18} className="text-purple-400" weight="fill" />
        <h3 className="text-foreground text-lg font-bold tracking-wide">Filter Notes</h3>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-full hover:bg-muted text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
        aria-label="Close filters"
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
};

export default FilterHeader;
