import AIAssistantChat from "./AIAssistantChat";

// AIActivityAndStats.jsx
export default function AIActivityAndStats() {
    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* AI Activity */}
            <div className="lg:col-span-2">
                <h3 className="text-white text-[3.2rem] font-bold px-4 pb-2 pt-4" style={{ color: "var( --primary-text-color)" }}>
                    AI Assistant
                </h3>

                <div className="p-4 space-y-6">

                    <AIAssistantChat />
                    {/* Item */}
                    {/* <div className="flex items-start gap-4">
                        

                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                                Summarized 'Project X Plan'
                            </p>
                            <p className="text-sm text-white/60">
                                The AI generated a concise summary of your plan.
                            </p>
                            <p className="text-xs text-white/40 mt-1">20 minutes ago</p>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Stats */}
            <div>
                <h3 className="text-white text-lg font-bold px-4 pb-2 pt-4">Stats</h3>

                <div className="p-4 space-y-4">
                    <div className="p-5 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-white/60">Total Notes</p>
                        <p className="text-3xl font-bold text-white mt-1">128</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-white/60">Starred Notes</p>
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
