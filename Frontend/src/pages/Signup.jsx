import React, { useState } from "react";
import { Await, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    password: "",
  });

  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");

  const updateDateOfBirth = (day, month, year) => {
    if (day && month && year) {
      const dob = `${year}-${month}-${day.padStart(2, "0")}`;

      setFormData((prev) => ({
        ...prev,
        dateOfBirth: dob,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!name) {
      console.warn("Skipping change, no name:", e.target);
      return;
    }

    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(
        `http://localhost:9000/api/v1/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
    }
  };
  return (
    <div className="h-screen flex flex-col gap-7 items-center justify-center py-10">
      <h1 className="text-blue-600 text-6xl font-bold text-center">
        facebook{" "}
      </h1>
      <div className="bg-white dark:bg-[#262829] p-3 rounded-lg shadow-md w-full md:max-w-[450px] mx-q md:mx-o">
        <h2 className="text-2xl font-bold text-grey-800 dark:text-gray-100 text-center mb-1">
          Create a new account
        </h2>
        <p className="text-gray-600 dark:text-gray-200 mb-4 text-center">
          It's quick and easy.
        </p>
        <hr className="mb-4 text-gray-200" />
        <form
          onSubmit={handleSubmit}
          className="space-y-2 flex-col items-center"
        >
          <div className="flex gap-3 md:w-full">
            <input
              type="text"
              placeholder="First Name"
              className="flex-1 p-2 border border-gray-300 rounded w-[180px]"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="flex-1 p-2 border border-gray-300 rounded w-[180px]"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
          {/* Date of Birth */}
          <div className="w-full">
            <label className="text-sm text-grey-700 dark:text-gray-200">
              Date of Birth
            </label>
            <div className="flex gap-2 mt-1">
              <select
                value={dobDay}
                onChange={(e) => {
                  setDobDay(e.target.value);
                  updateDateOfBirth(e.target.value, dobMonth, dobYear);
                }}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Day</option>
                {[...Array(31)].map((_, index) => (
                  <option key={index} value={String(index + 1)}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <select
                value={dobMonth}
                onChange={(e) => {
                  setDobMonth(e.target.value);
                  updateDateOfBirth(dobDay, e.target.value, dobYear);
                }}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <select
                value={dobYear}
                onChange={(e) => {
                  setDobYear(e.target.value);
                  updateDateOfBirth(dobDay, dobMonth, e.target.value);
                }}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="">Year</option>
                {[...Array(100)].map((_, index) => (
                  <option key={index} value={new Date().getFullYear() - index}>
                    {new Date().getFullYear() - index}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Gender */}
          <div className="w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Gender
            </label>

            <div className="flex gap-3 mt-1">
              {["Male", "Female", "Other"].map((gender) => (
                <label key={gender} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleChange}
                  />
                  <span className="text-sm">{gender}</span>
                </label>
              ))}
            </div>
          </div>
          <input
            type="text"
            placeholder="Mobile number or Email address"
            className="w-full p-2 border border-gray-300 rounded"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full p-2 border border-gray-300 rounded"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <p className="text-xs text-gray-600 dark:text-gray-200">
            By signing up, you agree to our Terms and Privacy Policy.{" "}
            <a
              href="/terms"
              className="text-blue-800 dark:text-blue-500 hover:underline"
            >
              Learn more
            </a>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-200 mt-1">
            By clicking Sign Up, you agree to our{" "}
            <a
              href="/terms"
              className="text-blue-800 dark:text-blue-500 hover:underline"
            >
              Terms
            </a>{" "}
            <a
              href="/privacy"
              className="text-blue-800 dark:text-blue-500 hover:underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-blue-800 dark:text-blue-500 hover:underline"
            >
              Cookie Policy
            </a>
            You may receive SMS notifications from us and can opt out at any
            time.
          </p>

          <button className="w-full bg-green-600 text-white p-2 rounded font-semibold text-align-center hover:bg-green-700 transition-colors">
            Sign Up
          </button>
          <Link to={"/login"}>
            <p className="text-blue-600 hover:text-blue-700 text-lg my-2 text-center">
              Already have an account? Log in
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
