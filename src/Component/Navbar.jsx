import React from 'react'
import { Link } from "react-router-dom";
import Button from '../Component/Button';
function Navbar() {
    const [isloggedIn, setIsLoggedIn] = React.useState(false);

    return (
        <div className="relative px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-2xl flex flex-row md:flex-row items-center md:justify-between
                        bg-white/15
                        backdrop-blur-md
                        border border-white/3
                        transition-all duration-300 ease-in-out
                        w-full
        ">

            <section className='w-full  md:w-fit flex justify-center md:justify-start gap-2 sm:gap-4 items-center mb-2 md:mb-0'>
                <div className="relative w-fit p-1 rounded-xl card-3d">
                    <Link to="/"><img src="public\AI Star logo\AILOGO-01.svg" alt="AI-LOGO" className='h-10 sm:h-12 md:h-15' /></Link>
                </div>
                <div>
                    <h1 className='capitalize text-[2em] sm:text-[2.5em] md:text-[3.3em] mix-blend-difference flex justify-center items-center leading tracking-tight font-extralight whitespace-nowrap' style={{ color: "var(--white-font-color)" }}>ai note</h1>
                </div>
            </section>

            <section className='w-fit flex justify-center md:justify-end items-center '>
                {!isloggedIn ?
                    (<div className='flex gap-2 sm:gap-4 justify-end w-full md:w-auto'>
                        <div className='button-one'>
                            <Link to="/Login">
                                <Button
                                    classNameSting="text-[1em] p-[0.5rem] sm:text-[1.2em] md:text-[1.5em] font-light text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out whitespace-nowrap"
                                    text="Sign In"
                                />
                            </Link>
                        </div>
                        <div className='button-one'>
                            <Link to="/Signup">
                                <Button
                                    classNameSting="text-[1em] p-[0.5rem] sm:text-[1.2em] md:text-[1.5em] font-light bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition-all duration-500 shadow-md hover:shadow-[0_0_50px_rgba(139,92,246,0.6),0_0_30px_rgba(59,130,246,0.5)] rounded-xl whitespace-nowrap  "
                                    text="Get Started"
                                />
                            </Link>
                        </div>
                    </div>)
                    :
                    (<div className='flex gap-2 sm:gap-4 justify-end w-full md:w-auto'>
                        <div className='button-one'>
                            <Button
                                classNameSting="text-[1em] sm:text-[1.2em] md:text-[1.5em]! font-light text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out capitalize"
                                text="fav"
                            />
                        </div>
                        <div className='button-one'>
                            <Button
                                classNameSting="capitalize text-[1em] sm:text-[1.2em] md:text-[1.5em] font-light bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition-all duration-500 shadow-md hover:shadow-[0_0_50px_rgba(139,92,246,0.6),0_0_30px_rgba(59,130,246,0.5)] rounded-xl"
                                text="creaet notes"
                            />
                        </div>
                    </div>)
                }
            </section>
        </div>
    )
}

export default Navbar