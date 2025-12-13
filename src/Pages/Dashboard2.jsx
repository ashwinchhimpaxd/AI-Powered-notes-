// Dashboard.jsx
import SideNavBar from "../Component/Navbar";
import RecentNotes from "../Component/Recentnotes";
import AIActivityAndStats from "../Component/AIActivity";
import { Plus } from "@phosphor-icons/react"
import { useState } from "react";
import { Link } from "react-router-dom";
export default function Dashboard2() {


    const [NewNotesClick, setNewNotesClick] = useState(false);

    return (
        <div className="relative flex w-full min-h-screen font-display bg-background-light dark:bg-background-dark max-h-screen">

            <SideNavBar />

            <main className="flex-1 overflow-y-scroll Dashboard-main-container">

                {/* Search Bar */}
                <header className="flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-sm z-10 px-10 py-5 border-b border-white/30">

                    <div className="flex items-center justify-between gap-8 ">
                        <label className="relative flex-col min-w-40 !h-10 max-w-sm">

                            <input
                                type="search"
                                className="w-full h-full pl-12 pr-4 text-white bg-white/10 rounded-lg focus:ring-primary/10  cursor-pointer"
                                placeholder="Search notes..."
                            />
                        </label>
                    </div>

                    <div className="flex items-center ">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-10 "
                            style={{
                                backgroundImage:
                                    'url("https://i.pinimg.com/736x/e2/7c/a8/e27ca8535e10433175054a362a50f994.jpg")',
                            }}
                        />
                    </div>
                </header>

                {/* Sections */}
                <div className="p-10">

                    <RecentNotes />
                    <AIActivityAndStats />
                </div>
            </main>

            {NewNotesClick && <div className=" z-99  bg-white/10  backdrop-blur-xs absolute w-full h-full flex justify-center  items-center">

                <div className="border border-white/30  relative w-1/2 h-1/2 text-center capitalize flex flex-col gap-15 justify-start items-center p-10 text-white rounded-4xl bg-[#191919]">
                    <p className="text-white text-5xl font-bold">Create a new note</p>

                    <div id="take-note-name " className=" h-full w-full flex flex-col justify-center items-center gap-10" >

                        <input type="text" class="w-[85%] min-w-0  resize-none overflow-hidden rounded-lg border-2 border-white/10 bg-white/5 p-4 text-xl leading-normal text-white placeholder:text-gray-400 ring-2 ring-transparent transition-all focus:border-primary focus:outline-0 focus:ring-primary/30" placeholder="Enter your note title..." />

                        <div id="Okay-cancle-BTN" className="flex w-full justify-center items-center gap-15 text-2xl ">

                            <Link to={"/Editor"} className="px-5 py-2 pt-3  rounded-full w-[30%] text-3xl font-semibold bg-[#1A1A1A] border-[0.2px] border-white/20  cursor-pointer flex justify-center items-center hover:bg-[#101010]/10">
                                <button  >Create</button>
                            </Link>
                            <button className="px-5 py-2 pt-3  rounded-full w-[30%] text-3xl font-semibold cursor-pointer bg-white/8 border-[0.2px] border-white/30 flex justify-center items-center hover:bg-white/10 " onClick={() => setNewNotesClick(!NewNotesClick)}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            }
            <div className="bg-purple-200/70 p-1 w-fit h-fit rounded-full fixed bottom-10 right-[5%] ">
                <Plus color="white" className="text-[2.5rem] cursor-pointer " weight="bold" onClick={() => setNewNotesClick(!NewNotesClick)} />
            </div>
        </div>
    );
}
