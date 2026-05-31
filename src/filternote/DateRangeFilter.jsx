import React, { useState } from "react";
import { CalendarBlank, X, Plus } from "@phosphor-icons/react";

/**
 * DateRangeFilter Component
 * Input fields for Start and End date, along with toggleable Drafts/Shared status tags.
 */
const DateRangeFilter = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [draftsActive, setDraftsActive] = useState(false);
  const [sharedActive, setSharedActive] = useState(false);

  const handleDateChange = (val, setter, prevValue) => {
    // If user is deleting, just let them delete.
    if (prevValue && val.length < prevValue.length) {
      // If they deleted a dash (e.g., "2026-0" -> "2026-"), delete the preceding digit too
      if (prevValue.endsWith("-") && val.endsWith("-")) {
        val = val.slice(0, -1);
      }
      setter(val);
      return;
    }

    // Only keep digits
    const clean = val.replace(/\D/g, "");

    let formatted = "";
    if (clean.length > 0) {
      if (clean.length <= 4) {
        formatted = clean;
        if (clean.length === 4) formatted += "-";
      } else if (clean.length <= 6) {
        formatted = `${clean.slice(0, 4)}-${clean.slice(4)}`;
        if (clean.length === 6) formatted += "-";
      } else {
        formatted = `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
      }
    }

    setter(formatted);
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
        Date Range
      </span>

      <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-[10px] font-bold text-white/50 uppercase tracking-wider">
            <CalendarBlank size={12} className="text-purple-400" />
            <span>Start</span>
          </label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            value={startDate}
            maxLength={10}
            onChange={(e) => handleDateChange(e.target.value, setStartDate, startDate)}
            className="w-full bg-[#0e0e10]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#b49cf8]/30 focus:bg-[#0e0e10] transition-colors"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-[10px] font-bold text-white/50 uppercase tracking-wider">
            <CalendarBlank size={12} className="text-purple-400" />
            <span>End</span>
          </label>
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            value={endDate}
            maxLength={10}
            onChange={(e) => handleDateChange(e.target.value, setEndDate, endDate)}
            className="w-full bg-[#0e0e10]/80 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#b49cf8]/30 focus:bg-[#0e0e10] transition-colors"
          />
        </div>
      </div>

      {/* Badges/Tags Row */}
      <div className="flex items-center gap-2.5 pt-1">
        {/* Drafts tag */}
        <button
          onClick={() => setDraftsActive(draftsActive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-widest transition-all ${
            draftsActive
              ? "bg-[#25252b]/40 border-[#b49cf8]/30 text-white"
              : "bg-[#121214] border-white/5 text-white/40"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${draftsActive ? "bg-[#b49cf8]" : "bg-white/20"}`} />
          <span>Drafts</span>
          {draftsActive ? <X size={10} weight="bold" /> : <Plus size={10} weight="bold" />}
        </button>

        {/* Shared tag */}
        <button
          onClick={() => setSharedActive(!sharedActive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-widest transition-all ${
            sharedActive
              ? "bg-[#25252b]/40 border-[#b49cf8]/30 text-white"
              : "bg-[#121214] border-white/5 text-white/40"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${sharedActive ? "bg-[#b49cf8]" : "bg-white/20"}`} />
          <span>Shared</span>
          {sharedActive ? <X size={10} weight="bold" /> : <Plus size={10} weight="bold" />}
        </button>
      </div>
    </div>
  );
};

export default DateRangeFilter;
