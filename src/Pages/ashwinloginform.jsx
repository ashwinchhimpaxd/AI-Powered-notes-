import React from 'react'
import { useForm } from 'react-hook-form'
import { EnvelopeOpen, LockSimple } from "@phosphor-icons/react";
import { Link } from 'react-router-dom';

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        console.log('Login Data:', data);

    };

    return (
        <div id="dashboard" className=" min-h-screen w-full flex items-center justify-center px-4 selection:bg-purple-200 selection:text-black">
            <div className="w-full max-w-xl py-12 px-8 md:px-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>

                <div className="relative z-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <LockSimple size={40} weight="fill" className="text-[#FFD151]" />
                        </div>
                        <h2 className="text-[clamp(2rem,4vw,2.5rem)] font-[800] text-center uppercase tracking-wide" style={{ color: "var(--primary-text-color)" }}>
                            Welcome Back
                        </h2>
                        <h3 className="text-[clamp(1rem,2vw,1.15rem)] tracking-wide font-medium text-center uppercase mt-2 opacity-90" style={{ color: "var(--primary-landing-page-text-color)" }}>
                            Login to access your AI-powered notes
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Email */}
                        <div className="group">
                            <label className="block text-[clamp(0.9rem,2vw,1.1rem)] font-semibold text-white/90 mb-2 tracking-wide uppercase">
                                Email
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-[#FFD151]">
                                    <EnvelopeOpen size={22} weight="regular" className="text-white/70 group-focus-within:text-[#FFD151] transition-colors" />
                                </span>
                                <input
                                    autoComplete="off"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="pl-12 pr-4 py-3.5 w-full border border-white/20 bg-black/20 text-white rounded-xl shadow-inner focus:ring-2 focus:ring-[#5F4A8B] focus:border-transparent focus:outline-none transition-all placeholder-white/40"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-2 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label className="block text-[clamp(0.9rem,2vw,1.1rem)] font-semibold text-white/90 mb-2 tracking-wide uppercase">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-[#FFD151]">
                                    <LockSimple size={22} weight="regular" className="text-white/70 group-focus-within:text-[#FFD151] transition-colors" />
                                </span>
                                <input
                                    autoComplete="off"
                                    type="password"
                                    placeholder="Enter your password"
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
                                    className="pl-12 pr-4 py-3.5 w-full border border-white/20 bg-black/20 text-white rounded-xl shadow-inner focus:ring-2 focus:ring-[#5F4A8B] focus:border-transparent focus:outline-none transition-all placeholder-white/40"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-2 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full text-[clamp(1.1rem,2vw,1.4rem)] font-bold py-3.5 rounded-xl 
                                       bg-[#5F4A8B] hover:bg-[#A60003] hover:scale-[1.02] active:scale-[0.98]
                                       text-white shadow-lg transition-all duration-300 ease-in-out cursor-pointer uppercase tracking-wider flex justify-center items-center gap-2"
                            >
                                Login
                                <LockSimple size={20} weight="bold" />
                            </button>
                        </div>
                    </form>

                    <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] font-medium text-white/80 mt-8 text-center uppercase tracking-wide">
                        Don't have an account?{' '}
                        <Link to="/Signup" className="inline-block hover:scale-105 transition-transform">
                            <span className="text-white font-bold cursor-pointer border-b-2 border-transparent hover:border-[#FFD151] transition-all">
                                Sign Up
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm