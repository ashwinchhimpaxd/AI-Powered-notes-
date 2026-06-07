// SideNavBar.jsx
import { Star, Note, Robot, GearSix, Plus, X } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import NotesCreationForm from "./NotesCreationForm";
import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
function SideNavBar({ isOpen, setIsOpen }) {
    const dispatch = useDispatch();
    const [NewNotesClick, setNewNotesClick] = useState(false);
    const location = useLocation();

    let activeIndex = 0;
    if (location.pathname.includes('/setting')) {
        activeIndex = 2;
    } else if (location.pathname.includes('/important')) {
        activeIndex = 1;
    } else {
        activeIndex = 0;
    }

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed md:relative top-0 left-0 w-[240px] flex-shrink-0 bg-background border-r border-border flex flex-col justify-between h-full z-40 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Top Section */}
                <div>
                    {/* Logo Area & Mobile Close Button */}
                    <div className="p-6 pb-8 flex items-center justify-between">
                        <div className="flex items-center gap-0.2">
                            <div className="size-8 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-muted-foreground text-xl">✨</span>
                            </div>
                            <div>
                                <h1 className=" font-[800] text-[1.3rem] leading-tight tracking-tight bg-gradient-to-r from-violet-400 via-purple-400 via-fuchsia-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent ">MindSync</h1>
                            </div>
                        </div>
                        {/* Mobile Close Button */}
                        <button
                            className="md:hidden text-muted-foreground hover:text-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col gap-1 px-3 relative">
                        {/* Animated Background */}
                        <div 
                            className="absolute left-3 right-3 h-[42px] bg-card border border-border rounded-lg transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none"
                            style={{ transform: `translateY(calc(${activeIndex} * 42px + ${activeIndex} * 4px))` }}
                        />

                        <Link to={'/dashboard/recent-notes'} className="z-10">
                            <div className={`flex items-center gap-3 px-3 h-[42px] rounded-lg cursor-pointer group transition-colors ${activeIndex === 0 ? 'text-foreground' : 'text-muted-foreground  hover:text-foreground'}`}>
                                <Note className={`size-5 transition-colors ${activeIndex === 0 ? 'text-[#8b5cf6]' : 'group-hover:text-foreground'}`} weight={activeIndex === 0 ? "fill" : "regular"} />
                                <span className="font-medium text-sm">Notes</span>
                            </div>
                        </Link>
                        
                        <div className={`flex items-center gap-3 px-3 h-[42px] rounded-lg cursor-pointer z-10 group transition-colors ${activeIndex === 1 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                            <Star className={`size-5 transition-colors ${activeIndex === 1 ? 'text-[#8b5cf6]' : 'group-hover:text-foreground'}`} weight={activeIndex === 1 ? "fill" : "regular"} />
                            <span className="font-medium text-sm">Important</span>
                        </div>
                        
                        <Link to={'/dashboard/setting'} className="z-10">
                            <div className={`flex items-center gap-3 px-3 h-[42px] rounded-lg cursor-pointer group transition-colors ${activeIndex === 2 ? 'text-foreground' : 'text-muted-foreground  hover:text-foreground'}`}>
                                <GearSix className={`size-5 transition-colors ${activeIndex === 2 ? 'text-[#8b5cf6]' : 'group-hover:text-foreground'}`} weight={activeIndex === 2 ? "fill" : "regular"} />
                                <span className="font-medium text-sm">Settings</span>
                            </div>
                        </Link>
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-4">
                    <button
                        onClick={() => {
                            setNewNotesClick(true);
                            if (setIsOpen) setIsOpen(false);
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

export default memo(SideNavBar);
