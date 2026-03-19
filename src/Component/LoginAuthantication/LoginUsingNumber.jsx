import React from "react";
import userAuthService from "@/AppWrite/auth";
import { useDispatch } from "react-redux";
import { login } from "@/redux/Authantication/UserAuthanticationSlice.js";
import Forminputs from "@/components/ui/Forminputs.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const LoginUsingNumber = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. useForm ko Parent me le aaye
    const formMethods = useForm();
    const { getValues, trigger } = formMethods;

    const OnSendOtp = async () => {
        // Validate Email first
        const isValid = await trigger("Email");
        if (!isValid) return false;

        // Get value directly inside parent
        const Email = getValues("Email");

        console.log("Sending OTP to:");
        try {
            await userAuthService.sendOtp(Email);
            // Success message or state update here
            return true;
        } catch (error) {
            console.log(error.message)
            return false;
        }
    };


    const onSubmit = async (data) => {
        try {
            const currentUser = await userAuthService.getCurrentUser();
            // console.log(currentUser);
            if (currentUser) {
                console.log("User already logged in. Syncing state...");
                dispatch(login({
                    UserData: {
                        userdetaild: currentUser
                    }
                }));
                navigate("/Dashboard");
                return;
            }
            const Userlogin = await userAuthService.verifyOtp(String(data.OTP), data.User);
            if (Userlogin) {
                dispatch(login({
                    UserData: {
                        userdetaild: Userlogin
                    }
                }));
                // SUCCESS: Redirect to Dashboard (Match App.jsx case)
                navigate("/Dashboard");
            }
            // Redirect to dashboard or appropriate page after successful login
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#ffffff] dark:text-white flex flex-col justify-center items-center min-h-screen w-full  mx-auto px-6 py-4  ">


            {/* Main */}
            <div className="flex-1 flex flex-col  justify-center items-center  w-full max-w-120 ">

                {/* Heading */}
                <div className="text-center  space-y-1 leading-tight  relative top-10">
                    <h1 className="text-[3.2rem] font-bold " style={{ color: "var(--primary-text-color)" }}>Welcome Back</h1>
                    <p className="text-slate-300 dark:text-slate-400  w-[85%]  mx-auto md:text-[1.1rem] text-[1.1rem] tracking-tight" >
                        Focus on your writing. Log in securely with your email address.
                    </p>
                </div>

                {/* FORM */}
                <Forminputs IsOTPDisable={false} IsEmailDisable={false} IsNameDisable={true} ButtonText={'Login'}
                    ReactHookformMethods={formMethods}
                    ALLFX={
                        {
                            onSubmitFX: onSubmit,
                            onOTPsendFX: OnSendOtp,

                        }} />



                {/* Bottom link relative positioning adjustment */}

                <p className="text-[clamp(1rem,2vw,1.1rem)] font-medium text-slate-400 text-center relative bottom-1">
                    Don't have an account?{' '}
                    <Link to="/signup">
                        <span className="text-primary hover:text-primary/80 transition-colors cursor-pointer underline text-blue-700 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                            Signup
                        </span>
                    </Link>
                </p>
            </div>


        </div >
    );
};

export default LoginUsingNumber;
