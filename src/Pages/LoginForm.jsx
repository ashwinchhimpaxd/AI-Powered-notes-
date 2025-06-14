import React from 'react'
import { useForm } from 'react-hook-form'
import { EnvelopeOpen, LockSimple } from "@phosphor-icons/react";
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
        <div className="  w-1/2 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full ">
                <h2 className="text-2xl font-semibold text-center mb-2 uppercase">Welcome back </h2>
                <p className="text-1xl font-[200] text-center mb-6 capitalize"> Enter your credentials to access your notes</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeOpen size={20} className="text-gray-400" />
                            </span>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>


                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockSimple size={20} className="text-gray-400" />
                            </span>
                            <input
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="pl-10 pr-4 py-2 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-900 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm