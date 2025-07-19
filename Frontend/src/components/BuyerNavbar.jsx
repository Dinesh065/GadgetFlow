import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaHeart,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaBoxOpen,
  FaMoneyBillWave
} from "react-icons/fa";
import { Zap } from "lucide-react";
import { LogOut, ChevronDown } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const DEFAULT_PROFILE_IMAGE = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

const Navbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/users/fetchProfileData`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <nav
      className={`fixed top-0 left-0 h-20 px-6 lg:px-12 flex items-center justify-between z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/50 backdrop-blur-md shadow-md" : "bg-white shadow"
        }`}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-12">

        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-green-500 text-2xl font-bold">GadgetFlow</h1>
        </div>
      </div>

      {/* Right: Links & Profile */}
      <div className="hidden lg:flex items-center gap-8">
        <Link to="/buyer-dashboard" className="flex items-center gap-2 text-gray-700 hover:text-black transition text-lg">
          <FaHome className="text-xl" /> Browse Items
        </Link>
        <Link to="/orders" className="flex items-center gap-2 text-base text-gray-700 hover:text-black transition">
          <FaShoppingBag className="text-xl" /> Orders
        </Link>
        <Link to="/wishlist" className="flex items-center gap-2 text-gray-700 hover:text-black transition text-lg">
          <FaHeart className="text-xl" /> Wishlist
        </Link>
        <Link to="/my-rentals" className="flex items-center gap-2 text-gray-700 hover:text-black transition text-lg">
          <FaBoxOpen className="text-xl" /> My Rentals
        </Link>
        {/* <Link to="/payment-history" className="flex items-center gap-2 text-gray-700 hover:text-black transition text-lg">
          <FaMoneyBillWave className="text-xl" /> Payment History
        </Link> */}

        {/* Profile Dropdown */}
        <div className="relative flex flex-col items-end" ref={dropdownRef}>
          <div onClick={toggleDropdown} className="flex items-center space-x-2 cursor-pointer">
            <img
              src={user?.profileImage || DEFAULT_PROFILE_IMAGE}
              alt="profile"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-700 font-medium">{user?.fullName || "User"}</span>
            <ChevronDown size={16} color="gray" />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
              <Link to="/buyer-account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
      </div>

      {/* Mobile Menu Icon */}
      <div className="lg:hidden ml-auto">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl text-gray-700">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`lg:hidden fixed top-20 left-0 w-full bg-white shadow-md transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"} p-6 z-40`}>
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <FaHome className="text-xl" /> Browse Items
          </Link>
          <Link to="/orders" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <FaShoppingBag className="text-xl" /> Orders
          </Link>
          <Link to="/wishlist" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <FaHeart className="text-xl" /> Wishlist
          </Link>
          <Link to="/my-rentals" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <FaBoxOpen className="text-xl" /> My Rentals
          </Link>
          {/* <Link to="/payment-history" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <FaMoneyBillWave className="text-xl" /> Payment History
          </Link> */}

          {/* Divider */}
          <hr className="my-2" />

          {/* Profile and Logout */}
          <Link to="/buyer-account" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <img
              src={user?.profileImage || DEFAULT_PROFILE_IMAGE}
              alt="profile"
              className="h-6 w-6 rounded-full object-cover"
            />
            Profile
          </Link>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="text-red-600 hover:text-red-800 transition text-lg flex items-center gap-2"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
