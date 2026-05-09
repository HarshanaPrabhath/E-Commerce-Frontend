import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { InputField } from "../../../shared/components/InputField";
import toast from "react-hot-toast";
import { useAppData } from "../../../app/context/AppDataContext";

function Login() {
    const navigate = useNavigate();
    const { signIn } = useAppData();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ mode: "onTouched" });

    const loginHandler = async (data) => {
        setLoader(true);
        const result = await signIn(data);
        setLoader(false);
        if (!result?.success) {
          toast.error(result?.message || "Login failed.");
          return;
        }
        reset();
        toast.success("Logged in successfully.");
        navigate("/");
    }

    return (
        /* min-h-screen ensures full height; keep top spacing while removing bottom gap */
        <div className="min-h-[100dvh] w-full flex justify-center items-center relative overflow-hidden bg-[#fffcf9] px-4 py-10">
            
            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-100 rounded-full blur-[80px] md:blur-[120px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-amber-50 rounded-full blur-[80px] md:blur-[100px] opacity-70 pointer-events-none" />

            <form
                onSubmit={handleSubmit(loginHandler)}
                /* Added max-h-fit and w-full for mobile responsiveness */
                className="relative w-full max-w-[450px] bg-white/90 backdrop-blur-2xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(255,145,0,0.1)] border border-orange-50 transition-all duration-500 hover:border-orange-200 z-10"
            >
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 md:mb-10">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 mb-4 md:mb-6 transform -rotate-6">
                        <AiOutlineLogin className="text-white text-2xl md:text-3xl" />
                    </div>
                    <h1 className="text-slate-900 font-montserrat text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-center">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 font-medium text-center text-sm px-2">
                        Great to see you again! Please enter your details.
                    </p>
                </div>

                {/* Input Section */}
                <div className="space-y-4 md:space-y-5">
                    <div className="group">
                        <InputField 
                            label="Email Address"
                            required
                            id="email"
                            type="email"
                            register={register}
                            message="Email is required"
                            placeholder="hello@example.com"
                            errors={errors} 
                        />
                    </div>
                    <div className="group">
                        <InputField 
                            label="Password"
                            required
                            id="password"
                            type="password"
                            register={register}
                            message="Password is required"
                            placeholder="********"
                            errors={errors} 
                        />
                        <div className="flex justify-end mt-2">
                            <button type="button" className="text-[10px] md:text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-wider">
                                Forgot password?
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    disabled={loader}
                    type="submit"
                    className="mt-8 md:mt-10 w-full relative group overflow-hidden rounded-xl md:rounded-2xl bg-slate-900 py-3.5 md:py-4 font-bold text-white transition-all duration-300 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        {loader ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                <span className="tracking-wide text-sm md:text-base">Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span className="tracking-wide text-sm md:text-base">Sign In</span>
                                <AiOutlineLogin className="text-xl group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </button>

                {/* Footer Section */}
                <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-orange-50 text-center">
                    <p className="text-slate-500 text-xs md:text-sm font-medium">
                        Don't have an account?{" "}
                        <Link 
                            to="/register" 
                            className="text-orange-600 hover:text-orange-700 font-bold transition-all underline-offset-4 hover:underline"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Login;
