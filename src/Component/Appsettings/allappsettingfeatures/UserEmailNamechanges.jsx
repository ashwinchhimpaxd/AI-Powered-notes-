import React, { useState } from 'react'
import { Camera, User, PencilSimple, EnvelopeSimple, AppWindow } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"

function UserEmailNamechanges() {
    const navigate = useNavigate();

    // In a real app, these would come from your auth context or global state
    const [username, setusername] = useState("ashwin");
    const [useremail, setuseremail] = useState("nuni@gmail.com");

    const handleEditProfile = () => {
        // Redirect to the dedicated profile editing page
        // You'll need to create this route in your App.jsx, e.g., <Route path="/profile/edit" ... />
        navigate('/profile/edit');
    };

    return (
        <section className="relative overflow-hidden group bg-card/80 backdrop-blur-2xl border border-border rounded-3xl p-6 sm:p-10 transition-all duration-500 hover:border-primary/50 shadow-sm">
            {/* Background Glow */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] opacity-50 pointer-events-none group-hover:bg-primary/20 group-hover:scale-150 transition-all duration-700"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">

                {/* Profile Image Section */}
                <div className="flex flex-col items-center gap-6 shrink-0 w-full lg:w-1/3">
                    <div className="w-full text-center lg:text-left mb-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                            <User size={14} weight="bold" />
                            Personal Info
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-wide">Profile Details</h2>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">View your current profile credentials. Click Edit Profile to make changes.</p>
                    </div>

                    <div className="relative group/avatar">
                        <div className="absolute inset-0 bg-primary/30 rounded-full blur opacity-30 group-hover/avatar:opacity-60 transition-opacity duration-500"></div>
                        <img
                            alt="Profile"
                            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-[6px] ring-background shadow-lg transition-all duration-500 group-hover/avatar:ring-primary/50 group-hover/avatar:scale-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1qc4tvjBVPlfp3DnDnxMofgyKvIqfegNplSnqH6UiTtl8mNjD0bUbAt1QOhqH1PyAVLaX77MxtHV1_czTSZ3cSMEdBlE2XfiowN-SYUhNPaoOGKaSlxmx9yZjxdv64LE6fnX4GZ8taUiHxU81MgCI_iSFwH-NnJYH24BR_owKrG_zjuPT-GQWgb3bn8ILyXz1eUnTVXpvVbHO4M4Xh8MK6fajTCOCKdPT6nHEm7zaammop9Zl7T7_D4xyJhXNWNZ1csj72IqyVg"
                        />
                    </div>
                </div>

                {/* Info Display Section (Read-Only) */}
                <div className='w-full lg:w-2/3 relative'>
                    <div className="relative bg-background/40 border border-border rounded-2xl p-6 sm:p-8 shadow-inner overflow-hidden flex flex-col justify-center h-full min-h-[300px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

                        <div className="space-y-8 relative z-10">

                            {/* Read-only Username */}
                            <div className="group/field">
                                <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block uppercase tracking-wider flex items-center gap-2">
                                    <AppWindow size={16} weight="bold" />
                                    Name
                                </label>
                                <div className="w-full h-14 bg-input/5 border border-border/50 rounded-xl px-4 flex items-center transition-all group-hover/field:bg-input/10 group-hover/field:border-border">
                                    <span className="text-foreground text-lg font-medium">{username}</span>
                                </div>
                            </div>

                            {/* Read-only Email */}
                            <div className="group/field">
                                <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block uppercase tracking-wider flex items-center gap-2">
                                    <EnvelopeSimple size={16} weight="bold" />
                                    Email Address
                                </label>
                                <div className="w-full h-14 bg-input/5 border border-border/50 rounded-xl px-4 flex items-center transition-all group-hover/field:bg-input/10 group-hover/field:border-border">
                                    <span className="text-foreground text-lg font-medium">{useremail}</span>
                                </div>
                            </div>

                            {/* Redirect Button */}
                            <div className="pt-4">
                                <button
                                    onClick={handleEditProfile}
                                    className="w-full relative overflow-hidden rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3.5 text-lg font-bold transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] flex justify-center items-center gap-3 group">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Edit Profile
                                        <PencilSimple weight="bold" className="text-xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                                    </span>
                                </button>
                                <p className="text-center text-xs text-muted-foreground mt-3">You will be redirected to a secure page to update your credentials.</p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default UserEmailNamechanges;