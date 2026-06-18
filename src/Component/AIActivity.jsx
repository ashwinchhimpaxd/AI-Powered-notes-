import { useSelector } from "react-redux";
import { ChartLineUp, FileText, Star } from "@phosphor-icons/react";
import { selectNoteStatistics } from "../redux/NotesCreation/NotesSelector.js";

export default function NoteStatistics() {
    const { totalCount, importantCount } = useSelector(selectNoteStatistics);

    return (
        <div className="fixed bottom-8 right-8 z-20 w-64 bg-card border border-border rounded-xl shadow-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <ChartLineUp className="size-5 text-[#8b5cf6]" />
                <h3 className="text-foreground text-sm font-semibold">Note Statistics</h3>
            </div>
            
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="size-4" />
                        <span className="text-xs font-medium">Total Notes</span>
                    </div>
                    <span className="text-foreground font-bold text-sm">{totalCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="size-4 text-yellow-400" />
                        <span className="text-xs font-medium">Important</span>
                    </div>
                    <span className="text-foreground font-bold text-sm">{importantCount}</span>
                </div>
            </div>
        </div>
    );
}
