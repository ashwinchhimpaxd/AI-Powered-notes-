import React from 'react'
import { Link } from "react-router-dom";
import Button from '../Component/Button';
import SpotlightCard from '../Component/SpotlightCard'
function Navbar() {
    const [isloggedIn, setIsLoggedIn] = React.useState(false);

    return (
        <SpotlightCard className="relative px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-2xl flex flex-row md:flex-row items-center md:justify-between transition-all duration-300 ease-in-out w-full
        "
            spotlightColor='rgba(240 ,171 ,252, .35)'
        >


            <section className='w-full  md:w-fit flex justify-center md:justify-start gap-2 sm:gap-4 items-center mb-2 md:mb-0'>
                <div className="relative w-fit p-1 rounded-xl card-3d">
                    <Link to="/">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" width="60" height="60" className="coolshapes star-10  "><g clip-path="url(#cs_clip_1_star-10)"><mask id="cs_mask_1_star-10" width="200" height="200" x="0" y="0" maskUnits="userSpaceOnUse"><path fill="#fff" d="M91.317 6.8l.028-.098c2.483-8.71 14.826-8.71 17.31 0l.027.098.083.293a122 122 0 0084.142 84.142l.293.082.098.028c8.709 2.484 8.709 14.826 0 17.31a5.593 5.593 0 01-.098.028l-.293.082c-40.751 11.541-72.602 43.391-84.142 84.142l-.083.293-.027.098c-2.484 8.709-14.827 8.709-17.31 0a21.647 21.647 0 01-.028-.098l-.082-.293a122.002 122.002 0 00-84.143-84.142l-.292-.082-.098-.028c-8.71-2.484-8.71-14.826 0-17.31l.098-.028.292-.082A122 122 0 0091.235 7.093l.082-.293z"></path></mask><g mask="url(#cs_mask_1_star-10)"><path fill="#fff" d="M200 0H0v200h200V0z"></path><path fill="url(#paint0_radial_748_4283)" d="M200 0H0v200h200V0z"></path><path fill="url(#paint1_radial_748_4283)" d="M200 0H0v200h200V0z"></path></g></g><defs><radialGradient id="paint0_radial_748_4283" cx="0" cy="0" r="1" gradientTransform="rotate(116.694 71.023 87.946) scale(199.234)" gradientUnits="userSpaceOnUse"><stop stop-color="#7c3aed"></stop><stop offset="1" stop-color="#8b5cf6" ></stop></radialGradient><radialGradient id="paint1_radial_748_4283" cx="0" cy="0" r="1" gradientTransform="rotate(-20.037 348.972 -25.908) scale(135.715)" gradientUnits="userSpaceOnUse"><stop stop-color="#4f46e5"></stop><stop offset="0.461" stop-color="#6366f1" stop-opacity="0.84"></stop><stop offset="1" stop-color="#818cf8" stop-opacity="0"></stop></radialGradient><clipPath id="cs_clip_1_star-10"><path fill="#fff" d="M0 0H200V200H0z"></path></clipPath></defs></svg>
                    </Link>
                </div>
                <div>
                    <h1 className='capitalize text-[2em] font-semibold sm:text-[2.5em] md:text-[3.3em] mix-blend-difference flex justify-center items-center leading tracking-tight  whitespace-nowrap' style={{ color: "var(--white-font-color)" }}>ai note</h1>
                </div>
            </section>

            <section className='w-fit flex justify-center md:justify-end items-center '>
                {!isloggedIn ?
                    (<div className='flex gap-2 sm:gap-4 justify-end w-full md:w-auto'>
                        <div className='button-one'>
                            <Link to="/Login">
                                <Button
                                    classNameSting="text-[1em] p-[0.8rem] font-semibold sm:text-[1.2em] md:text-[1.5em] font-light text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap"
                                    text="Sign In"
                                />
                            </Link>
                        </div>
                        <div className='button-one'>
                            <Link to="/Signup">
                                <Button
                                    classNameSting="text-[1em] p-[0.8rem] font-semibold sm:text-[1.2em] md:text-[1.5em] font-light bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition-all duration-500 shadow-md hover:shadow-[0_0_50px_rgba(139,92,246,0.6),0_0_30px_rgba(59,130,246,0.5)] rounded-xl whitespace-nowrap  "
                                    text="Get Started"
                                />
                            </Link>
                        </div>
                    </div>)
                    :
                    (<div className='flex gap-2 sm:gap-4 justify-end w-full md:w-auto'>
                        <div className='button-one'>
                            <Button
                                classNameSting="text-[1em] p-[0.5rem] sm:text-[1.2em] md:text-[1.5em] font-light text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap"
                                text="Important"
                            />
                        </div>
                        <div className='button-one'>
                            <Button
                                classNameSting="text-[1em] p-[0.5rem] sm:text-[1.2em] md:text-[1.5em] font-light bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition-all duration-500 shadow-md hover:shadow-[0_0_50px_rgba(139,92,246,0.6),0_0_30px_rgba(59,130,246,0.5)] rounded-xl whitespace-nowrap  "
                                text="creaet notes"
                            />
                        </div>
                    </div>)
                }
            </section>

        </SpotlightCard>
    )
}

export default Navbar