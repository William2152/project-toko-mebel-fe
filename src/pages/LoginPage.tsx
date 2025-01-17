import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/storeRedux";
import { setItem } from "../../app/localStorageSlice";
import { CredentialsLogin } from "../interface";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState(false);
  const schema = Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "Username is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<CredentialsLogin>({
    resolver: joiResolver(schema),
  });

  async function loginUser(credentials: CredentialsLogin) {
    try {
      const response = await axios.post("http://localhost:6347/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      if (response.data.accessToken != null) {
        dispatch(setItem({ key: "token", value: response.data.accessToken, ttl: 3600000 }));
        localStorage.setItem("role", response.data.role);
        navigate("/dashboard");
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 401) {
          setError("valid", {
            type: "manual",
            message: "Username atau Password Salah"
          });
        }
      }
    }
  }

  const onSubmit = (data: CredentialsLogin) => {
    console.log(data);
    loginUser(data);
  };

  return (
    <div className="flex min-h-screen bg-[#bcaaa4] justify-center items-center">
      <div className="flex w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Left Section */}
        <div className="flex flex-1 justify-center items-center p-8 bg-[#d7ccc8]">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
            alt="Company Visual"
            className="rounded-lg shadow-lg w-full max-w-[230px] md:max-w-[300px]"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#5d4037]">Welcome Back</h2>
            <p className="text-gray-700 text-sm mt-2">
              Please enter your credentials to continue.
            </p>
          </div>
          {errors.valid && (
            <p className="text-white text-center text-sm mt-1 bg-red-500 py-2 rounded-lg">
              {String(errors.valid.message)}
            </p>
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                {...register("username")}
                id="username"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d4037] focus:border-[#5d4037] transition duration-300"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{String(errors.username.message)}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                id="password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d4037] focus:border-[#5d4037] transition duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center mt-7 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.843 3.173-3.26 5.82-6.318 6.72-2.268.7-4.867.215-6.924-1.22"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825c4.875-2.625 6.938-6.15 6.938-9.075 0-3.825-5.1-9-10.313-9C5.1 0.75 0 5.925 0 9.75c0 2.775 2.4 6.15 6.938 8.325"
                    />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#5d4037] text-white py-3 rounded-lg hover:bg-[#4e342e] focus:outline-none focus:ring-2 focus:ring-[#5d4037] transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Forgot your password?{' '}
              <span className="text-[#5d4037] font-semibold hover:underline cursor-pointer">
                Reset Password
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
