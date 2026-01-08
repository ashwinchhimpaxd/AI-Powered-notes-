// Dashboard.jsx
import SideNavBar from "../Component/Navbar";
import RecentNotes from "../Component/Recentnotes";
import AIActivityAndStats from "../Component/AIActivity";
import { Plus } from "@phosphor-icons/react"
import { useState } from "react";
import { useEffect } from "react";
import NotesCreationForm from "../Component/NotesCreationForm";
import getBlogData from "../AppWrite/Gettingdatafromaw"
import Appsetting from "../Component/Appsettings/Appsetting"
import { useSelector } from "react-redux";
export default function Dashboard2() {


    const settingState = useSelector(state => state.ToggleStates.settingState);
    const [NewNotesClick, setNewNotesClick] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("useEffect called");
        // getBlogData()
        // Simulate content loading
        const timer = setTimeout(() => {
            setLoading(!loading);
        }, 0); // Adjust time as needed

        return () => clearTimeout(timer);
    }, []);

    return (
        <>

            <div className="relative flex w-full min-h-screen  bg-background-light dark:bg-background-dark max-h-screen">

                <SideNavBar />

                {!settingState && <main className="flex-1 overflow-y-scroll Dashboard-main-container w-full  relative">

                    {/* Search Bar */}
                    <header className="flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-sm z-1 px-10 py-5 border-b border-white/30">

                        <div className="flex items-center justify-between  ">
                            <label className="relative flex-col min-w-40 !h-10 max-w-sm ">

                                <input
                                    type="search"
                                    className="w-full h-full pl-5 pr-4 text-white  bg-white/10 rounded-lg focus:outline-2 cursor-pointer"
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
                    {NewNotesClick && <NotesCreationForm />}
                    <div className="bg-purple-200/70 p-1 w-fit h-fit rounded-full fixed bottom-10 right-[5%] ">
                        <Plus color="white" className="text-[2.5rem] cursor-pointer " weight="bold" onClick={() => setNewNotesClick(!NewNotesClick)} />
                    </div>
                </main>}


                {settingState && <Appsetting />}

            </div >
        </>
    );
}
