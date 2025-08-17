import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form";
import { AiOutlineLogin } from "react-icons/ai";
import { InputField } from './../shared/InputField';
import { useDispatch } from 'react-redux';
import { authenticateSignInUser, registerNewUser } from "../../store/actions";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";

function Register() {
  
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader,setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState:{errors}
    } = useForm({mode : "onTouched"});

    const registerHandler = async (data) => {
        console.log("Register Click", data);
        dispatch(registerNewUser(data,toast,reset,navigate,setLoader))
    }

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center">
      <form
      onSubmit={handleSubmit(registerHandler)}
      className="sm:w-[450px] w-[360px] py-8 sm:px-8 px-4 mt-4 rounded-md border-2 border-slate-300 "
      >
        <div className="flex flex-col items-center justify-center space-y-4">
            <FaUserPlus className="text-slate-800 text-5xl"/>
            <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">
                Register Here
            </h1>
        </div>
        <hr className="mt-2 mb-5 text-slate-300"/>
        <div className="flex flex-col gap-3">
            <InputField label="UserName"
            required
            id="username"
            type="text"
            register={register}
            message="Username is required"
            placeholder="Enter your username"
            errors={errors} 
            />
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
            min={6}
            register={register}
            message="Password is required"
            placeholder="Enter your password "
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
               <> Register </>
            )}

            </button>
            <p className="text-center text-sm text-teal-700 mt-2">
                Already have an account?
                            <Link to="/login">
                <span className="mx-2 font-semibold hover:text-teal-900">Sign In</span>
                </Link>
            </p>
      </form>
    </div>
  )
}

export default Register
