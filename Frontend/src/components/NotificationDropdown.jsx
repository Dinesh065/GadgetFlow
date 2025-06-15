import { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-black transition text-lg"
      >
        <FaBell className="text-xl" />
        Notifications
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 text-sm text-gray-700 border-b">You have 3 new notifications</div>
          <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
            <li className="p-4 hover:bg-gray-100 cursor-pointer">📦 Your order has been accepted</li>
            <li className="p-4 hover:bg-gray-100 cursor-pointer">🔧 New item available near you</li>
            <li className="p-4 hover:bg-gray-100 cursor-pointer">💬 New message from seller</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
