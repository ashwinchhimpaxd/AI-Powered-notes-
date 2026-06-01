import { memo, useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FileText, Bookmark, ShareNetwork, DotsThreeVertical } from "@phosphor-icons/react";
import { selectNoteById } from "../../redux/NotesCreation/NotesCreationSlice.js";

const NoteCard = memo(({
    noteId,
    isGridView,
    openMenu,
    onToggleMenu,
    onToggleStar,
    onDelete,
    onClick
}) => {
    const note = useSelector((state) => selectNoteById(state, noteId));

    // Premium Date Formatter for Creation Date
    const formattedCreatedDate = useMemo(() => {
        if (!note) return null;
        return new Date(note.$createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }, [note?.$createdAt]);

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 60000); // Tick every 60 seconds (1 minute)
        return () => clearInterval(interval);
    }, []);

    // Premium Relative/Date Formatter for Modification Date
    const relativeModified = useMemo(() => {
        if (!note) return "";
        const diffMs = now - new Date(note.$updatedAt);
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return "Just now";
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return new Date(note.$updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }, [note?.$updatedAt, now]);

    const cleanContent = useMemo(() => {
        return note?.notes_contect
            ? note.notes_contect.replace(/<[^>]+>/g, "").trim()
            : "No content";
    }, [note?.notes_contect]);

    const spanClass = useMemo(() => {
        if (!isGridView) return "";
        const titleLength = (note.notes_title || "").length;
        const contentLength = cleanContent.length;

        // Dynamic width spanning: longer content gets col-span-2 on medium/large screens
        if (titleLength > 30 || contentLength > 120) {
            return "md:col-span-2 lg:col-span-2";
        }
        return "col-span-1";
    }, [isGridView, note?.notes_title, cleanContent]);
    
    if (!note) return null;
    return (
        <div
            onClick={() => onClick(note)}
            className={`relative  flex flex-row bg-[#0e0e11] hover:bg-[#131316] border border-white/10 hover:border-white/10 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group shadow-2xl ${isGridView
                ? `h-56 ${spanClass}`
                : "h-auto min-h-fit"
                }`}
        >
            {/* 1. Left Sidebar Column */}
            <div className="flex-shrink-0 w-32 md:w-40 bg-[#09090b] p-4 flex flex-col justify-between  gap-4 border-r border-white/5 relative z-10">
                <div className="flex flex-col gap-5 ">
                    {/* ID Indicator */}
                    <div className="flex items-center gap-1.5 text-white/80 font-bold text-[10px] md:text-xs tracking-wider">
                        <FileText size={16} weight="fill" className="text-[#b49cf8]" />
                        <span>ID_{note.$id.slice(-4).toUpperCase()}</span>
                    </div>

                    {/* Metadata Dates */}
                    <div className="flex flex-col gap-3.5">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                Created
                            </span>
                            <span className="text-[11px] font-medium text-white/60">
                                {formattedCreatedDate}
                            </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                Modified
                            </span>
                            <span className="text-[11px] font-medium text-[#b49cf8]/80 animate-pulse-subtle">
                                {relativeModified}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Badge (Bottom Left) */}
                <span className={`self-start px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-widest rounded-md border ${note.is_note_important
                    ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-400/90 shadow-md shadow-yellow-500/5"
                    : "bg-[#25252b]/30 border-white/5 text-white/40"
                    }`}>
                    {note.is_note_important ? "Important" : "Design"}
                </span>
            </div>

            {/* 2. Right Content Column */}
            <div className="flex-1 p-5 flex flex-col justify-between min-w-0 relative z-10">
                {/* Title and Action Menu */}
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-white text-base md:text-lg font-bold leading-tight line-clamp-1 pr-2 flex-1 group-hover:text-[#b49cf8] transition-colors duration-200">
                        {note.notes_title || "Untitled Note"}
                    </h3>

                    <button
                        className="p-1 rounded-md bg-[#25252b]/50 text-white/40 hover:text-white transition-colors relative z-20"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleMenu(note.$id);
                        }}
                    >
                        <DotsThreeVertical size={18} weight="bold" />
                    </button>
                </div>

                {/* Horizontal Divider */}
                <div className="w-full h-[1px] bg-white/5 my-3" />

                {/* Snippet Description */}
                <p className="text-white/50 text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-4 flex-1">
                    {cleanContent}
                </p>

                {/* Toolbar Footer Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-white/5 mt-2">
                    {/* Toggle Star/Save Action */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleStar(e, note);
                        }}
                        className={`flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase transition-colors relative z-20 ${note.is_note_important
                            ? "text-yellow-400 hover:text-yellow-500"
                            : "text-white/40 hover:text-white/60"
                            }`}
                    >
                        <Bookmark size={14} weight={note.is_note_important ? "fill" : "regular"} />
                        <span>{note.is_note_important ? "Bookmarked" : "Save"}</span>
                    </button>

                    {/* Share Action */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Trigger smooth native navigator share or copy link
                            if (navigator.share) {
                                navigator.share({
                                    title: note.notes_title,
                                    text: cleanContent
                                }).catch(() => { });
                            } else {
                                navigator.clipboard.writeText(window.location.origin + `/Dashboard/editor/${note.slug}`);
                                alert("Note link copied to clipboard!");
                            }
                        }}
                        className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase text-white/40 hover:text-white/70 transition-colors relative z-20"
                    >
                        <ShareNetwork size={14} />
                        <span>Share</span>
                    </button>
                </div>
            </div>

            {/* Dropdown Menu (Absolute overlay) */}
            {openMenu && (
                <div className="absolute top-12 right-4 w-32 bg-[#121214]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl z-[100] flex flex-col py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                        onClick={() => onClick(note)}
                        className="px-4 py-2.5 text-xs font-semibold text-[#e5e5e5] hover:bg-[#25252b]/50 hover:text-white text-left transition-colors"
                    >
                        Open Editor
                    </button>
                    <button
                        className="px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(note.$id);
                        }}
                    >
                        Delete Note
                    </button>
                </div>
            )}
        </div>
    );
});

export default NoteCard;