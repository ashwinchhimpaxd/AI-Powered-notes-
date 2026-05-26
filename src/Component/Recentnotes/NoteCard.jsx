import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { Star, DotsThreeVertical } from "@phosphor-icons/react";
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

    if (!note) return null;

    const formattedDate = useMemo(() => {
        return new Date(note.$updatedAt).toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric"
            }
        );
    }, [note.$updatedAt]);

    const cleanContent = useMemo(() => {
        return note.notes_contect
            ? note.notes_contect.replace(/<[^>]+>/g, "")
            : "No content";
    }, [note.notes_contect]);

    const truncatedTitle = useMemo(() => {

        const words = (note.notes_title || "Untitled").split(" ");

        return words.length > 5
            ? words.slice(0, 5).join(" ") + "..."
            : words.join(" ");

    }, [note.notes_title]);

    const spanClass = useMemo(() => {
        if (!isGridView) return "";
        const titleLength = (note.notes_title || "").length;
        const contentLength = cleanContent.length;

        // Dynamic width spanning: longer content gets col-span-2 on medium/large screens
        if (titleLength > 30 || contentLength > 120) {
            return "md:col-span-2 lg:col-span-2";
        }
        return "col-span-1";
    }, [isGridView, note.notes_title, cleanContent]);

    return (
        <div
            onClick={() => onClick(note)}
            className={`relative flex flex-col bg-[#121212] hover:bg-[#1a1a1a] border border-[#262626] rounded-xl transition-all duration-300 cursor-pointer group ${
                isGridView
                    ? `h-49 ${spanClass}`
                    : "h-auto min-h-fit"
            }`}
        >

            <div className="p-5 flex flex-col h-full">

                <div className="flex justify-between items-start w-full mb-3">

                    <span className="px-2.5 py-1 bg-[#1a1a1a] border border-[#262626] text-[#a1a1aa] text-[10px] uppercase tracking-wider font-semibold rounded-full">
                        General
                    </span>

                    <span className="text-[11px] font-medium text-[#52525b]">
                        {formattedDate}
                    </span>
                </div>

                <div className="flex flex-col gap-2 flex-1">

                    <h3 className="text-white text-lg font-bold leading-tight line-clamp-2 pr-8">
                        {truncatedTitle}
                    </h3>

                    <p className={`text-[#a1a1aa] text-sm leading-relaxed ${
                        isGridView
                            ? "line-clamp-3"
                            : "line-clamp-2"
                    }`}>
                        {cleanContent}
                    </p>

                </div>

                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

                    <button
                        className="p-1 rounded-md bg-[#262626] text-white/40 hover:text-yellow-400 transition-colors"
                        onClick={(e) => onToggleStar(e, note)}
                    >
                        <Star
                            size={16}
                            weight={note.is_note_important ? "fill" : "regular"}
                            className={note.is_note_important ? "text-yellow-400" : ""}
                        />
                    </button>

                    <button
                        className="p-1 rounded-md bg-[#262626] text-white/40 hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleMenu(note.$id);
                        }}
                    >
                        <DotsThreeVertical size={16} weight="bold" />
                    </button>

                </div>

                {openMenu && (
                    <div className="absolute top-12 right-4 w-32 bg-[#1a1a1a] border border-[#262626] rounded-lg shadow-2xl z-20 flex flex-col py-1">

                        <button className="px-4 py-2 text-sm text-[#e5e5e5] hover:bg-[#262626] hover:text-white text-left transition-colors">
                            Edit
                        </button>

                        <button
                            className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(note.$id);
                            }}
                        >
                            Delete
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
});

export default NoteCard;