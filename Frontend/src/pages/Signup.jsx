//  import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../config";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     role: "buyer",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle signup submission
//   const handleSignup = async (event) => {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const url = `${API_BASE_URL}/users/signup`; // Update with your API
//       const response = await axios.post(url, formData);

//       // Store the role for validation at login
//       localStorage.setItem(`signupRole_${formData.email}`, formData.role);
      
//       setSuccess("Signup successful! Redirecting to login...");
//       console.log("Stored role in localStorage:", localStorage.getItem(`signupRole_${formData.email}`));

//       setTimeout(() => navigate("/login"), 1000); // Redirect after success
//     } catch (error) {
//       if (error.response) {
//         setError(error.response.data.message || "Signup failed. Try again.");
//       } else {
//         setError("Network error. Please check your connection.");
//       }
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-green-500 to-teal-600 min-h-screen flex items-center justify-center p-4">
//       <div className="flex flex-col md:flex-row bg-white bg-opacity-20 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden w-full max-w-3xl">
        
//         {/* Left Section - Signup Form */}
//         <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-opacity-80 bg-gray-900">
//           <h1 className="text-3xl font-bold text-white mb-4">Join Us!</h1>
//           <p className="text-gray-300 text-sm mb-6">Create an account to start renting gadgets.</p>

//           <form onSubmit={handleSignup} className="w-full flex flex-col space-y-4">
//             <input 
//               type="text" 
//               name="fullName"
//               placeholder="Full Name" 
//               value={formData.fullName}
//               onChange={handleChange}
//               className="px-4 py-3 rounded-xl w-full bg-gray-700 text-white" 
//               required 
//             />
//             <input 
//               type="email" 
//               name="email"
//               placeholder="Email" 
//               value={formData.email}
//               onChange={handleChange}
//               className="px-4 py-3 rounded-xl w-full bg-gray-700 text-white" 
//               required 
//             />
//             <input 
//               type="password" 
//               name="password"
//               placeholder="Password" 
//               value={formData.password}
//               onChange={handleChange}
//               className="px-4 py-3 rounded-xl w-full bg-gray-700 text-white" 
//               required 
//             />

//             {/* Role Selection */}
//             <select 
//               name="role"
//               className="px-4 py-2 rounded-xl w-full bg-gray-700 text-white" 
//               value={formData.role} 
//               onChange={handleChange}
//             >
//               <option value="buyer">Buyer</option>
//               <option value="seller">Seller</option>
//             </select>

//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             {success && <p className="text-green-500 text-sm">{success}</p>}

//             <button 
//               type="submit" 
//               className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-600 transition duration-300"
//             >
//               Sign Up
//             </button>
//           </form>
//         </div>

//         {/* Right Section - Already have an account? */}
//         <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-blue-600">
//           <h1 className="text-3xl font-bold text-white mb-4">Already have an account?</h1>
//           <p className="text-gray-100 text-sm text-center mb-6">Login now and continue renting or listing gadgets.</p>
//           <Link 
//             to="/login" 
//             className="border-2 border-white px-6 py-3 rounded-xl text-xl text-white bg-transparent hover:bg-white hover:text-blue-600 transition-all duration-300"
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = `${API_BASE_URL}/users/signup`;
      const response = await axios.post(url, formData);

      localStorage.setItem(`signupRole_${formData.email}`, formData.role);
      setSuccess("Signup successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Signup failed. Try again.");
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-100 px-4 py-12">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 bg-white text-xl font-bold text-blue-700 px-4 py-2 rounded-full shadow hover:bg-blue-600 hover:text-white transition-all"
      >
        Home
      </button>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left - Signup */}
        <div className="bg-white p-10 flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-700">Create Account</h2>
            <p className="text-gray-600 text-sm mt-2">Join us and start your smart rentals.</p>
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="role"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-300"
            >
              Sign Up
            </button>

          </form>
        </div>

        {/* Right - Already have account */}
        <div className="bg-gradient-to-br from-blue-500 to-emerald-600 text-white p-10 flex flex-col items-center justify-center space-y-6">
          <h2 className="text-3xl font-bold">Already a Member?</h2>
          <p className="text-center text-sm">Login now to access your account and explore gadgets.</p>
          <Link
            to="/login"
            className="text-blue-700 bg-white hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition duration-300"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
