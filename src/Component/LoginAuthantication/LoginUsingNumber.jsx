import React from "react";
import { useForm, Controller } from "react-hook-form";
import userAuthService from "@/AppWrite/auth";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useDispatch } from "react-redux";
import { login } from "@/redux/Authantication/UserAuthanticationSlice.js";
const LoginUsingNumber = () => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        control,
        formState: { errors, isSubmitting },
    } = useForm({});

    const [cooldown, setCooldown] = React.useState(0);


    const OnSendOtp = async () => {
        // validate email first
        const isValid = await trigger("Email");
        if (!isValid) return;
        setCooldown(5);
        const { Email } = getValues();
        try {
            await userAuthService.sendOtp(Email);
        } catch (error) {
            console.log(error.message)
        }
    };

    React.useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);


    const onSubmit = async (data) => {
        try {
            const currentUser = await userAuthService.getCurrentUser();
            console.log(currentUser);
            if (currentUser) {
                console.log("User already logged in.");
                return;
            }
            const Userlogin = await userAuthService.verifyOtp({ otp: String(data.OTP), userName: data.User });
            if (Userlogin) {
                dispatch(login({
                    Islogin: true,
                    UserData: {
                        userId: Userlogin.userId,
                        UserName: data.User
                    }
                }));
                // console.log("User logged in successfully!", Userlogin);
            }
            // Redirect to dashboard or appropriate page after successful login
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#ffffff] dark:text-white flex flex-col justify-center items-center min-h-screen w-full  mx-auto px-6 py-4  ">


            {/* Main */}
            <div className="flex-1 flex flex-col  justify-center items-center  pb-12 w-full max-w-[30rem]">

                {/* Heading */}
                <div className="text-center mb-10 space-y-1 leading-tight">
                    <h1 className="text-[3.5rem] font-bold " style={{ color: "var(--primary-text-color)" }}>Welcome Back</h1>
                    <p className="text-slate-300 dark:text-slate-400  w-[80%]  mx-auto md:text-[1rem] text-[1rem] tracking-tight" >
                        Focus on your writing. Log in securely with your email address.
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8  w-full   ">

                    {/* Mobile Number */}
                    <div className="space-y-1 relative h-[100px]   ">
                        <label className="text-xl font-semibold ml-2" style={{ color: "var(--primary-text-color)" }}>
                            Email
                        </label>
                        <div className="flex gap-3 ">
                            {/* Phone Input */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="youemail@example.com"
                                    {...register("Email", {
                                        required: "Email require for OTP verification",
                                        pattern: {
                                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="form-input w-full h-10 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 font-medium placeholder:text-slate-400  focus:ring-0 focus:outline-none "
                                />
                            </div>
                        </div>

                        <div className=" flex justify-between pr-1 relative  ">

                            {errors.Email && (
                                <p className="text-1xs text-red-500 ml-2 mt-2">
                                    {errors.Email.message}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={OnSendOtp}
                                disabled={cooldown > 0}
                                className={`absolute right-2 top-2 text-[1rem] transition
                                        ${cooldown > 0
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-blue-500 hover:underline cursor-pointer"}
                                        `}
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : "send code"}
                            </button>

                        </div>
                    </div>

                    {/* userName */}
                    <div className="space-y-2 relative  h-[100px] ">
                        <label className="text-xl font-semibold ml-2" style={{ color: "var(--primary-text-color)" }}>
                            Name
                        </label>
                        <div className="flex gap-3 ">
                            {/* Phone Input */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="User name"
                                    {...register("User", { required: "Enter User Name" })}
                                    className="form-input w-full h-10 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 font-medium placeholder:text-slate-400  focus:ring-0 focus:outline-none   "
                                />
                            </div>
                        </div>

                        <div>
                            {errors.User && (
                                <p className="text-1xs text-red-500 ml-2 mt-2">
                                    {errors.User.message}
                                </p>
                            )}

                        </div>
                    </div>

                    {/* OTP Section */}
                    <div className="mt-4  text-2xl space-y-2 relative w-full  h-[105px]">
                        <label className="text-xl font-semibold ml-2" style={{ color: "var(--primary-text-color)" }}>
                            Verification Code
                        </label>

                        <Controller
                            name="OTP"
                            control={control}
                            rules={{
                                required: "Enter OTP Code",
                                minLength: {
                                    value: 6,
                                    message: "Your OTP must be 6 characters"
                                }
                            }}
                            render={({ field }) => (
                                <InputOTP
                                    maxLength={6}
                                    pattern={REGEXP_ONLY_DIGITS}
                                    className="w-full"
                                    value={field.value}       // Connect value from RHF
                                    onChange={field.onChange} // Connect onChange from RHF
                                >
                                    <InputOTPGroup
                                        className="w-[30rem] flex input-otp-slot"
                                        style={{ "--slot-width": "100%" }}
                                    >
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className="flex-1 h-10 text-[1.3rem]"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />
                        <div>
                            {errors.OTP && (
                                <p className=" text-red-500 ml-2 text-[1rem] ">
                                    {errors.OTP.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        class="w-full  relative mt-10 overflow-hidden rounded-md bg-blue-500 px-5 py-2.5 text-xl text-white font-semibold duration-300 [transition-timing-function:cubic-bezier(0.175,0.885,0.32,1.275)] active:translate-y-1 active:scale-x-110 active:scale-y-95 flex justify-center items-center gap-2">{!isSubmitting ? "Create Account" : "Loading..."}

                    </button>
                </form>
            </div>




        </div >
    );
};

export default LoginUsingNumber;
