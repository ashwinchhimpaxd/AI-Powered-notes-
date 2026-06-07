import React from 'react'
import UserEmailNamechanges from './allappsettingfeatures/UserEmailNamechanges';
import AiFeatures from './allappsettingfeatures/AllaiFeatures/AiFeatures';
import ThemeToggle from '../ThemeToggle';
import userAuthService from '../../AppWrite/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logout } from '../../redux/Authantication/UserAuthanticationSlice';
import { clearNotes } from '../../redux/NotesCreation/NotesCreationSlice';
import { SignOut, PaintBrushBroad } from "@phosphor-icons/react";

function Appsetting() {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    React.useEffect(() => {
        console.log("appsetting mounted  ")
    }, [])
    const handleLogout = async () => {
        try {
            await userAuthService.logoutFromCurrentdevice();
        } catch (error) {
            console.error("Server-side logout failed:", error.message);
        } finally {
            // Always clear local state and navigate even if server request fails
            dispatch(clearNotes());
            dispatch(logout());
            navigate("/Login");
        }
    }
    return (
        <div className='flex-1 w-full relative  text-foreground flex flex-col items-center pb-20 pt-10 px-4 sm:px-8 slide-in '>
            {/* Ambient Background Glow Using Root Primary Color */}


            <div className='w-full max-w-4xl space-y-12 relative z-10'>
                <div className="text-center sm:text-left mb-12 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-extrabold  tracking-tight mb-3 drop-shadow-sm text-white">Settings</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed text-gray-500">Customize your profile, manage account preferences, and tune your AI assistant's capabilities for a personalized experience.</p>
                </div>

                <div className="space-y-10">
                    <UserEmailNamechanges />
                    
                    {/* Theme Toggle Preference Panel */}
                    <section className="relative overflow-hidden group bg-card/85 backdrop-blur-2xl border border-border rounded-3xl p-6 sm:p-10 transition-all duration-500 hover:border-primary/50 shadow-sm">
                        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] opacity-50 pointer-events-none group-hover:bg-primary/20 group-hover:scale-150 transition-all duration-700"></div>
                        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
                            <div className="flex flex-col gap-6 shrink-0 w-full lg:w-1/3">
                                <div className="w-full text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                                        <PaintBrushBroad size={14} weight="bold" />
                                        Appearance
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-wide">Theme Preferences</h2>
                                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Customize the look and feel of Focus AI. Toggle between light and dark modes.</p>
                                </div>
                            </div>
                            <div className="w-full lg:w-2/3">
                                <ThemeToggle />
                            </div>
                        </div>
                    </section>

                    <AiFeatures />
                    
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500 text-red-500 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                        >
                            <SignOut className="text-xl" weight="bold" />
                            <span>Logout Account</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Appsetting