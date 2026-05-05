import SideNavBar from "../Component/Navbar";
import RecentNotes from "../Component/Recentnotes";
import Appsetting from "../Component/Appsettings/Appsetting";
import NoteStatistics from "../Component/AIActivity";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetcurrentnoteinfo } from "../redux/currentnoteinfoslice/currentnoteinfoslice";
import { MagnifyingGlass, Sparkle, List } from "@phosphor-icons/react";
import { sendMessageToAI } from "../AiAssistancefiles/AiMehotds/AiassistentLogic.js";
import service from "@/AppWrite/Setgetuserdatas/config.js";
import { addNoteToTop } from "../redux/NotesCreation/NotesCreationSlice.js";

export default function Dashboard2() {
    const dispatch = useDispatch();
    const settingState = useSelector(state => state.ToggleStates.settingState);
    const userData = useSelector((state) => state.UserAuthantication.UserData);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isAiMode, setIsAiMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Animation states for sliding text
    const [slideText, setSlideText] = useState("");
    const [showSlideText, setShowSlideText] = useState(false);
    
    // Note generation state
    const [isCreatingNote, setIsCreatingNote] = useState(false);

    useEffect(() => {
        dispatch(resetcurrentnoteinfo());
    }, [dispatch]);

    // Handle AI Toggle
    const handleToggleAiMode = () => {
        const newMode = !isAiMode;
        setIsAiMode(newMode);
        
        // Trigger sliding animation text
        setSlideText(newMode ? "AI mode ON" : "AI mode OFF");
        setShowSlideText(true);
        
        // Hide it after a short delay
        setTimeout(() => {
            setShowSlideText(false);
        }, 2500);
    };

    // Handle AI Note Generation on Enter
    const handleSearchKeyDown = async (e) => {
        if (e.key === 'Enter' && isAiMode && searchQuery.trim() !== '') {
            e.preventDefault();
            const topic = searchQuery.trim();
            setSearchQuery("");
            setIsCreatingNote(true);

            try {
                const prompt = `Please create a detailed, well-structured note about the following topic. Return ONLY a valid JSON object with two keys: "title" (string) and "content" (string with HTML formatting for the note body). Do not use markdown blocks or any other conversational text. Topic: ${topic}`;
                
                const responseText = await sendMessageToAI(prompt);
                
                // Extract the JSON object using regex to ignore any surrounding text or tags
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    throw new Error("No JSON object found in the AI response.");
                }

                const jsonStr = jsonMatch[0];
                const parsedData = JSON.parse(jsonStr);
                
                if (parsedData.title && parsedData.content) {
                    const userId = userData?.userdetaild?.userId || 
                                   userData?.userdetaild?.$id || 
                                   userData?.userId || 
                                   userData?.$id || 
                                   "anonymous";

                    const cleanTitle = parsedData.title.trim().replace(/\s+/g, " ");
                    const generatedSlug = cleanTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

                    const newNoteResponse = await service.createNote({
                        Notes_title: parsedData.title,
                        slug: generatedSlug,
                        Notes_contents: parsedData.content,
                        notes_images: [],
                        Is_note_important: false,
                        User_Unique_ID: userId,
                    });

                    if (newNoteResponse && newNoteResponse.$id) {
                        dispatch(addNoteToTop(newNoteResponse));
                    }
                }
            } catch (error) {
                console.error("Failed to generate AI note:", error);
            } finally {
                setIsCreatingNote(false);
            }
        }
    };

    return (
        <div className="flex w-full h-screen bg-[#0a0a0a] overflow-hidden font-sans text-white relative">
            
            {/* Sidebar Component */}
            <SideNavBar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                
                {/* Dashboard Main View */}
                <main className={`absolute inset-0 flex flex-col transition-transform duration-[600ms] ease-in-out ${settingState ? '-translate-x-full' : 'translate-x-0'}`}>
                    
                    {/* Header with Search */}
                    <header className="flex items-center gap-4 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md z-10 px-4 md:px-8 py-5 border-b border-[#262626]">
                        
                        {/* Hamburger Menu for Mobile */}
                        <button 
                            className="md:hidden text-white/80 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <List size={28} />
                        </button>

                        <div className="relative flex items-center flex-1 md:flex-none">
                            {/* Sliding Text Animation */}
                            <div 
                                className={`hidden md:block absolute left-full ml-4 whitespace-nowrap text-sm font-semibold transition-all duration-500 ease-out z-0
                                    ${showSlideText ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}
                                    ${isAiMode ? 'text-purple-400' : 'text-[#a1a1aa]'}
                                `}
                            >
                                {slideText}
                            </div>

                            {/* Responsive Search Bar */}
                            <div className="relative flex items-center h-11 w-full md:w-[28rem] rounded-xl bg-[#121212] border border-[#262626] focus-within:border-[#8b5cf6] transition-colors z-10 shadow-lg">
                                <div className="pl-4 pr-2 flex items-center pointer-events-none">
                                    <MagnifyingGlass className="h-5 w-5 text-[#a1a1aa]" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full h-full bg-transparent text-white text-sm focus:outline-none placeholder:text-[#52525b] placeholder:transition-all"
                                    placeholder={isAiMode ? "give topic & make note automatically" : "Search or ask your notes..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                                <div className="pr-4 pl-2 flex items-center gap-3">
                                    <Sparkle weight="fill" className={`size-4 transition-colors ${isAiMode ? 'text-[#8b5cf6]' : 'text-[#52525b]'}`} />
                                    {/* Toggle Switch */}
                                    <button 
                                        type="button"
                                        onClick={handleToggleAiMode}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAiMode ? 'bg-[#8b5cf6]' : 'bg-[#262626]'}`}
                                    >
                                        <span className="sr-only">Toggle AI Mode</span>
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAiMode ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {/* Pass empty string as searchQuery if isAiMode is true to avoid filtering notes while typing a topic */}
                        <RecentNotes searchQuery={isAiMode ? "" : searchQuery} isCreatingNote={isCreatingNote} />
                    </div>

                    {/* Floating Statistics Widget (Hidden on small screens to save space) */}
                    <div className="hidden md:block">
                        <NoteStatistics />
                    </div>
                </main>

                {/* Settings View */}
                <div className={`absolute inset-0 bg-[#0a0a0a] transition-transform duration-[600ms] ease-in-out z-20 ${settingState ? 'translate-x-0' : 'translate-x-full'}`}>
                    <Appsetting />
                </div>
            </div>
        </div>
    );
}
