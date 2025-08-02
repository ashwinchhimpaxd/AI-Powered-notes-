
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

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width="40" height="40" className="coolshapes star-10 rotate-logo "><g clip-path="url(#cs_clip_1_star-10)"><mask id="cs_mask_1_star-10" width="200" height="200" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#fff" d="M91.317 6.8l.028-.098c2.483-8.71 14.826-8.71 17.31 0l.027.098.083.293a122 122 0 0084.142 84.142l.293.082.098.028c8.709 2.484 8.709 14.826 0 17.31a5.593 5.593 0 01-.098.028l-.293.082c-40.751 11.541-72.602 43.391-84.142 84.142l-.083.293-.027.098c-2.484 8.709-14.827 8.709-17.31 0a21.647 21.647 0 01-.028-.098l-.082-.293a122.002 122.002 0 00-84.143-84.142l-.292-.082-.098-.028c-8.71-2.484-8.71-14.826 0-17.31l.098-.028.292-.082A122 122 0 0091.235 7.093l.082-.293z"></path></mask><g mask="url(#cs_mask_1_star-10)"><path fill="#fff" d="M200 0H0v200h200V0z"></path><path fill="url(#paint0_radial_748_4283)" d="M200 0H0v200h200V0z"></path><path fill="url(#paint1_radial_748_4283)" d="M200 0H0v200h200V0z"></path></g></g><defs><radialGradient id="paint0_radial_748_4283" cx="0" cy="0" r="1" gradientTransform="rotate(116.694 71.023 87.946) scale(199.234)" gradientUnits="userSpaceOnUse"><stop stop-color="#7c3aed"></stop><stop offset="1" stop-color="#8b5cf6" ></stop></radialGradient><radialGradient id="paint1_radial_748_4283" cx="0" cy="0" r="1" gradientTransform="rotate(-20.037 348.972 -25.908) scale(135.715)" gradientUnits="userSpaceOnUse"><stop stop-color="#4f46e5"></stop><stop offset="0.461" stop-color="#6366f1" stop-opacity="0.84"></stop><stop offset="1" stop-color="#818cf8" stop-opacity="0"></stop></radialGradient><clipPath id="cs_clip_1_star-10"><path fill="#fff" d="M0 0H200V200H0z"></path></clipPath></defs></svg>


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
                            className="inline-flex w-auto min-w-[30vw] min-h-[40vh] max-w-[95vw]  sm:max-w-[48vw]  md:max-w-[30vw] px-4 sm:px-6 py-4 sm:py-8  rounded-2xl flex-col justify-center items-start custom-spotlight-card transition-all duration-500 ease-in-out  hover:rotate-1 hover:scale-105"
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
                        <Button  classNameSting="text-[0.5em] py-[0.3rem] px-[1rem] font-semibold sm:text-[1.2em] md:text-[1em] font-light bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition-all duration-500 shadow-md hover:shadow-[0_0_50px_rgba(139,92,246,0.6),0_0_30px_rgba(59,130,246,0.5)] rounded-xl whitespace-nowrap  " text="Let's Try" />
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default LandingPage