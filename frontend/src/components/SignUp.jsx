import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { toast } from "react-toastify";
const SignUp = () => {
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!formData.name.trim()) {
      return toast.error("Name is required");
    }

    if (!emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email");
    }

    if (!passwordRegex.test(formData.password)) {
      return toast.error(
        "Password must be at least 8 characters and contain uppercase, lowercase, number and special character",
      );
    }

    try {
      const res = await axios.post(`${serverUrl}/api/register`, formData, {
        withCredentials: true,
      });
      dispatch(setUserData(res.data));
      toast.success("Registration Successful!", {
        className: "!mt-16 !bg-orange-50 !text-orange-600",
        progressClassName: "!bg-orange-500",
      });
      navigate("/signin");
    } catch (err) {
      console.error("Error during registration:", err);
      toast.error("Registration Failed!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 w-full"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md
        border`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className={`text-3xl font-semibold mb-2 text-orange-500`}>
          SpiceSprint
        </h1>
        <p>
          {" "}
          Create your account to get started with our delicious food
          deliveries!{" "}
        </p>

        <form className="mt-6 flex flex-col gap-4">
          {/* Name */}
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-1"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className="w-full border rounded-lg px-3 py-2
                focus:border-orange-400"
              placeholder="Enter Your Full Name"
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full border rounded-lg px-3 py-2
                focus:border-orange-400"
              placeholder="Enter Your Email"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={formData.password}
                className="w-full border rounded-lg px-3 py-2
                       focus:border-orange-400"
                placeholder="Enter Your Password"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* mobile */}
          <div className="mb-2">
            <label
              htmlFor="mobile"
              className="block text-gray-700 font-semibold mb-1"
            >
              Mobile
            </label>
            <input
              type="number"
              name="mobile"
              onChange={handleChange}
              value={formData.mobile}
              className="w-full border rounded-lg px-3 py-2
                focus:border-orange-400"
              placeholder="Enter Your Mobile Number"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="text-white bg-orange-500 rounded-xl shadow-lg w-full px-3 py-2 mb-1
                hover:bg-orange-400 hover:text-gray-200 cursor-pointer hover:underline"
          >
            SignUp Now
          </button>

          {/* will be implemented in future updates */}
          {/* <button className='w-full mt-4 flex items-center justify-center
                gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-200 hover:bg-gray-200 cursor-pointer'>
                    <FcGoogle size={20}/>
                <span>Sign up with Google</span>
                </button> */}
          <p
            className="text-center mt-2 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Already have an account ?{" "}
            <span className="text-[#ff4d2d]">Sign In</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
