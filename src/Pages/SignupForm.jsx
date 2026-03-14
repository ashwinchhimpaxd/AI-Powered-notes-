import React from 'react';
import Forminputs from "@/components/ui/Forminputs.jsx";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import userAuthService from "../AppWrite/auth";
import { useDispatch } from 'react-redux';
import { login } from "../redux/Authantication/UserAuthanticationSlice";
function SignupForm() {
    const dispatch = useDispatch();


    // 1. useForm parent setup
    const ReactHookformMethods = useForm();
    const { getValues, trigger } = ReactHookformMethods;

    const OnSendOtp = async () => {
        // Validate Email first
        const isValid = await trigger("Email");
        if (!isValid) return false;

        const Email = getValues("Email");
        const sendOtp = await userAuthService.sendOtp(Email); // i was close the calling of sendOtp function beacuse of rate limit
        if (!sendOtp) return false;
        return true;
    };

    const onSubmit = async () => {
        const userEnteredDetailes = getValues(["Email", "User", "OTP"]);
        const userdetaild = await userAuthService.verifyOtp(userEnteredDetailes[2], userEnteredDetailes[1]);
        console.log(userdetaild)
        if (!userdetaild) return;
        dispatch(login({
            UserData: {
                userdetaild
            }
        }));
    };

    return (
        <div className="bg-background-light  dark:bg-background-dark font-display text-[#ffffff] dark:text-white flex flex-col justify-center items-center min-h-screen w-full mx-auto px-6 py-4">
            {/* Main */}
            <div className="flex-1 flex flex-col justify-center items-center space-y-3 w-full max-w-120 max-h-full gap-10">
                {/* Heading */}
                <div className="text-center space-y-2 leading-tight fixed top-20  ">
                    <h1 className="text-[3.5rem] font-bold" style={{ color: "var(--primary-text-color)" }}>Create Account</h1>
                    <p className="text-slate-300 dark:text-slate-400 w-[80%] mx-auto md:text-[1rem] text-[1rem] tracking-tight">
                        Start your AI-powered notes-taking journey. Sign up securely with your email address.
                    </p>
                </div>

                {/* FORM */}
                <div className="w-full relative z-10  top-17">
                    <Forminputs
                        IsOTPDisable={false}
                        IsEmailDisable={false}
                        IsNameDisable={false}
                        ButtonText={'Sign Up'}
                        ReactHookformMethods={ReactHookformMethods}
                        ALLFX={{
                            onSubmitFX: onSubmit,
                            onOTPsendFX: OnSendOtp,
                        }}
                    />
                </div>

                {/* Bottom link relative positioning adjustment */}
                <p className="text-[clamp(1rem,2vw,1.1rem)] font-medium text-slate-400 absolute bottom-3 w-full text-center">
                    Already have an account?{' '}
                    <Link to="/login">
                        <span className="text-primary hover:text-primary/80 transition-colors cursor-pointer underline text-blue-700 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                            Login
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignupForm;
