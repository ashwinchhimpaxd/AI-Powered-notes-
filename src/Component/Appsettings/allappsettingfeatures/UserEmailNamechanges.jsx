
import { User, EnvelopeSimple, DotsThree } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';

function UserEmailNamechanges() {
    const navigate = useNavigate();
    const { name, email } = useSelector((state) => state.UserAuthantication.UserData?.userdetaild || {});
    return (
        <section className="relative overflow-hidden group bg-card/80 backdrop-blur-2xl border border-border rounded-3xl p-6 sm:p-10 transition-all duration-500 hover:border-primary/50 shadow-sm">
            {/* Background Glow */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] opacity-50 pointer-events-none group-hover:bg-primary/20 group-hover:scale-150 transition-all duration-700"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-5">

                {/* Left Profile Header Section */}
                <div className="flex flex-col items-start gap-4 shrink-0 w-full lg:w-1/3">
                    {/* Circle icon with user */}
                    <div className="size-15  flex items-center justify-center rounded-full bg-border/20 border border-border/40 text-foreground/80 shadow-sm">
                        <User size={35} />
                    </div>
                    <div className="text-left w-full">
                        <h2 className="text-3xl sm:text-2xl font-semibold text-foreground tracking-wide">Your Profile</h2>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            This is how you appear to others.
                            <br />
                            Keep your details up to date.
                        </p>
                    </div>
                </div>

                {/* Right Info Display Section (Nested Card) */}
                <div className='w-full lg:w-2/3 relative'>
                    <div className="relative bg-background/40 border border-border rounded-2xl p-6 sm:p-8 shadow-inner overflow-hidden flex flex-col justify-center min-h-[200px]">
                        
                        {/* Edit Profile Trigger (Three Dot Button) */}
                        <button
                            type="button"
                            onClick={() => navigate('/profile/edit')}
                            className="absolute size-fit  z-20 top-5 right-6 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer p-1.5 rounded-full hover:bg-border hover:scale-115 scale-105 active:scale-95"
                            title="Edit Profile"
                            aria-label="Edit Profile"
                        >
                            <DotsThree size={20} weight="bold" className="cursor-pointer" />
                        </button>

                        <div className="space-y-6 relative z-10">
                            {/* Read-only Username Row */}
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-border/20 border border-border/40 text-foreground/80 shrink-0">
                                    <User size={22} />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs text-muted-foreground font-semibold tracking-wider mb-0.5">Name</span>
                                    <span className={`text-base sm:text-lg font-medium ${!name ? "text-gray-400/60" : "text-foreground"}`}>
                                        {name || "No name added"}
                                    </span>
                                </div>
                            </div>

                            {/* Divider Line */}
                            <div className="border-t border-border/20 w-full"></div>

                            {/* Read-only Email Row */}
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-border/20 border border-border/40 text-foreground/80 shrink-0">
                                    <EnvelopeSimple size={22} />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs text-muted-foreground font-semibold tracking-wider mb-0.5">Email</span>
                                    <span className={`text-base sm:text-lg font-medium break-all ${!email ? "text-gray-400/60" : "text-foreground"}`}>
                                        {email || "example@gmail.com"}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section >
    )
}

export default UserEmailNamechanges;