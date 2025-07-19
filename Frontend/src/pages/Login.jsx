// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../config";

// const Login = ({ setUserRole }) => {
//   const navigate = useNavigate();
//   const [data, setData] = useState({ email: "", password: "" });
//   const [role, setRole] = useState("buyer");
//   const [error, setError] = useState("");

//   const handleChange = ({ currentTarget: input }) => {
//     setData({ ...data, [input.name]: input.value });
//   };

//   const handleSubmit = async (event) => {
//   event.preventDefault();
//   setError("");

//   try {
//     const url = `${API_BASE_URL}/users/login`;
//     const response = await axios.post(url, { ...data, role },{ withCredentials: false });
//     const { token, role: userRole, ownerId } = response.data;

//     localStorage.setItem("token", token);
//     localStorage.setItem("ownerId", ownerId);
//     localStorage.setItem("userRole", userRole); // Use value returned by backend

//     setUserRole(userRole); // Update role state in app

//     navigate(userRole === "buyer" ? "/buyer-dashboard" : "/seller-dashboard");

//   } catch (error) {
//     if (error.response) {
//       setError(error.response.data.message); // Will catch "Role mismatch!" from backend if any
//     } else {
//       setError("Something went wrong. Please try again later.");
//     }
//   }
// };


//   return (
//     <div className="bg-gradient-to-br from-blue-500 to-indigo-700 min-h-screen flex items-center justify-center p-4">
//       <div className="flex flex-col md:flex-row bg-white bg-opacity-20 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden w-full max-w-3xl">

//         {/* Left Section - Login Form */}
//         <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-opacity-80 bg-gray-900">
//           <h1 className="text-3xl font-bold text-white mb-4">Welcome Back!</h1>
//           <p className="text-gray-300 text-sm mb-6">Login to continue renting gadgets.</p>

//           <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
//             <input
//               type="email"
//               placeholder="Email"
//               name="email"
//               onChange={handleChange}
//               value={data.email}
//               className="px-4 py-3 rounded-xl w-full bg-gray-700 text-white"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               name="password"
//               onChange={handleChange}
//               value={data.password}
//               className="px-4 py-3 rounded-xl w-full bg-gray-700 text-white"
//               required
//             />

//             {/* Role Selection */}
//             <select
//               className="px-4 py-2 rounded-xl w-full bg-gray-700 text-white"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="buyer">Buyer</option>
//               <option value="seller">Seller</option>
//             </select>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-600 transition duration-300">
//               Login
//             </button>
//           </form>

//           <Link to="/forgot-password" className="text-sm text-blue-400 mt-4 hover:underline">Forgot Password?</Link>
//         </div>

//         {/* Right Section - Signup Call-to-Action */}
//         <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-gradient-to-br from-green-400 to-green-600">
//           <h1 className="text-3xl font-bold text-white mb-4">New Here?</h1>
//           <p className="text-gray-100 text-sm text-center mb-6">Sign up and start renting gadgets with ease.</p>
//           <Link to="/signup" className="border-2 border-white px-6 py-3 rounded-xl text-xl text-white bg-transparent hover:bg-white hover:text-green-600 transition-all duration-300">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

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
    setError("");

    try {
      const url = `${API_BASE_URL}/users/login`;
      const response = await axios.post(url, { ...data, role });
      const { token, role: userRole, ownerId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("ownerId", ownerId);
      localStorage.setItem("userRole", userRole);
      setUserRole(userRole);

      navigate(userRole === "buyer" ? "/buyer-dashboard" : "/seller-dashboard");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-12">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 bg-white text-xl font-bold text-green-700 px-4 py-2 rounded-full shadow hover:bg-green-600 hover:text-white transition-all"
      >
        Home
      </button>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left - Login */}
        <div className="bg-white p-10 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-green-700">Welcome Back!</h2>
            <p className="text-gray-600 text-sm mt-2">Login to continue renting gadgets.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Login
            </Button>
          </form>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Right - CTA to Signup */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-10 flex flex-col items-center justify-center space-y-6">
          <h2 className="text-3xl font-bold">New Here?</h2>
          <p className="text-center text-sm">Sign up and start renting gadgets with ease.</p>
          <Link
            to="/signup"
            className="text-green-700 bg-white hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
