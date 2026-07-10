import React from "react";
import { CalendarBlank, ClockCounterClockwise } from "@phosphor-icons/react";

/**
 * SortOrderFilter Component
 * Custom selection button grid for sorting notes: Newest First or Oldest First.
 */
const SortOrderFilter = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
        Sort Order
      </span>
      <div className="grid grid-cols-2 gap-3">
        {/* Newest First */}
        <button
          type="button"
          onClick={() => setSortOrder("newest")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
            sortOrder === "newest"
              ? "bg-muted border-[#b49cf8] text-foreground shadow-md"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarBlank size={16} weight={sortOrder === "newest" ? "fill" : "regular"} />
          <span>Newest First</span>
        </button>

        {/* Oldest First */}
        <button
          type="button"
          onClick={() => setSortOrder("oldest")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
            sortOrder === "oldest"
              ? "bg-muted border-[#b49cf8] text-foreground shadow-md"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClockCounterClockwise size={16} weight={sortOrder === "oldest" ? "bold" : "regular"} />
          <span>Oldest First</span>
        </button>
      </div>
    </div>
  );
};

export default SortOrderFilter;
