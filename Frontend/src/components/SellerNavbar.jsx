import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, List, Bell, MessageSquare, Calendar, LogOut } from "lucide-react"; // Using Lucide icons

const SellerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  return (
    <nav className="bg-orange-600 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4 relative">
        
        {/* Logo & Brand Name */}
        <div className="flex items-center space-x-2">
          <img src="/images/Logo.png" alt="GadgetFlow Logo" className="h-10 w-auto" />
          <h1 className="text-white text-2xl font-bold">GadgetFlow</h1>
        </div>

        {/* Desktop Navbar Links */}
        <div className="hidden md:flex space-x-6">
          <NavItem to="/seller-dashboard" icon={<Home size={20} />} text="Dashboard" />
          <NavItem to="/manage-listings" icon={<List size={20} />} text="Manage Listings" />
          <NavItem to="/notifications" icon={<Bell size={20} />} text="Notifications" />
          <NavItem to="/chat" icon={<MessageSquare size={20} />} text="Customer Chat" />
          <NavItem to="/rental-calendar" icon={<Calendar size={20} />} text="Rental Calendar" />
        </div>

        {/* Logout Button */}
        <button className="hidden md:block border-2 border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-orange-600 transition duration-300 flex items-center space-x-2">
          <LogOut size={20} />
          <span>Logout</span>
        </button>

        {/* Hamburger Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-orange-500 space-y-4 p-4">
          <NavItem to="/seller-dashboard" icon={<Home size={20} />} text="Dashboard" mobile />
          <NavItem to="/manage-listings" icon={<List size={20} />} text="Manage Listings" mobile />
          <NavItem to="/notifications" icon={<Bell size={20} />} text="Notifications" mobile />
          <NavItem to="/chat" icon={<MessageSquare size={20} />} text="Customer Chat" mobile />
          <NavItem to="/rental-calendar" icon={<Calendar size={20} />} text="Rental Calendar" mobile />
          <button className="border-2 border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-orange-600 transition duration-300 flex items-center space-x-2">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

/* Reusable Nav Item Component */
const NavItem = ({ to, icon, text, mobile }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-2 text-white hover:text-gray-300 transition-all ${mobile ? "py-2 px-4" : ""}`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default SellerNavbar;
