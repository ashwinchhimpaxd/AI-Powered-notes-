import { useSelector } from "react-redux";
import { ChartLineUp, FileText, Star } from "@phosphor-icons/react";
export default function NoteStatistics() {
    const notes = useSelector((state) => state.NotesCreation.notes) || [];
    
    const importantCount = notes.filter(n => n.is_note_important).length;
    const totalCount = notes.length;

    return (
        <div className="fixed bottom-8 right-8 z-20 w-64 bg-[#121212] border border-[#262626] rounded-xl shadow-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <ChartLineUp className="size-5 text-[#8b5cf6]" />
                <h3 className="text-white text-sm font-semibold">Note Statistics</h3>
            </div>
            
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#a1a1aa]">
                        <FileText className="size-4" />
                        <span className="text-xs font-medium">Total Notes</span>
                    </div>
                    <span className="text-white font-bold text-sm">{totalCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#a1a1aa]">
                        <Star className="size-4 text-yellow-400" />
                        <span className="text-xs font-medium">Important</span>
                    </div>
                    <span className="text-white font-bold text-sm">{importantCount}</span>
                </div>
            </div>
        </div>
    );
}
