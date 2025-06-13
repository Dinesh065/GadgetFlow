// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Menu, X, Home, List, Bell, MessageSquare, Calendar, LogOut } from "lucide-react"; // Using Lucide icons

// const SellerNavbar = ({ onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false); // State for mobile menu

//   return (
//     <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
//       <div className=" mx-auto flex justify-between items-center p-4 relative">

//         {/* Logo & Brand Name */}
//         <div className="flex items-center space-x-2">
//           <img src="/images/Logo.png" alt="GadgetFlow Logo" className="h-10 w-auto" />
//           <h1 className="text-white text-2xl font-bold">GadgetFlow</h1>
//         </div>

//         {/* Desktop Navbar Links */}
//         <div className="hidden md:flex space-x-6">
//           <NavItem to="/seller-dashboard" icon={<Home size={20} />} text="Dashboard" />
//           <NavItem to="/manage-listings" icon={<List size={20} />} text="Manage Listings" />
//           <NavItem to="/rental-calendar" icon={<Calendar size={20} />} text="Rental Calendar" />
//         </div>

//         {/* Logout Button for Desktop View */}
//         <div className="hidden md:block">
//           <button
//             onClick={onLogout} // ✅ Logout works now
//             className="border-2 border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-orange-600 transition duration-300 flex items-center space-x-2"
//           >
//             <LogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>

//         {/* Hamburger Menu Button */}
//         <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
//           {isOpen ? <X size={30} /> : <Menu size={30} />}
//         </button>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {isOpen && (
//         <div className="md:hidden flex flex-col bg-orange-500 space-y-4 p-4">
//           <NavItem to="/seller-dashboard" icon={<Home size={20} />} text="Dashboard" mobile />
//           <NavItem to="/manage-listings" icon={<List size={20} />} text="Manage Listings" mobile />
//           <NavItem to="/rental-calendar" icon={<Calendar size={20} />} text="Rental Calendar" mobile />

//           {/* Logout Button for Mobile View */}
//           <button
//             onClick={onLogout} // ✅ Logout works for mobile too
//             className="border-2 border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-orange-600 transition duration-300 flex items-center space-x-2"
//           >
//             <LogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };

// /* Reusable Nav Item Component */
// const NavItem = ({ to, icon, text, mobile }) => (
//   <Link
//     to={to}
//     className={`flex items-center space-x-2 text-white hover:text-gray-300 transition-all ${mobile ? "py-2 px-4" : ""}`}
//   >
//     {icon}
//     <span>{text}</span>
//   </Link>
// );

// export default SellerNavbar;
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  List,
  Calendar,
  LogOut,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { API_BASE_URL } from "../config";
import axios from "axios";

const DEFAULT_PROFILE_IMAGE = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

const SellerNavbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/users/fetchProfileData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="mx-auto flex justify-between items-center p-4 relative">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/images/Logo.png" alt="GadgetFlow Logo" className="h-10 w-auto" />
          <h1 className="text-white text-2xl font-bold">GadgetFlow</h1>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6">
          <NavItem to="/seller-dashboard" icon={<Home size={20} />} text="Dashboard" currentPath={location.pathname} />
          <NavItem to="/manage-listings" icon={<List size={20} />} text="Manage Listings" currentPath={location.pathname} />
          <NavItem to="/rental-calendar" icon={<Calendar size={20} />} text="Rental Calendar" currentPath={location.pathname} />
        </div>

        {/* Profile Dropdown */}
        <div className="hidden md:flex flex-col items-end relative group" ref={dropdownRef}>
          <div
            onClick={toggleDropdown}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <img
              src={user?.profileImage || DEFAULT_PROFILE_IMAGE}
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-white text-sm">{user?.fullName || "Seller"}</span>
            <ChevronDown size={16} color="white" />
          </div>

          {/* Underline for dropdown toggle */}
          <div className="h-[2px] w-full mt-1">
            <span
              className={`block h-full bg-orange-500 transition-all duration-300 origin-left 
                ${dropdownOpen ? "w-full" : "w-0 group-hover:w-full"}`}
            />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
              <Link to="/seller-profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-orange-500 space-y-4 p-4">
          <NavItem to="/seller-dashboard" icon={<Home size={20} />} text="Dashboard" mobile />
          <NavItem to="/manage-listings" icon={<List size={20} />} text="Manage Listings" mobile />
          <NavItem to="/rental-calendar" icon={<Calendar size={20} />} text="Rental Calendar" mobile />
          <Link to="/seller-profile" className="flex items-center space-x-2 text-white hover:text-gray-300">
            <UserCircle size={20} />
            <span>Profile</span>
          </Link>
          <button
            onClick={onLogout}
            className="border-2 border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-orange-600 transition duration-300 flex items-center space-x-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

// ✅ Final NavItem component with underline animation
const NavItem = ({ to, icon, text, mobile, currentPath }) => {
  const isActive = currentPath === to;

  return (
    <div className={`relative flex flex-col ${mobile ? '' : 'pb-1'}`}>
      <Link
        to={to}
        className={`group flex items-center space-x-2 text-white transition-all ${mobile ? "py-2 px-4" : "px-2"}`}
      >
        {icon}
        <span>{text}</span>
      </Link>

      {!mobile && (
        <span
          className={`
            absolute -bottom-0.5 left-0 h-[2px] bg-orange-500 transition-all duration-300 ease-in-out
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}
        ></span>
      )}
    </div>
  );
};

export default SellerNavbar;
