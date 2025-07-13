import React from 'react'

import { Link } from "react-router-dom";
import { PenNib, Lightning, MagnifyingGlass, Key, Brain } from "@phosphor-icons/react";
import Button from '../Component/Button';
import Navbar from '../Component/Navbar'
import SpotlightCard from '../Component/SpotlightCard'
function LandingPage() {
    const features = [
        {
            title: "AI-Powered Intelligence",
            description: "Smart suggestions, auto-organization, and content enhancement powered by advanced AI algorithms."
        },
        {
            title: "Secure & Private",
            description: "End-to-end encryption ensures your thoughts and ideas remain completely private and secure."
        },
        {
            title: "Smart Search",
            description: "Find any note instantly with AI-powered search that understands context and content."
        },
        {
            title: "Rich Text Editor",
            description: "Express your ideas with a powerful editor supporting markdown, media, and collaborative editing."
        },
        {
            title: "Lightning Fast",
            description: "Optimized performance ensures your note-taking experience is smooth and responsive."
        }
    ];
    return (
        <div id='Home' className='relative w-full h-fit selection:bg-purple-200 selection:text-black pt-4 px-2 sm:px-6 md:px-10'>
            <Navbar />
            <div className='relative w-full flex flex-col items-center justify-start text-[2em] sm:text-[2.5em] md:text-[3em]'>

                <div className='flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10 leading-normal my-6 sm:my-8 md:my-10 w-full'>

                    <SpotlightCard
                        className="AI_LOGO_TEXT flex justify-center items-center gap-2 sm:gap-3 whitespace-nowrap text-[0.5em] sm:text-[0.6em] capitalize p-4 sm:p-6 rounded-4xl text-white shadow-[inset_0_0_0.5px_rgba(255,255,255,0.3),0_4px_30px_rgba(0,0,0,0.2)] hover:scale-105 transition-all duration-500 ease-in-out"
                        spotlightColor='rgba(240 ,171 ,252, .35)'
                    >
                        <span className='font-light'>AI-powered Note Taking</span>
                        <img src="public\AI Star logo\AILOGO-01.svg" alt="AI logo" className='w-[8vw] sm:w-[4vw] md:w-[2.5vw] rotate-logo' />
                    </SpotlightCard>

                    <div className='text-center leading-[1em] font-extrabold capitalize text-[3.5rem] sm:text-[5rem] md:text-[7.5rem] flex flex-col items-center justify-center gap-2 sm:gap-4 md:gap-5'>
                        <h1 className='text-white uppercase'>Think</h1>
                        <h1 className='text-yellow-400 uppercase'>Create</h1>
                        <h1 className='text-white uppercase'>Organize</h1>
                    </div>
                    <p className='text-[0.8em] sm:text-[0.9em] tracking-tighter w-[95%] sm:w-[80%] md:w-[70%] text-center text-[#dcdbdb]'>
                        The next-generation note-taking experience that adapts to your thinking patterns.
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-600 to-blue-400'>Powered by AI.</span>
                    </p>
                </div>

                <div className='w-full flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center items-start p-2 sm:p-3 md:p-4 mb-[2em] sm:mb-[3em] md:mb-[4em]' id='cards-box'>
                    {features.map((feature, idx) => (
                        <SpotlightCard
                            key={idx}
                            className="inline-flex w-auto min-w-[30vw] h-fit  max-w-[95vw]  sm:max-w-[48vw] min-h-[30vh]  md:max-w-[30vw] md:min-h-[60vh] px-4 sm:px-6 py-4 sm:py-8  rounded-2xl flex-col justify-center items-start custom-spotlight-card transition-all duration-500 ease-in-out  hover:rotate-1 hover:scale-105"
                            spotlightColor='rgba(240 ,171, 252, .35)'
                        >
                            {idx === 0 && <Brain size={48} sm={62} className='mb-4 sm:mb-8 text-white p-2 rounded-[25%] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1]' />}
                            {idx === 1 && <Key size={48} sm={62} className='mb-4 sm:mb-8 text-white p-2 rounded-[25%] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1]' />}
                            {idx === 2 && <MagnifyingGlass size={48} sm={62} className='mb-4 sm:mb-8 text-white p-2 rounded-[25%] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1]' />}
                            {idx === 3 && <PenNib size={48} sm={62} className='mb-4 sm:mb-8 text-white p-2 rounded-[25%] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1]' />}
                            {idx === 4 && <Lightning size={48} sm={62} className='mb-4 sm:mb-8 text-white p-2 rounded-[25%] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1]' />}
                            <h1 className="text-[1.2rem] sm:text-[1.5rem] md:text-[2rem] font-bold mb-2" style={{ color: "var(--white-font-color)" }}>{feature.title}</h1>
                            <p className="text-[1rem] sm:text-[1.2rem] md:text-[1.6rem]" style={{ color: "var(--para-font-color)" }}>{feature.description}</p>
                        </SpotlightCard>
                    ))}
                </div>

                <div className='footer-section mb-6 sm:mb-8 md:mb-10 w-full flex flex-col justify-center items-center gap-4 sm:gap-6 text-center'>
                    <h1 className='font-[900] text-[2rem] sm:text-[3rem] md:text-[4rem] tracking-tight capitalize' style={{ color: "var(--white-font-color)" }}>
                        Ready to give it a <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-blue-400'>Try ?</span>
                    </h1>
                    <p className='font-[200] text-[1.2rem] sm:text-[1.4rem] md:text-[1.7rem] leading-8 capitalize' style={{ color: "var(--para-font-color)" }}>
                        It's a simple tool i made for better note-taking. Maybe you'll find it useful too.
                    </p>
                    <Link to="/Login">
                        <Button classNameSting="text-[1.2rem] p-2 px-5 capitalize sm:text-[1.5rem] md:text-[2rem] font-[100] text-white bg-black/55 backdrop-blur-sm hover:bg-black/75 hover:backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out" text="Give it a Try" />
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default LandingPage