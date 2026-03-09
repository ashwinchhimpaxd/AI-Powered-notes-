import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { FloppyDisk, CircleNotch } from "@phosphor-icons/react"

const Forminputs = ({ IsNameDisable = true, IsEmailDisable = true, IsOTPDisable = false, ButtonText, ALLFX, ReactHookformMethods }) => {

    const { onSubmitFX, onOTPsendFX } = ALLFX ? ALLFX : {};
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = ReactHookformMethods ? ReactHookformMethods : useForm({
        defaultValues: {
            Email: '',
            User: '',
            OTP: ''
        }
    });


    const [cooldown, setCooldown] = React.useState(0);
    const [isOTPVisible, setIsOTPVisible] = React.useState(IsEmailDisable); // Show by default if no email field

    const handleSendOTP = async () => {
        if (onOTPsendFX) {
            const success = await onOTPsendFX(); // Parent handles logic and returns false if validation/sending fails
            if (!success) return;
        }
        setCooldown(9);
        setIsOTPVisible(true);
    };

    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);

    }, [cooldown]);


    return (

        <div className="flex-1 flex flex-col justify-center items-center w-full">

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmitFX && onSubmitFX)} className=" w-full">

                {/* email input */}
                {!IsEmailDisable && <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">
                        Email Address
                    </label>
                    <div className="flex gap-3">
                        {/* Email Input */}
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                placeholder="yourname@example.com"
                                {...register("Email", {
                                    required: "Email require for OTP verification",
                                    pattern: {
                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                                className="w-full h-12 bg-input/10 text-white border border-border focus:border-primary/50 rounded-xl px-4 font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none hover:bg-input/20"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between pr-1 relative min-h-[24px] items-center">
                        <div className="w-full">
                            {errors.Email ? (
                                <p className="text-xs text-destructive ml-2 mt-1 font-medium animate-pulse">
                                    {errors.Email.message}
                                </p>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                handleSendOTP();
                            }}
                            disabled={cooldown > 0}
                            className={`whitespace-nowrap absolute right-0 top-0 text-lg font-semibold transition-all duration-300
                                        ${cooldown > 0
                                    ? "text-muted-foreground cursor-not-allowed"
                                    : "text-blue-700 hover:text-blue-900 cursor-pointer "}
                                        `}
                        >
                            {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Code"}
                        </button>
                    </div>
                </div>}

                {/* userName */}
                {!IsNameDisable && <div className="space-y-2 relative mt-4">
                    <label className="text-sm font-semibold text-muted-foreground ml-1 mb-1 block uppercase tracking-wider">
                        Display Name
                    </label>
                    <div className="flex gap-3">
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                spellCheck={false}
                                placeholder="Your username"
                                {...register("User", { required: "Enter User Name" })}
                                className="w-full h-12 text-white bg-input/10 border border-border focus:border-primary/50 rounded-xl px-4 font-medium text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all outline-none hover:bg-input/20"
                            />
                        </div>
                    </div>

                    <div className="min-h-[20px]">
                        {errors.User && (
                            <p className="text-xs text-destructive ml-2 mt-1 font-medium animate-pulse">
                                {errors.User.message}
                            </p>
                        )}
                    </div>
                </div>}

                {/* OTP Section */}
                {true && <div className="mt-6 space-y-3 relative w-full">
                    <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block uppercase tracking-wider">
                        Verification Code
                    </label>

                    <div className="w-full flex justify-center sm:justify-start">
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
                                    containerClassName="w-full flex justify-between"
                                    className="w-full flex justify-between "
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <InputOTPGroup
                                        className="gap-2 sm:gap-4 flex w-full justify-between input-otp-slot "
                                    >
                                        {[0, 1, 2, 3, 4, 5].map((i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className="flex-1 w-full text-white! h-12 sm:h-14 text-xl sm:text-2xl font-bold bg-input/10 !border !border-border !border-l-border !rounded-xl text-primary focus:!border-primary focus:ring-2 focus:ring-primary/20 transition-all hover:bg-input/20 flex items-center justify-center shrink-0"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />
                    </div>

                    <div className="min-h-[20px] mt-2">
                        {errors.OTP && (
                            <p className="text-xs text-destructive ml-2 font-medium animate-pulse">
                                {errors.OTP.message}
                            </p>
                        )}
                    </div>
                </div>}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative mt-8 overflow-hidden rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3.5 text-lg font-bold transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group">
                    <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <CircleNotch weight="bold" className="animate-spin text-xl" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {ButtonText}
                                <FloppyDisk weight="bold" className="text-xl transform group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </span>
                </button>
            </form>
        </div>

    );
};

export default Forminputs;
