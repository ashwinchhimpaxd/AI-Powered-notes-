
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { REGEXP_ONLY_DIGITS } from "input-otp"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
function UserEmailNamechanges() {
    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        setValue,
        setFocus,
        control,
        formState: { errors, isSubmitting },
    } = useForm({});

    const emailRegister = register("Email", {
        required: "Email require",
        pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Invalid email address",
        },
    });


    // cooldown state for resend otp button
    const [cooldown, setCooldown] = useState(0);
    const [username, setusername] = useState("ashwin");
    const [useremail, setuseremail] = useState("nuni@gmail.com");

    const [IsNameEdit, setIsNameEdit] = useState(false);
    const [IsEmailEdit, setIsEmailEdit] = useState(false);

    const OnSendOtp = async () => {

        console.log("Send OTP clicked");
        // validate email first
        // const isValid = await trigger("Email");
        // if (!isValid) {
        //     setIsEmailEdit(true);
        //     setFocus && setFocus("Email");
        //     return;
        // }
        // setCooldown(5);
        // const { Email } = getValues();
        // try {
        //     if (typeof userAuthService !== "undefined" && userAuthService.sendOtp) {
        //         await userAuthService.sendOtp(Email);
        //     } else {
        //         console.log("sendOtp placeholder, Email:", Email);
        //     }
        // } catch (error) {
        //     console.log(error.message)
        // }
    };

    React.useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    // const [Name, setName] = useState("ashwin")
    const CheckName = () => {
        if (username.trim().length === 0) {
            setusername("ashwin");
            return;
        }
        setusername(username.replace(/\s+/g, ' ').trim());
    }

    const checkuseremail = () => {
        if (useremail.trim().length === 0) {
            setuseremail("ashwin@gmail.com");
            return;
        }
        return;
    }

    const onSubmit = data => {
        console.log('Profile data:', data)
    }

    return (

        <section className="space-y-6 border-white/20 border-y p-6 min-h-fit relative  bg-black/20 backdrop-blur-sm shadow-glass">
            <h2 className="text-[2rem] font-bold  text-white uppercase tracking-wider pl-1">Profile</h2>
            <div className="glass-panel rounded-2xl space-y-10 s  p-8 flex flex-col md:flex-row items-start justify-between gap-10  shadow-glass">
                <div className="relative group ">
                    <img alt="Profile" className="size-20 rounded-full object-cover ring-4 ring-white/5 shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1qc4tvjBVPlfp3DnDnxMofgyKvIqfegNplSnqH6UiTtl8mNjD0bUbAt1QOhqH1PyAVLaX77MxtHV1_czTSZ3cSMEdBlE2XfiowN-SYUhNPaoOGKaSlxmx9yZjxdv64LE6fnX4GZ8taUiHxU81MgCI_iSFwH-NnJYH24BR_owKrG_zjuPT-GQWgb3bn8ILyXz1eUnTVXpvVbHO4M4Xh8MK6fajTCOCKdPT6nHEm7zaammop9Zl7T7_D4xyJhXNWNZ1csj72IqyVg" />
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer backdrop-blur-sm">
                        <span class="material-icons-round text-white">camera_alt</span>
                    </div>
                </div>


                <form onSubmit={handleSubmit(onSubmit)} class=" w-full  px-2 h-fit grid grid-cols-1 md:grid-cols-2  gap-3  justify-center ">
                    {/* user name field  */}
                    <div className="space-y-2  w-full  relative">
                        <label className="text-4xl font-semibold ml-2" style={{ color: "var(--primary-text-color)" }}>
                            Name
                        </label>
                        <div className="flex gap-3 ">
                            {/* userName Input */}
                            <div className="flex-1">
                                {!IsNameEdit ? (
                                    <h2 onClick={() => setIsNameEdit(true)} className='text-xl border text-text-primary/50 font-semibold p-3 text-debugred' >
                                        {username}
                                    </h2>
                                ) : (

                                    <input
                                        type="text"
                                        placeholder="User name"
                                        autoFocus
                                        value={username}
                                        {...register("User", { required: false })}
                                        onBlur={() => {
                                            CheckName();
                                            setIsNameEdit(false)
                                        }}
                                        onChange={(e) => setusername(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                CheckName();
                                                setIsNameEdit(false)
                                            };
                                        }}
                                        style={{ color: "var(--primary-text-color)" }}
                                        className="form-input w-full text-xl font-semibold  bg-surface-light dark:bg-surface-dark   dark:border-slate-700 rounded-xl p-3 placeholder:text-slate-400  focus:ring-0 focus:outline-0   "
                                    />
                                )}
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

                    {/* email section and otp section  */}
                    <div className="space-y-2 relative  w-full flex flex-col ">
                        <label className="text-4xl font-semibold ml-2" style={{ color: "var(--primary-text-color)" }}>
                            Email
                        </label>
                        <div className=' '>
                            <div className="flex  ">
                                {/* email Input */}
                                <div className="flex-1">
                                    {!IsEmailEdit ? (
                                        <h2 onClick={() => setIsEmailEdit(true)} className='text-xl   font-semibold p-3' style={{ color: "var(--primary-text-color)" }}>
                                            {useremail}
                                        </h2>
                                    ) : (

                                        <input
                                            type="email"
                                            placeholder="you@gmail.com"
                                            autoFocus
                                            value={useremail}
                                            {...emailRegister}
                                            onBlur={(e) => {
                                                const related = e.relatedTarget || document.activeElement;
                                                const clickedSendButton = related && related.id === 'send-otp-btn';
                                                const otpfieldUsing = related && related.id === 'otp-input-field';
                                                if (clickedSendButton || otpfieldUsing) {
                                                    // keep edit open because user clicked Send
                                                    return;
                                                }
                                                if (emailRegister.onBlur) emailRegister.onBlur(e);
                                                checkuseremail();
                                                setIsEmailEdit(false);
                                            }}
                                            onChange={(e) => {
                                                setuseremail(e.target.value);
                                                if (emailRegister.onChange) emailRegister.onChange(e);
                                                setValue && setValue("Email", e.target.value, { shouldValidate: true, shouldDirty: true });
                                            }}
                                            style={{ color: "var(--primary-text-color)" }}
                                            className="form-input w-full text-xl font-semibold  bg-surface-light dark:bg-surface-dark   dark:border-slate-700 rounded-xl p-3 placeholder:text-slate-400  focus:ring-0 focus:outline-0   "
                                        />
                                    )}
                                </div>
                            </div>

                            {/* otp send button and error show div  */}
                            <div className="  flex justify-between pr-1 relative  h-7  ">

                                {errors.Email && (
                                    <p className="text-1xs text-red-500 ml-2 mt-2 ">
                                        {errors.Email.message}
                                    </p>
                                )}
                                {IsEmailEdit &&
                                    <button
                                        id="send-otp-btn"
                                        type="button"
                                        // onMouseDown={(e) => {
                                        //     // run send before input blur/unmount
                                        //     e.preventDefault();
                                        //     OnSendOtp();
                                        // }}
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
                                }
                            </div>


                            {/* OTP Section */}
                            {IsEmailEdit && <div className="mt-4   text-2xl space-y-2 relative w-full    ">
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
                                            id="otp-input-field"
                                            value={field.value}       // Connect value from RHF
                                            onChange={field.onChange} // Connect onChange from RHF
                                        >
                                            <InputOTPGroup
                                                className="w-[18em] flex input-otp-slot"
                                                style={{ "--slot-width": "100%" }}
                                            >
                                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                                    <InputOTPSlot
                                                        key={i}
                                                        index={i}
                                                        className="flex-1 text-white h-10 text-[1.3rem]"
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
                            </div>}
                        </div>
                    </div>

                    <div class="md:col-span-2 flex justify-end">
                        <button type="submit" class="shrink-0 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/5">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </section>

    )
}

export default UserEmailNamechanges;