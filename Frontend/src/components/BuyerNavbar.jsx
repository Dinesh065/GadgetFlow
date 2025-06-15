import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaUser, FaShoppingCart, FaBell, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white fixed top-0 left-0 h-20 px-6 lg:px-12 flex items-center justify-between z-50 w-full">

      {/* Left Section - Logo & Toggle Button */}
      <div className="flex items-center gap-12">
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-2xl text-gray-700">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/buyer-dashboard" className="text-green-700 font-bold text-2xl flex items-center">
          <span className="mr-2 text-3xl">🛒</span> GadgetFlow
        </Link>
      </div>

      {/* Right Section - Account & Cart (Hidden on Mobile) */}
      <div className="hidden lg:flex items-center gap-8">
          <Link to="/buyer-dashboard" className="flex items-center gap-2 text-gray-700 hover:text-black transition text-lg">
            <FaHome className="text-xl" /> Browse Items
          </Link>
          <Link to="/orders" className="flex items-center gap-2 text-base text-gray-700 hover:text-black transition">
          <FaShoppingBag className="text-xl" /> Orders
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-gray-700 hover:text-black transition text-lg">
            <FaShoppingCart className="text-xl" /> Cart
          </Link>
        <div className="text-base text-gray-700 hover:text-black transition flex items-center gap-2">
         <NotificationDropdown />
        </div>
        <Link to="/account" className="flex items-center gap-2 text-gray-700 hover:text-black transition text-lg">
          <FaUser className="text-xl" /> Account
        </Link>
      </div>

      {/* Mobile Menu (Visible when isOpen is true) */}
      <div className={`lg:hidden fixed top-20 left-0 w-full bg-white shadow-md transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"} p-6`}>
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2">
            <FaHome className="text-xl" /> Browse Items
          </Link>
          <Link to="/orders" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2">
            <FaShoppingBag className="text-xl" /> Orders
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2">
            <FaShoppingCart className="text-xl" /> Cart
          </Link>
          <div className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2">
            <NotificationDropdown />
          </div>
          <Link to="/account" className="text-gray-700 hover:text-black transition text-lg flex items-center gap-2">
            <FaUser className="text-xl" /> Account
          </Link>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
