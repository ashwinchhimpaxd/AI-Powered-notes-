// SideNavBar.jsx
import { GearSix } from "@phosphor-icons/react";
import { House, Star, Note, Robot } from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { QuickChatAIOpen, SettingsOpen } from "../redux/QuickChatAI/QuickChatAiSlice.js"
export default function SideNavBar() {

    const dispatch = useDispatch()

    // const [NavbarIconToggle, setNavbarIconToggle] = useState(false)
    return (
        <aside className=" w-[15%]  bg-background-light dark:bg-background-dark border-r border-white/30 ">
            <div className="flex flex-col items-center justify-between h-full pt-10  pb-8">

                <div className="flex flex-col items-start justify-center gap-8 h-[60vh] top-10 relative">

                    <div className="flex items-center justify-center p-3  text-white/60 gap-1 hover:text-white" role="button" >
                        {/* <House fill="white" className="md:text-[2rem]" /> */}
                        <House size={28} weight="fill" fill="white" className="hidden max-[960px]:inline-flex " />
                        <span className=" relative top-1 max-[960px]:hidden   material-symbols-outlined text-white font-bold capitalize text-[1.2rem]  
                            lg:text-[1.4rem] cursor-pointer hover:underline transition-underline duration-100 ease-in-out  " style={{ color: "var( --primary-text-color)" }}>home</span>

                    </div>

                    <div className="flex items-center justify-center p-3 text-white/60 hover:text-white gap-1" role="button" >
                        {/* <Star fill="white" className="md:text-[2rem]" /> */}
                        <Star size={28} weight="fill" fill="white" className=" hidden max-[960px]:inline-flex " />
                        <span className="material-symbols-outlined relative top-1 max-[960px]:hidden text-white font-bold capitalize text-[1.2rem]  lg:text-[1.4rem] cursor-pointer hover:underline transition-underline duration-100 ease-in-out" style={{ color: "var( --primary-text-color)" }}>Important</span>
                        {/* <span className="material-symbols-outlined">description</span> */}
                    </div>

                    <div className="flex items-center justify-center p-3 text-white/60 hover:text-white gap-1" role="button" >
                        <Note size={28} weight="fill" fill="white" className="hidden max-[960px]:inline-flex " />
                        <span className="material-symbols-outlined relative top-1 max-[960px]:hidden  text-white font-bold capitalize text-[1.2rem]  lg:text-[1.3rem] cursor-pointer hover:underline transition-underline duration-100 ease-in-out" style={{ color: "var( --primary-text-color)" }}>All notes</span>
                    </div>

                    <div className="flex items-center justify-center p-3 text-white/60 hover:text-white gap-1" role="button" >
                        <Robot size={28} weight="fill" fill="white" className="hidden max-[960px]:inline-flex " onClick={() => dispatch(QuickChatAIOpen())} />
                        <span className="material-symbols-outlined relative top-1 max-[960px]:hidden  text-white font-bold capitalize text-[1.2rem]  lg:text-[1.3rem] cursor-pointer hover:underline transition-underline duration-100 ease-in-out" style={{ color: "var( --primary-text-color)" }}
                            onClick={() => dispatch(QuickChatAIOpen())}
                        >AI Assistant</span>
                    </div>

                </div>

                <div className="flex flex-col items-center gap-1">
                    {/* <div className="flex items-center justify-center p-3 text-white/60 hover:text-white gap-1" role="button" >
                        <span className="material-symbols-outlined">settings</span>
                    </div> */}
                    <GearSix
                        onClick={() => dispatch(SettingsOpen())}
                        className="text-2xl md:text-2xl lg:text-3xl text-white cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out" title="Settings" />
                    {/* <p className="text-xs font-medium text-white/60">Settings</p> */}
                </div>

            </div>
        </aside >
    );
}
