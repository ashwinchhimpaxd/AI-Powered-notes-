import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Navbar from '../Component/Navbar'
import { StarFour, Trash, MagnifyingGlass } from "@phosphor-icons/react";
import { update } from '@react-spring/three'
import SpotlightCard from '../Component/SpotlightCard';
import Button from '../Component/Button';
function Dashboard() {
    const user = {
        name: "ashwin"
    }

    const [items, setItems] = useState({
        task1: {
            title: "Buy groceries Buy ashwin",
            imp: true
        },
        task2: {
            title: "Walk the dog",
            imp: false
        },
        task3: {
            title: "Read a book",
            imp: true
        },
        task4: {
            title: "Read a book",
            imp: true
        },
        task5: {
            title: "Read a book",
            imp: true
        },
        task6: {
            title: "Read a book",
            imp: true
        },
        task7: {
            title: "Read a book",
            imp: true
        },
        task8: {
            title: "Read a book",
            imp: true
        },
    });
    const [searchText, setSearchText] = useState("");

    // Filter items based on searchText
    const filteredData = Object.entries(items)
        .filter(([_, item]) =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
        );

    const totalNotes = Object.keys(items).length;
    const totalImportantNotes = Object.values(items).filter(item => item.imp).length;

    // Toggle important status
    const handleToggleImportant = (key) => {
        setItems(prev =>
        ({
            ...prev,
            [key]: {
                ...prev[key],
                imp: !prev[key].imp
            }
        })
        );
    };

    // Add this function inside your Dashboard component
    const handleDeleteNote = (key) => {
        setItems(prev => {
            const updated = { ...prev };
            console.log(updated[key]);
            delete updated[key];
            return updated;
        });
    };

    return (
        <section
            id='dashboard'
            className='relative w-full min-h-[100vh] max-h-auto selection:bg-purple-200 selection:text-black pt-4 px-2 sm:px-6 md:px-10'
        >
            <Navbar />
            <div id='dashboard-hero-section' className=' w-full h-fit capitalize text-2xl flex flex-col mt-10'>

                <div id='user-notes-info' className='flex flex-row justify-between  mt-20 items-start '>

                    <div id='user-notes-lists' className='w-[10vw] min-w-[30vw] overflow-y-hidden  bg-[#181a20] border-r border-[#31343b] h-[60vh] rounded-3xl flex flex-col p-0'>
                        <div className='px-5 pt-6 pb-3'>
                            <h2 className='text-white font-bold text-2xl mb-4'>All Notes</h2>
                            <div className="flex items-center bg-[#23252b] rounded-xl px-4 py-2">
                                <MagnifyingGlass size={24} className="text-gray-400 mr-2" />
                                <input
                                    id='search-bar'
                                    type="text"
                                    placeholder='Search By Title'
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className='bg-transparent outline-none border-none text-white placeholder:text-gray-400 w-full text-base'
                                />
                            </div>
                        </div>
                        <div className='flex-1 overflow-y-auto px-2 pb-4' id='all-notes-list'>
                            <ul className='space-y-3'>
                                {filteredData.length > 0 ? (
                                    filteredData.map(([key, item]) => (
                                        <li
                                            key={key}
                                            className='flex items-center justify-between bg-[#23252b] rounded-xl px-5 py-3 text-white shadow-sm cursor-pointer'
                                        >
                                            <span className='font-medium'>
                                                {item.title.length > 12 ? item.title.slice(0, 12) + "..." : item.title}
                                            </span>
                                            <div className='flex items-center gap-3'>
                                                <StarFour
                                                    size={22}
                                                    className='cursor-pointer text-amber-300'
                                                    weight={item.imp ? "fill" : "regular"}
                                                    onClick={() => handleToggleImportant(key)}
                                                />
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48" onClick={() => handleDeleteNote(key)} className='cursor-pointer'>
                                                    <path fill="#9575CD" d="M34,12l-6-6h-8l-6,6h-3v28c0,2.2,1.8,4,4,4h18c2.2,0,4-1.8,4-4V12H34z"></path><path fill="#7454B3" d="M24.5 39h-1c-.8 0-1.5-.7-1.5-1.5v-19c0-.8.7-1.5 1.5-1.5h1c.8 0 1.5.7 1.5 1.5v19C26 38.3 25.3 39 24.5 39zM31.5 39L31.5 39c-.8 0-1.5-.7-1.5-1.5v-19c0-.8.7-1.5 1.5-1.5l0 0c.8 0 1.5.7 1.5 1.5v19C33 38.3 32.3 39 31.5 39zM16.5 39L16.5 39c-.8 0-1.5-.7-1.5-1.5v-19c0-.8.7-1.5 1.5-1.5l0 0c.8 0 1.5.7 1.5 1.5v19C18 38.3 17.3 39 16.5 39z"></path><path fill="#B39DDB" d="M11,8h26c1.1,0,2,0.9,2,2v2H9v-2C9,8.9,9.9,8,11,8z"></path>
                                                </svg>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className='text-center text-gray-400 mt-4'>No results found</li>
                                )}
                            </ul>
                        </div>

                    </div>

                    {/* //card that show total notes and important notes */}
                    <div id='user-total-notes-and-new-notes' className=' h-[60vh]  flex gap-4 select-none flex-col w-full justify-start items-end  relative' style={{ color: "var(--para-font-color)" }}>

                        <div
                            id='user-name'
                            className='w-full text-center text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold tracking-widest uppercase mb-8 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]'
                        >
                            Welcome <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400'>{user.name}</span>
                        </div>

                        <div className='flex gap-4 justify-center items-center  ' id='total-notes-and-important-notes'>

                            <div id='totle-notes' className='text-center'>
                                <SpotlightCard className='flex flex-col gap-7 leading-[1rem]  ' spotlightColor='rgba(240 ,171 ,252, .35)'>

                                    <h1 className='capitalize font-bold text-[0.8em] tracking-wider'  >Totle notes</h1>
                                    <p className='font-[500] text-[1.8em] '>{totalNotes}</p>
                                </SpotlightCard>
                            </div>

                            <div id='totle-important-notes' className='text-center'>
                                <SpotlightCard className='flex flex-col gap-7 leading-[1rem] ' spotlightColor='rgba(240 ,171 ,252, .35)'>

                                    <h1 className='capitalize font-bold  text-[0.8em] tracking-wider'  >Important</h1>
                                    <p className='font-[500]  text-[1.8em]'>{totalImportantNotes}</p>
                                </SpotlightCard>
                            </div>

                            <div className=' order-first   ' id='new-notes'>
                                <Link to="/noteswork">
                                    <Button
                                        text="+ create note"
                                        classNameSting="uppercase  cursor-pointer rouneded-xl h-[15vh] rounded-3xl! p-[0.8rem] font-semibold sm:text-[1.2em] md:text-[0.8em] font-light bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition-all duration-500 shadow-md hover:shadow-[0_0_50px_rgba(139,92,246,0.6),0_0_30px_rgba(59,130,246,0.5)] rounded-xl whitespace-nowrap  "
                                    />
                                </Link>
                            </div>
                        </div>

                        <div className='absolute  bottom-3 w-[90%]'>

                            <SpotlightCard id="notes-info" className='flex flex-col  gap-7 text-center justify-center items-center leading-[1rem]' spotlightColor='rgba(240 ,171 ,252, .35)'>
                                <h2 className='text-[1.7rem] font-bold tracking-tighter'>Select a note from the sidebar to start editing</h2>
                                <p className='text-[0.8em] font-light tracking-normal'>Or create a new note to get started with your AI-powered note-taking experience.</p>
                            </SpotlightCard>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default Dashboard