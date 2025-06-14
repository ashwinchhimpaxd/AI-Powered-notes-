import React from 'react'
import SignupForm from "../Pages/SignupForm"

function Signup() {
    return (
        <div className="relative w-full min-h-screen">
            <div className="flex flex-col md:flex-row w-full h-full bg-black">

                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1680783954745-3249be59e527?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Signup"
                    className="w-full md:w-1/2 h-[100vh] md:h-screen object-cover"
                />

                {/* Signup Form */}
                <div className="absolute top-0 left-0 w-full h-full md:static md:w-1/2 flex items-center justify-center">
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}

export default Signup
