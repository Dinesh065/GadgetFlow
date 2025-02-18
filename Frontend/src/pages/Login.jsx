import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("buyer");  
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value }); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const storedSignupRole = localStorage.getItem("signupRole");
    if (storedSignupRole !== role) {
      setError("Role mismatch! You must log in with the same role you signed up with.");
      return;
    }

    try {
      const url = "http://localhost:8000/api/v1/users/login"; 
      const response = await axios.post(url, { ...data, role }, { withCredentials: false });

      localStorage.setItem("token", response.data.data);  
      localStorage.setItem("userRole", role);  
      setUserRole(role);

      navigate(role === "buyer" ? "/buyer-dashboard" : "/seller-dashboard");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        console.error("Error message:", error.response.data.message);
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-700 min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-white bg-opacity-20 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden w-full max-w-3xl">
        
        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-opacity-80 bg-gray-900">
          <h1 className="text-3xl font-bold text-white mb-4">Welcome Back!</h1>
          <p className="text-gray-300 text-sm mb-6">Login to continue renting gadgets.</p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
            <input 
              type="email" 
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email} 
              className="px-4 py-3 rounded-xl w-full bg-gray-700 text-white" 
              required 
            />
            <input 
              type="password" 
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}  
              className="px-4 py-3 rounded-xl w-full bg-gray-700 text-white" 
              required 
            />
            
            {/* Role Selection */}
            <select 
              className="px-4 py-2 rounded-xl w-full bg-gray-700 text-white" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-600 transition duration-300">
              Login
            </button>
          </form>

          <Link to="/forgot-password" className="text-sm text-blue-400 mt-4 hover:underline">Forgot Password?</Link>
        </div>

        {/* Right Section - Signup Call-to-Action */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-gradient-to-br from-green-400 to-green-600">
          <h1 className="text-3xl font-bold text-white mb-4">New Here?</h1>
          <p className="text-gray-100 text-sm text-center mb-6">Sign up and start renting gadgets with ease.</p>
          <Link to="/signup" className="border-2 border-white px-6 py-3 rounded-xl text-xl text-white bg-transparent hover:bg-white hover:text-green-600 transition-all duration-300">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
