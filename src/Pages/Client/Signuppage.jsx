import { Link, useNavigate } from "react-router-dom";
import Layout from "../../Components/Client/Layout/Layout";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { createuser, createUserAsync, userstatus } from "../../Features/Authslice";
import ScrollTop from "../../Components/Client/Common/Scolltop";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";

export default function Signuppage() {
  const dispatch = useDispatch();
  const status = useSelector(userstatus);
  const user = useSelector(createuser);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
    const bgcolor = useSelector((state) => state.theme.value)
    const txtcolor = useSelector((state) => state.theme.textcolor)
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    dispatch(
      createUserAsync({
        email: data.email,
        password: data.password,
        addresses: [],
        role: 'user',
      })
    );
  };

  useEffect(() => {
    if (user?.response) {
      setIsLoading(false);
      toast.success('Registered successfully! Redirecting to login...', {
        position: "top-right",
        autoClose: 2000,
      });

      const timeout = setTimeout(() => {
        navigate('/Loginpage');
      }, 2000);

      return () => clearTimeout(timeout);
    }

    if (user?.message) {
      setIsLoading(false);
      toast.error(user?.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [user, navigate]);

  return (
    <Layout>
      <ScrollTop />
      <ToastContainer />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-30 lg:px-8" style={{ backgroundColor: bgcolor, color: txtcolor }}>
        <div className="border border-gray-200 shadow-lg sm:mx-auto sm:w-full sm:max-w-sm px-6 py-4 rounded-2xl">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <UserCircleIcon className="w-10 h-10 mx-auto" />
            <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight ">
              Sign up
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email address",
                      },
                    })}
                    name="email"
                    type="email"
                    className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.email && (
                    <span className="text-rose-600 text-sm">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium">
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="block w-full rounded-md px-3 py-1.5 text-base outline-1 outline-gray-300  focus:outline-2 focus:outline-indigo-600 sm:text-sm pr-10"
                  />
                  <div
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 " />
                    ) : (
                      <EyeIcon className="h-5 w-5 " />
                    )}
                  </div>
                  {errors.password && (
                    <span className="text-rose-600 text-sm">{errors.password.message}</span>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="confpassword" className="block text-sm/6 font-medium">
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirmpassword"
                    {...register("confpassword", {
                      required: "Please confirm your password",
                      validate: value =>
                        value === getValues("password") || "Passwords do not match",
                    })}
                    name="confpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="block w-full rounded-md  px-3 py-1.5 text-base outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm pr-10"
                  />
                  <div
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 " />
                    ) : (
                      <EyeIcon className="h-5 w-5 " />
                    )}
                  </div>
                  {errors.confpassword && (
                    <span className="text-rose-600 text-sm">{errors.confpassword.message}</span>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold  shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Sign up'}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 ">
              Already have an account?{' '}
              <Link to="/Loginpage">
                <span className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Sign in
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
