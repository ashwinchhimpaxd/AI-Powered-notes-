// SideNavBar.jsx
import { GearSix } from "@phosphor-icons/react";

import { useDispatch, useSelector } from "react-redux";
import { QuickChatAIOpen } from "../redux/QuickChatAI/QuickChatAiSlice.js"
export default function SideNavBar() {

    const dispatch = useDispatch()
    return (
        <aside className="flex-shrink-0 w-[15%]  bg-background-light dark:bg-background-dark border-r border-white/30">
            <div className="flex flex-col items-center justify-between h-full pt-10 pb-8">

                <div className="flex flex-col items-center gap-10 ">

                    <div className="flex items-center justify-center w-14 md:w-14 hover:scale-115 transition-all duration-300 ease-in-out">
                        <img src="public\AI Star logo\Star-2.svg" alt="Logo" />
                    </div>

                    <div className="flex flex-col items-start justify-between  ">
                        <div className="flex items-center justify-center p-3 rounded-lg bg-primary/20 text-primary " role="button" >
                            {/* <House fill="white" className="md:text-[2rem]" /> */}
                            <span className="material-symbols-outlined text-white font-bold capitalize text-[1.2rem]  lg:text-[1.3rem] cursor-pointer hover:underline transition-underline duration-100 ease-in-out" style={{ color: "var( --primary-text-color)" }}>home</span>
                        </div>

                        <div className="flex items-center justify-center p-3 text-white/60 hover:text-white transition-colors">
                            {/* <Star fill="white" className="md:text-[2rem]" /> */}
                            <span className="material-symbols-outlined text-white font-bold capitalize text-[1.2rem]  lg:text-[1.3rem] cursor-pointer hover:underline transition-underline duration-100 ease-in-out" style={{ color: "var( --primary-text-color)" }}>star</span>
                            {/* <span className="material-symbols-outlined">description</span> */}
                        </div>

                        <div className="flex items-center justify-center p-3 text-white/60 hover:text-white transition-colors">
                            <span className="material-symbols-outlined  text-white font-bold capitalize text-[1.2rem]  lg:text-[1.3rem] cursor-pointer hover:underline transition-underline duration-100 ease-in-out" style={{ color: "var( --primary-text-color)" }}>All notes</span>
                        </div>
                        <div className="flex items-center justify-center p-3 text-white/60 hover:text-white transition-colors">
                            <span className="material-symbols-outlined  text-white font-bold capitalize text-[1.2rem]  lg:text-[1.3rem] cursor-pointer hover:underline transition-underline duration-100 ease-in-out" style={{ color: "var( --primary-text-color)" }}
                                onClick={() => dispatch(QuickChatAIOpen())}
                            >Quick AI</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    {/* <div className="flex items-center justify-center p-3 text-white/60 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">settings</span>
                    </div> */}
                    <GearSix className="text-2xl md:text-2xl lg:text-3xl text-white cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out" title="Settings" />
                    {/* <p className="text-xs font-medium text-white/60">Settings</p> */}
                </div>
            </div>
        </aside >
    );
}
