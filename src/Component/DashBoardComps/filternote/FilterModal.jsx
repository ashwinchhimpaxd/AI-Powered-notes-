import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFilters, resetFilters } from "../../../redux/NotesCreation/NotesCreationSlice";
import FilterHeader from "./FilterHeader";
import NoteTypeFilter from "./NoteTypeFilter";
import SortOrderFilter from "./SortOrderFilter";
import DateRangeFilter from "./DateRangeFilter";
import FilterFooter from "./FilterFooter";

/**
 * FilterModal Component
 * Parent modal that wraps all filter sub-components and coordinates local staging states.
 */
const FilterModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  // 1. Get currently active filters from Redux
  const reduxFilter = useSelector((state) => state.NotesCreation.filter);

  // 2. Local staging states initialized from Redux
  const [stagedState, setStagedState] = useState({
    importance: reduxFilter?.importance || "all",
    sort: reduxFilter?.sort || "newest",
    startDate: reduxFilter?.startDate || "",
    endDate: reduxFilter?.endDate || ""
  });

  const [prevIsOpen, setPrevIsOpen] = useState(null);

  // Synchronize local states with Redux whenever modal is opened, inline during render
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setStagedState({
        importance: reduxFilter?.importance || "all",
        sort: reduxFilter?.sort || "newest",
        startDate: reduxFilter?.startDate || "",
        endDate: reduxFilter?.endDate || ""
      });
    }
  }

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

  // Apply Action: Dispatch staged state to Redux
  const handleApply = () => {
    dispatch(
      setFilters({
        importance: stagedState.importance,
        sort: stagedState.sort,
        startDate: stagedState.startDate ? stagedState.startDate : null,
        endDate: stagedState.endDate ? stagedState.endDate : null,
      })
    );
    onClose();
  };

  // Reset Action: Restore Redux defaults
  const handleReset = () => {
    dispatch(resetFilters());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop overlay with blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal card container */}
      <div className="relative w-full max-w-[400px] bg-card/90 backdrop-blur-2xl border border-border rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] flex flex-col gap-6 p-6 transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <FilterHeader onClose={onClose} />

        {/* Filters content */}
        <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh] pr-1.5 scrollbar-none">
          <NoteTypeFilter selectedType={stagedState.importance} setSelectedType={(val) => setStagedState(s => ({ ...s, importance: val }))} />
          <SortOrderFilter sortOrder={stagedState.sort} setSortOrder={(val) => setStagedState(s => ({ ...s, sort: val }))} />
          <DateRangeFilter
            startDate={stagedState.startDate}
            setStartDate={(val) => setStagedState(s => ({ ...s, startDate: val }))}
            endDate={stagedState.endDate}
            setEndDate={(val) => setStagedState(s => ({ ...s, endDate: val }))}
          />
        </div>

        {/* Footer actions */}
        <FilterFooter onClose={onClose} onApply={handleApply} onReset={handleReset} />
      </div>
    </div>
  );
};

export default FilterModal;
