import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { InputField } from './../shared/InputField';
import { useDispatch } from 'react-redux';
import { authenticateSignInUser } from "../../store/actions";
import toast from "react-hot-toast";

function Login() {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader,setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState:{errors}
    } = useForm({mode : "onTouched"});

    const loginHandler = async (data) => {
        console.log("Login Click", data);
        dispatch(authenticateSignInUser(data,toast,reset,navigate,setLoader))
    }

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
      <form
      onSubmit={handleSubmit(loginHandler)}
      className="sm:w-[450px] w-[360px] py-8 sm:px-8 px-4 mt-4 rounded-md border-2 border-slate-300 "
      >
        <div className="flex flex-col items-center justify-center space-y-4">
            <AiOutlineLogin className="text-slate-800 text-5xl"/>
            <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">
                Login here
            </h1>
        </div>
        <hr className="mt-2 mb-5 text-slate-300"/>
        <div className="flex flex-col gap-3">
            <InputField label="Email"
            required
            id="email"
            type="text"
            register={register}
            message="email is required"
            placeholder="Enter your email"
            errors={errors} 
            />
             <InputField label="Password"
            required
            id="password"
            type="password"
            register={register}
            message="Password is required"
            placeholder="Enter your password"
            errors={errors} 
            />
        </div>

        <button
        disabled={loader}
        type="submit"
        className=" bg-teal-800 gap-2 text-white px-5 py-2 rounded-sm items-center justify-center font-semibold w-full hover:bg-teal-700 my-4">
            {loader ? (
                <>Loading...</>
            ):(
               <> Login</>
            )}

            </button>
            <p className="text-center text-sm text-teal-700 mt-2">
                Don't have and account?
                            <Link to="/register">
                <span className="mx-2 font-semibold hover:text-teal-900">SignUp</span>
                </Link>
            </p>
      </form>
    </div>
  )
}

export default Login
