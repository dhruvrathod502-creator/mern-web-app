import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(
        `http://localhost:9000/api/v1/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row md:max-w-5xl gap-10 md:space-y-10 md:space-y-0 md:space-x-10">
        {/* Left Section */}
        <div className="flex-1 flex flex-col justify-center mn-20">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-600 mb-4">
            facebook
          </h1>
          <p className="text-lg text-gray-600">
            Connect with friends and the world around you on Facebook.
          </p>
        </div>
        {/* Right Section */}
        <div>
          <div className="bg-white dark:bg-[#262829] p-6 rounded-lg shadow-md md:w-[450px]">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Email address or Phone number "
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border border-grey-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="p-3 border border-grey-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <button
                type="submit"
                className="
              bg-blue-600 text-white text-xl font-bold py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Log in
              </button>
              <Link className="text-blue-600 dark:text-blue-500 text-sm text-center hover:underline">
                Forgot password
              </Link>
              <hr className="mb-7 mt-2 text-grey-200" />
              <Link to={"/signup"} className="flex items-center">
                <button className="bg-green-500 text-lg text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition w-fit mx-auto px-6">
                  Create new account
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
