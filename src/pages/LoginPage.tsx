import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
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
  } = useForm({
    resolver: joiResolver(schema),
  });

  async function loginUser(credentials) {
    try {
      const response = await axios.post("http://localhost:6347/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });
      console.log(response.data);

      console.log(response.data.accessToken);
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = (data) => {
    // navigate("/dashboard");
    console.log(data);
    loginUser(data);
  };

  return (
    <div className="bg-[#bcaaa4] h-screen w-screen flex items-center justify-center">
      <div className="bg-[#E7E7E7] p-8 rounded-lg flex flex-col items-center">
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            {...register("username")}
            id="username"
            className="mb-4 p-2 border-b border-gray-300 outline-none bg-transparent"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            {...register("password")}
            id="password"
            className="mb-4 p-2 border-b border-gray-300 outline-none bg-transparent"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="bg-[#65558f] text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
