import React from 'react'
import UserEmailNamechanges from './allappsettingfeatures/UserEmailNamechanges';
import AiFeatures from './allappsettingfeatures/AllaiFeatures/AiFeatures';

function Appsetting() {
    return (
        <div className='flex-1 w-full relative overflow-y-auto text-foreground flex flex-col items-center pb-20 pt-10 px-4 sm:px-8'>
            {/* Ambient Background Glow Using Root Primary Color */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 transition-all duration-1000"></div>

            <div className='w-full max-w-4xl space-y-12 relative z-10'>
                <div className="text-center sm:text-left mb-12 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-extrabold  tracking-tight mb-3 drop-shadow-sm text-white">Settings</h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed text-gray-500">Customize your profile, manage account preferences, and tune your AI assistant's capabilities for a personalized experience.</p>
                </div>

                <div className="space-y-10">
                    <UserEmailNamechanges />
                    <AiFeatures />
                </div>
            </div>
        </div>
    )
}

export default Appsetting