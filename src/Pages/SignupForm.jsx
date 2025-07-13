import React from 'react';
import { useForm } from 'react-hook-form';
import { User, EnvelopeOpen, LockSimple } from "@phosphor-icons/react";
import { Link } from 'react-router-dom';

function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        console.log('Signup Data:', data);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-4 ">
            <div className="w-full max-w-xl py-10 px-6 md:px-12 bg-opacity-5 rounded-xl">
                <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-[800] text-start mb-2 uppercase text-[#fffffc]">
                    Create Account
                </h2>
                <h3 className="text-[clamp(1rem,2.5vw,1.35rem)]  tracking-tight font-[800] text-start mb-6 uppercase  text-[#4b6933]">
                    Start your AI-powered note-taking journey
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-[clamp(1rem,2.5vw,1.4rem)] font-light text-[#e3fcce] mb-1">
                            Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <User size={20} weight="thin" className="text-white" />
                            </span>
                            <input
                                autoComplete="off"
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                className="pl-10 pr-4 py-2 w-full border font-light bg-transparent text-white rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-[clamp(1rem,2.5vw,1.4rem)] font-light text-[#e3fcce] mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeOpen size={20} weight="thin" className="text-[#fdfee3]" />
                            </span>
                            <input
                                autoComplete="off"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="pl-10 pr-4 py-2 w-full border font-light bg-transparent text-white rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[clamp(1rem,2.5vw,1.4rem)] font-light text-[#e3fcce] mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockSimple size={20} weight="light" className="text-white" />
                            </span>
                            <input
                                autoComplete="off"
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    },
                                    pattern: {
                                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                                        message: 'Must contain at least one letter and one number'
                                    }
                                })}
                                className="pl-10 pr-4 py-2 w-full border bg-transparent text-white rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full text-[clamp(1rem,2.5vw,1.4rem)] font-medium py-2 rounded-xl 
                       bg-gradient-to-r from-[#6a85f1] to-[#8854d0] 
                       text-[#e6fdd3] transition duration-300 ease-in-out hover:opacity-90 cursor-pointer"
                    >
                        Create account
                    </button>
                </form>

                <p className="text-[clamp(1rem,2vw,1.2rem)] font-medium text-[#e3fcce] mt-6 text-center">
                    Already have an account?{' '}
                    <Link to="/login">
                        <span className="text-[#6a85f1] cursor-pointer underline">
                            Login
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignupForm;
