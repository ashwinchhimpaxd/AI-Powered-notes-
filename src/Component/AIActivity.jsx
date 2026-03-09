import AIAssistantChat from "./AIAssistantChat";
import { useSelector } from "react-redux";

// AIActivityAndStats.jsx
export default function AIActivityAndStats() {
    const notes = useSelector((state) => state.NotesCreation.notes);

    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* AI Activity */}
            <div className="lg:col-span-2">
                <h3 className="text-white text-[2.5rem] font-bold px-4 pb-2 pt-4" style={{ color: "var( --primary-text-color)" }}>
                    AI Assistant
                </h3>

                <div className="p-4 space-y-6">

                    <AIAssistantChat showPlusIcon={false} />

                </div>
            </div>

            {/* Stats */}
            <div>
                <h3 className="text-white text-lg font-bold px-4 pb-2 pt-4">Stats</h3>

                <div className="p-4 space-y-4">
                    <div className="p-5 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-white/60">Total Notes</p>
                        <p className="text-3xl font-bold text-white mt-1">{notes ? notes.length : 0}</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-white/60">Important Notes</p>
                        <p className="text-3xl font-bold text-white mt-1">16</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-white/60">AI Actions</p>
                        <p className="text-3xl font-bold text-white mt-1">241</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
