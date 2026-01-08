import React from 'react'
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { Notetitlesetter } from '../redux/NotesCreation/NotesCreationSlice.js'
function NotesCreationForm() {


    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { isSubmitting, errors },
    } = useForm({ defaultValues: { title: "Untitled" } });
    const onSubmit = async (data) => {
        console.log(data);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate an async operation
        setNewNotesClick(false); // Close the modal after submission
        reset(); // Clear the form after submission
    };


    return (
        <div className=" z-99  bg-white/10  backdrop-blur-xs absolute w-full h-full flex justify-center  items-center">

            <div className="border border-white/30  relative w-1/3 h-1/2 text-center capitalize flex flex-col justify-start items-center p-10 text-white rounded-4xl bg-[#191919]">
                <p className="text-white text-4xl font-bold capitalize" style={{ color: "var( --primary-text-color)" }}>note name</p>

                <div id="take-note-name " className=" h-full w-full flex flex-col justify-center items-center  gap-10" >

                    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-evenly items-center ">
                        {/* register your input into the hook by invoking the "register" function */}
                        <input {...register("title", { required: "title is required" })} placeholder="enter title" className="border w-full text-start md:text-2xl p-2 pt-3 rounded-xl bg-white/8 border-white/30" style={{ color: "var( --primary-text-color)" }} />

                        {errors.title && <span className="absolute top-[50%] right-[10%]  ">{errors.title.message}</span>}

                        <div id="Okay-cancle-BTN" className="flex w-full justify-center items-center gap-15 text-2xl  ">

                            <Link to="/editor" className="">
                                <button type="submit" className="px-5 py-2 pt-3 capitalize  rounded-full  text-2xl font-semibold cursor-pointer bg-white/8 
                                border-[0.2px] border-white/30 flex justify-center items-center hover:bg-white/10 " style={{ color: "var( --primary-text-color)" }} disabled={isSubmitting}
                                    onClick={() => dispatch(Notetitlesetter(getValues("title")))}
                                >
                                    {isSubmitting ? "Creating..." : "Create"}
                                </button>
                            </Link>

                            <button className="px-5 py-2 pt-3 capitalize  rounded-full  text-2xl font-semibold cursor-pointer bg-white/8 
                                border-[0.2px] border-white/30 flex justify-center items-center hover:bg-white/10 " onClick={() => {

                                    setNewNotesClick(!NewNotesClick)
                                    reset()
                                }} style={{ color: "var( --primary-text-color)" }}>Cancel</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default NotesCreationForm