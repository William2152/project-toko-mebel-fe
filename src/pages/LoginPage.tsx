import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../app/storeRedux";
import { setItem } from "../../app/localStorageSlice";
import { useEffect } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
  } = useForm({
    resolver: joiResolver(schema),
  });

  async function loginUser(credentials) {
    try {
      const response = await axios.post("http://localhost:6347/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      if (response.data.accessToken != null) {
        dispatch(setItem({ key: "token", value: response.data.accessToken, ttl: 3600000 }));
        localStorage.setItem("role", response.data.role);
        navigate("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 401) {
          setError("valid", {
            type: "manual",
            message: "Usename atau Password Salah"
          }
          )
        }
      }
    }
  }

  const onSubmit = (data) => {
    console.log(data);
    loginUser(data);
  };
  //bg-gradient-to-r from-[#5a67d8] via-[#4c51bf] to-[#2b6cb0]
  return (
    <div className="flex min-h-screen bg-[#bcaaa4] justify-center items-center">
      <div className="flex w-full max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg">
        {/* Left Section */}
        <div className="flex flex-1 justify-center items-center md:p-6 space-x-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5TZn5gGOAn3J9Wv9yTaLzAuCf15S7HrBPg&s"
            alt="Company Visual"
            className="rounded-lg shadow-xl w-full max-w-[230px] md:max-w-[300px]"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-[#2b6cb0]">Welcome Back</h2>
            <p className="text-gray-600 text-sm mt-2">
              Please enter your credentials to continue.
            </p>
          </div>
          {errors.valid && (
            <p className="text-white text-center text-sm mt-1 bg-red-300 py-2">{String(errors.valid.message)}</p>
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
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a67d8] transition duration-200"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{String(errors.username.message)}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                id="password"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a67d8] transition duration-200"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#5a67d8] text-white py-3 rounded-lg hover:bg-[#4c51bf] focus:outline-none transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Forgot your password?{" "}
              <span className="text-[#5a67d8] font-semibold hover:underline cursor-pointer">
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
