import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, EnvelopeSimple, Check, ArrowLeft, WarningCircle, PaperPlaneRight, ArrowsClockwise, Key } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../Editor/utils/showToast.js';
import { useSelector, useDispatch } from 'react-redux';
import userAuthService from '../../../AppWrite/auth.js';
import { updateusername } from '@/redux/Authantication/UserAuthanticationSlice.js';

function EditProfile() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // dispatch methods
    const dispatch = useDispatch();

    //GET USER EMAIL AND NAME
    const { name, email } = useSelector((state) => state.UserAuthantication.UserData?.userdetaild || {});
    // link states
    const [linkSent, setlinkSent] = useState(false);
    const [isSendinglink, setIsSendinglink] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            username: name || "",
            email: email || "",
        }
    });

    const emailValue = watch('email');
    const isEmailChanged = emailValue !== email;

    // Auto-hide link section if email changes back to default
    useEffect(() => {
        if (!isEmailChanged) {
            setlinkSent(false);
        }
    }, [isEmailChanged]);

    // const handleSendlink = async (e) => {
    //     e.preventDefault();

    //     // Don't send if there's an email form error
    //     if (errors.email || !emailValue) return;


    //     try {
    //         setIsSendinglink(true);
    //         await userAuthService.sendEmailVerification().then(() => {
    //             setlinkSent(true);
    //             showToast("success", "Verification Link Send To You Email Address");
    //         }).catch((err) => {
    //             console.error("Appwrite service :: sendEmailVerification :: error", err);
    //         })
    //         setIsSendinglink(false);

    //     } catch (error) {
    //         showToast("error", "Something went wrong");
    //         setIsSendinglink(false);
    //     }

    // };

    const onSubmit = async (data) => {

        if (!data) return;

        try {
            setIsSubmitting(true);
            await userAuthService.UpdateUserName(data.username).then((res) => {
                showToast("success", "Profile Updated Successfully");
                dispatch(updateusername(res))
            })
        } catch (error) {
            showToast("error", "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
        // Return to settings after brief delay
        setTimeout(() => {
            navigate(-1);
        }, 2000);
    };

    return (
        <section className="relative overflow-hidden group bg-card/80 backdrop-blur-2xl border border-border rounded-3xl p-6 sm:p-10 transition-all duration-500 hover:border-primary/50 shadow-sm w-full max-w-4xl mx-auto my-8">
            {/* Background Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[80px] opacity-50 pointer-events-none group-hover:bg-primary/20 group-hover:scale-150 transition-all duration-700"></div>

            <div className="relative z-10 flex flex-col gap-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-input/10 hover:bg-input/20 border border-border text-muted-foreground hover:text-foreground text-sm font-medium transition-all mb-4 cursor-pointer"
                        >
                            <ArrowLeft size={16} weight="bold" />
                            Back
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-wide">Edit Profile</h2>
                        <p className="text-lg text-muted-foreground mt-2 leading-relaxed">Update your username and email address.</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="relative bg-background/40 border border-border rounded-2xl p-6 sm:p-8 shadow-inner overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">

                        {/* Username Field */}
                        <div className="group/field">
                            <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block uppercase tracking-wider flex items-center gap-2">
                                <User size={16} weight="bold" />
                                Username
                            </label>
                            <div className={`relative w-full h-14 bg-input/5 border rounded-xl px-4 flex items-center transition-all ${errors.username ? 'border-red-500/50 focus-within:border-red-500' : 'border-border/50 focus-within:border-primary group-hover/field:bg-input/10 group-hover/field:border-border'}`}>
                                <input
                                    type="text"
                                    className="w-full h-full bg-transparent border-none outline-none text-foreground text-lg placeholder:text-muted-foreground/50 font-medium"
                                    placeholder="Enter your username"
                                    {...register('username', {
                                        required: 'Username is required',
                                        minLength: { value: 3, message: 'Must be at least 3 characters' }
                                    })}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1 font-medium">
                                    <WarningCircle size={14} weight="fill" />
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Email Field with Verify Option */}
                        <div className="group/field relative">
                            <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block uppercase tracking-wider flex items-center gap-2">
                                <EnvelopeSimple size={16} weight="bold" />
                                Email Address
                            </label>
                            <div className={`relative w-full h-14 bg-input/5 border rounded-xl px-4 flex items-center transition-all ${errors.email ? 'border-red-500/50 focus-within:border-red-500' : 'border-border/50 focus-within:border-primary group-hover/field:bg-input/10 group-hover/field:border-border'}`}>
                                <input
                                    type="email"
                                    className="w-full h-full bg-transparent border-none outline-none text-foreground text-lg placeholder:text-muted-foreground/50 font-medium"
                                    placeholder="Enter Your Email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        disabled: true,
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid Email Address'
                                        }
                                    })}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-1.5 h-6">
                                <div className="ml-1">
                                    {errors.email && (
                                        <p className="text-red-500 text-xs flex items-center gap-1 font-medium">
                                            <WarningCircle size={14} weight="fill" />
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Send / Resend link Button */}
                                {isEmailChanged && !errors.email && (
                                    <button
                                        type="button"
                                        onClick={handleSendlink}
                                        disabled={isSendinglink}
                                        className="text-primary text-sm font-bold flex items-center gap-1.5 hover:text-primary/80 transition-colors disabled:opacity-50 px-2 py-1 mt-2  rounded-md hover:bg-primary/10 cursor-pointer"
                                    >
                                        {isSendinglink ? (
                                            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin">
                                            </div>
                                        ) : linkSent ? (
                                            <ArrowsClockwise size={14} weight="bold" />
                                        ) : (
                                            <PaperPlaneRight size={14} weight="bold" />
                                        )}
                                        {linkSent ? 'Resend Verification Link' : 'Verify Email'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={!isValid || isSubmitting || (isEmailChanged && !linkSent)}
                                className="w-full sm:w-auto min-w-[200px] relative overflow-hidden rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3.5 text-lg font-bold transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 flex justify-center items-center gap-3 group ml-auto cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span className="relative z-10 flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="relative z-10 flex items-center gap-2">
                                        Save Changes
                                        <Check weight="bold" className="text-xl transform group-hover:scale-110 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default EditProfile;
