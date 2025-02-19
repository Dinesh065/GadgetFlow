import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, ShoppingCart, Heart, Package, Bell, LogOut } from "lucide-react"; // Using Lucide icons

const BuyerNavbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="mx-auto flex justify-between items-center p-4 relative">
        
        {/* Logo & Brand Name */}
        <div className="flex items-center space-x-2">
          <img src="/images/Logo.png" alt="GadgetFlow Logo" className="h-10 w-auto" />
          <h1 className="text-white text-2xl font-bold">GadgetFlow</h1>
        </div>

        {/* Desktop Navbar Links */}
        <div className="hidden md:flex space-x-6">
          <NavItem to="/buyer-dashboard" icon={<Home size={20} />} text="Dashboard" />
          <NavItem to="/cart" icon={<ShoppingCart size={20} />} text="Cart & Checkout" />
          <NavItem to="/wishlist" icon={<Heart size={20} />} text="Wishlist" />
          <NavItem to="/orders" icon={<Package size={20} />} text="Order History" />
          <NavItem to="/notifications" icon={<Bell size={20} />} text="Notifications" />
        </div>

        {/* Logout Button for Desktop View */}
        <div className="hidden md:block">
          <button 
            onClick={onLogout} // ✅ Logout works now
            className="border-2 border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-blue-600 transition duration-300 flex items-center space-x-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Hamburger Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-blue-500 space-y-4 p-4">
          <NavItem to="/buyer-dashboard" icon={<Home size={20} />} text="Dashboard" mobile />
          <NavItem to="/cart" icon={<ShoppingCart size={20} />} text="Cart & Checkout" mobile />
          <NavItem to="/wishlist" icon={<Heart size={20} />} text="Wishlist" mobile />
          <NavItem to="/orders" icon={<Package size={20} />} text="Order History" mobile />
          <NavItem to="/notifications" icon={<Bell size={20} />} text="Notifications" mobile />
          
          {/* Logout Button for Mobile View */}
          <button 
            onClick={onLogout} // ✅ Logout works for mobile too
            className="border-2 border-white px-4 py-2 rounded-lg text-white hover:bg-white hover:text-blue-600 transition duration-300 flex items-center space-x-2"
          >
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

export default BuyerNavbar;
