import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { InputField } from "../../../shared/components/InputField";
import { useDispatch } from "react-redux";
import { registerNewUser } from "../../../store/actions";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";

function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ mode: "onTouched" });

    const registerHandler = async (data) => {
        dispatch(registerNewUser(data, toast, reset, navigate, setLoader))
    }

    return (
        /* min-h-screen ensures full viewport height; keep top spacing while removing bottom gap */
       <div className="min-h-[100dvh] w-full flex justify-center items-center relative overflow-hidden bg-[#fffcf9] px-4 py-10">
            
            {/* Ambient Background Glows - Adjusted for mobile responsiveness */}
            <div className="absolute top-[-10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-100 rounded-full blur-[80px] md:blur-[120px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-amber-50 rounded-full blur-[80px] md:blur-[100px] opacity-70 pointer-events-none" />

            <form
                onSubmit={handleSubmit(registerHandler)}
                /* p-6 on mobile, p-10 on desktop for better spacing */
                className="relative w-full max-w-[480px] bg-white/90 backdrop-blur-2xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(255,145,0,0.1)] border border-orange-50 transition-all duration-500 hover:border-orange-200 z-10"
            >
                {/* Header Section */}
                <div className="flex flex-col items-center mb-6 md:mb-8">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 mb-4 md:mb-6 rotate-6 hover:rotate-0 transition-transform duration-300">
                        <FaUserPlus className="text-white text-2xl md:text-3xl" />
                    </div>
                    <h1 className="text-slate-900 font-montserrat text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-center">
                        Create Account
                    </h1>
                    <p className="text-slate-500 font-medium text-center text-sm px-4">
                        Join us today! Please fill in your details.
                    </p>
                </div>

                {/* Input Fields Container */}
                <div className="space-y-4 md:space-y-5">
                    <div className="group transition-all duration-300">
                        <InputField label="Username"
                            required
                            id="username"
                            type="text"
                            register={register}
                            message="Username is required"
                            placeholder="johndoe"
                            errors={errors} 
                        />
                    </div>
                    <div className="group transition-all duration-300">
                        <InputField label="Email Address"
                            required
                            id="email"
                            type="email"
                            register={register}
                            message="Email is required"
                            placeholder="name@company.com"
                            errors={errors} 
                        />
                    </div>
                    <div className="group transition-all duration-300">
                        <InputField label="Password"
                            required
                            id="password"
                            type="password"
                            min={6}
                            register={register}
                            message="Password is required"
                            placeholder="********"
                            errors={errors} 
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    disabled={loader}
                    type="submit"
                    className="mt-8 md:mt-10 w-full relative group overflow-hidden rounded-xl md:rounded-2xl bg-slate-900 py-3.5 md:py-4 font-bold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_20px_40px_rgba(234,88,12,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        {loader ? (
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                <span className="tracking-wide text-sm md:text-base">Creating account...</span>
                            </div>
                        ) : (
                            <>
                                <span className="tracking-wide text-base md:text-lg">Register</span>
                                <FaUserPlus className="text-xl group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </div>
                </button>

                {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-orange-50 text-center">
                    <p className="text-slate-500 text-xs md:text-sm font-medium">
                        Already have an account?{" "}
                        <Link 
                            to="/login" 
                            className="text-orange-600 hover:text-orange-700 font-bold transition-all underline-offset-4 hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Register;
