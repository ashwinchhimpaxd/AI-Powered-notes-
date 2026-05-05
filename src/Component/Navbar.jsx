// SideNavBar.jsx
import { House, Star, Note, Robot, GearSix, Plus, X } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { QuickChatAIOpen, SettingsOpen } from "../redux/QuickChatAI/QuickChatAiSlice.js";
import { useState } from "react";
import NotesCreationForm from "./NotesCreationForm";

export default function SideNavBar({ isOpen, setIsOpen }) {
    const dispatch = useDispatch();
    const [NewNotesClick, setNewNotesClick] = useState(false);

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed md:relative top-0 left-0 w-[240px] flex-shrink-0 bg-[#0a0a0a] border-r border-[#262626] flex flex-col justify-between h-full z-40 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Top Section */}
                <div>
                    {/* Logo Area & Mobile Close Button */}
                    <div className="p-6 pb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center flex-shrink-0">
                                <span className="text-[#a1a1aa] text-xs">✨</span>
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-lg leading-tight tracking-tight">Deep Focus AI</h1>
                                <p className="text-[#a1a1aa] text-xs font-medium">Flow State</p>
                            </div>
                        </div>
                        {/* Mobile Close Button */}
                        <button 
                            className="md:hidden text-[#a1a1aa] hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col gap-1 px-3">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-white cursor-pointer group">
                            <Note className="size-5 text-[#8b5cf6]" weight="fill" />
                            <span className="font-medium text-sm">Notes</span>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:bg-[#121212] hover:text-white cursor-pointer transition-colors group">
                            <Star className="size-5" />
                            <span className="font-medium text-sm">Important</span>
                        </div>
                        <div 
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:bg-[#121212] hover:text-white cursor-pointer transition-colors group"
                            onClick={() => {
                                dispatch(SettingsOpen());
                                if(setIsOpen) setIsOpen(false);
                            }}
                        >
                            <GearSix className="size-5" />
                            <span className="font-medium text-sm">Settings</span>
                        </div>
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-4">
                    <button 
                        onClick={() => {
                            setNewNotesClick(true);
                            if(setIsOpen) setIsOpen(false);
                        }}
                        className="w-full h-11 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <Plus className="size-4" weight="bold" /> New Note
                    </button>
                </div>
            </aside>

            {NewNotesClick && <NotesCreationForm setNewNotesClick={setNewNotesClick} />}
        </>
    );
}
