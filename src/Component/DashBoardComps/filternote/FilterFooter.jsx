import React from "react";
import { ArrowCounterClockwise, Checks } from "@phosphor-icons/react";

/**
 * FilterFooter Component
 * Bottom action buttons: Reset (left) and Apply Filters (right).
 */
const FilterFooter = ({ onApply, onReset }) => {
  return (
    <div className="flex items-center justify-between pt-5 border-t border-border">
      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowCounterClockwise size={16} weight="bold" />
        <span>Reset</span>
      </button>

      {/* Apply Filters Button */}
      <button
        type="button"
        onClick={onApply}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#9d7efc] to-[#b49cf8] hover:from-[#8b5cf6] hover:to-[#a78bfa] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer transform active:scale-95"
      >
        <span>Apply Filters</span>
        <Checks size={16} weight="bold" />
      </button>
    </div>
  );
};

export default FilterFooter;
