import React, { useState } from "react";
import { CalendarBlank, ClockCounterClockwise } from "@phosphor-icons/react";

/**
 * SortOrderFilter Component
 * Custom selection button grid for sorting notes: Newest First or Oldest First.
 */
const SortOrderFilter = () => {
  const [sortOrder, setSortOrder] = useState("newest");

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
        Sort Order
      </span>
      <div className="grid grid-cols-2 gap-3">
        {/* Newest First */}
        <button
          onClick={() => setSortOrder("newest")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            sortOrder === "newest"
              ? "bg-[#25252b]/50 border-[#b49cf8] text-white shadow-lg shadow-[#b49cf8]/5"
              : "bg-[#121214] border-white/5 text-white/40 hover:text-white/60"
          }`}
        >
          <CalendarBlank size={16} weight={sortOrder === "newest" ? "fill" : "regular"} />
          <span>Newest First</span>
        </button>

        {/* Oldest First */}
        <button
          onClick={() => setSortOrder("oldest")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            sortOrder === "oldest"
              ? "bg-[#25252b]/50 border-[#b49cf8] text-white shadow-lg shadow-[#b49cf8]/5"
              : "bg-[#121214] border-white/5 text-white/40 hover:text-white/60"
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
