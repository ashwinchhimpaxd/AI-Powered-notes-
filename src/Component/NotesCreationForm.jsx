import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { setcurrentnoteinfo, resetcurrentnoteinfo } from '../redux/currentnoteinfoslice/currentnoteinfoslice';
import { NotePencil, X } from '@phosphor-icons/react';

function NotesCreationForm({ setNewNotesClick }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm({ defaultValues: { title: "" } });

    const onSubmit = async (data) => {
        dispatch(resetcurrentnoteinfo());
        const title = data.title;
        const generatedSlug = title
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

        dispatch(setcurrentnoteinfo({ title: title, slug: generatedSlug }));

        setNewNotesClick(false);
        reset();
        if (generatedSlug) {
            navigate(`/Dashboard/editor/${generatedSlug}`);
        } else {
            navigate('/Dashboard/editor');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            
            {/* Modal Container */}
            <div className="relative w-full max-w-[400px] bg-[#121212] border border-[#262626] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#262626] bg-[#1a1a1a]">
                    <div className="flex items-center gap-2 text-white">
                        <NotePencil className="size-5 text-[#8b5cf6]" weight="fill" />
                        <h2 className="text-lg font-bold">New Note</h2>
                    </div>
                    <button 
                        onClick={() => {
                            setNewNotesClick(false);
                            reset();
                        }}
                        className="text-[#a1a1aa] hover:text-white transition-colors p-1"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        
                        {/* Input Group */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-sm font-medium text-[#a1a1aa] ml-1">Note Title</label>
                            <input 
                                {...register("title", { required: "A title is required" })} 
                                placeholder="E.g., Project Ideas..." 
                                autoFocus
                                className="w-full bg-[#0a0a0a] border border-[#262626] focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] text-white rounded-xl px-4 py-3 outline-none transition-all placeholder:text-[#52525b]" 
                            />
                            {errors.title && (
                                <span className="absolute -bottom-5 left-1 text-xs font-semibold text-red-400">
                                    {errors.title.message}
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setNewNotesClick(false);
                                    reset();
                                }}
                                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#a1a1aa] bg-[#1a1a1a] hover:bg-[#262626] hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#8b5cf6] hover:bg-[#7c3aed] transition-colors flex items-center justify-center min-w-[100px] shadow-lg shadow-[#8b5cf6]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Creating..." : "Create Note"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NotesCreationForm