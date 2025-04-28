import { Link, Navigate } from "react-router-dom";
import Layout from "../../Components/Client/Layout/Layout";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { authstatus, checkUserAsync, selectError, selectLoggedInUser } from "../../Features/Authslice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchLoggedInUserAsync, selectUserInfo } from "../../Features/Userslice";
import ScrollTop from "../../Components/Client/Common/Scolltop";

export default function Loginpage() {
    const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const user = useSelector(selectLoggedInUser);
  const status = useSelector(authstatus)

  const onSubmit = (data) => {
    dispatch(
      checkUserAsync({
        email: data.email,
        password: data.password,
      })
    );
  };

  console.log(error);

    if (user) {
      if (user.role === 'admin') {
        return <Navigate to="/Adminhomepage" />;
      } else {
        return <Navigate to="/" />;
      }
    }


  return (
    <Layout>
      <ScrollTop/>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8 bg-[#fbfff9] mt-20 mb-10">
      <div className="border border-gray-200 shadow-lg sm:mx-auto sm:w-full sm:max-w-sm px-6 py-4 rounded-2xl">

          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <UserCircleIcon className="w-10 h-10 mx-auto" />
            <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Sign in
            </h2>
          </div>
        
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.email && (
                    <span className="text-rose-600 text-sm">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <Link to="/Forgotpasswordpage" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>
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
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm pr-10"
                  />
                  <div
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {errors.password && (
                    <span className="text-rose-600 text-sm">{errors.password.message}</span>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                 {status === 'loading' ? 'Loading...' : 'Sign in'}
                </button>
              </div>
            </form>

            {error && <div className="text-center text-rose-600 mt-4">{error}</div>}

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Don’t have an account?{' '}
              <Link to="/Signuppage">
                <span className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Create an account
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
