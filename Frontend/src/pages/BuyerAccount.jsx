import { FaUser, FaShoppingBag, FaHeart, FaBell, FaCreditCard, FaQuestionCircle, FaBars, FaTimes, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BuyerProfilePage from "../components/BuyerProfilePage";

const BuyerAccount = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "John Doe", email: "john@example.com", phone: "+1234567890" });
  const [wishlist, setWishlist] = useState(["Laptop", "Gaming Console", "Smartwatch"]);

  const location = useLocation();
  const sectionFromNav = location.state?.section;

  useEffect(() => {
    if (sectionFromNav) {
      setActiveSection(sectionFromNav);
    }
  }, [sectionFromNav]);


  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const removeWishlistItem = (item) => setWishlist(wishlist.filter((i) => i !== item));

  const menuItems = [
    { id: "profile", label: "Profile & Settings", icon: <FaUser /> },
    { id: "rentals", label: "My Rentals", icon: <FaShoppingBag /> },
    { id: "wishlist", label: "Wishlist", icon: <FaHeart /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "payments", label: "Payments & Billing", icon: <FaCreditCard /> },
    { id: "support", label: "Support & Help", icon: <FaQuestionCircle /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Responsive) */}
      <aside className={`pt-24 fixed md:relative md:w-64 bg-white border-r border-gray-200 p-4 shadow-md transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform md:flex md:flex-col z-25`}>
        <div className="flex justify-between items-center md:hidden">
          <h2 className="text-lg font-semibold text-gray-800">Account Settings</h2>
          <button className="text-gray-600 text-2xl z-100" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-4 py-3 text-left rounded-lg text-gray-700 transition ${activeSection === item.id ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`}
              onClick={() => {
                setActiveSection(item.id);
                setIsSidebarOpen(false);
              }}
            >
              <span className="mr-3 text-lg text-gray-600">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content (Smaller width like Chrome) */}
      <main className="h-fit mt-28 flex-1 max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700 text-2xl absolute left-5 top-5" onClick={() => setIsSidebarOpen(true)}>
          <FaBars />
        </button>

        {activeSection === "profile" && <BuyerProfilePage />}

        {activeSection === "wishlist" && (
          <section id="wishlist">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Wishlist</h2>
            {wishlist.length ? (
              wishlist.map((item, index) => (
                <div key={index} className="flex justify-between items-center border p-3 rounded-md mb-2">
                  <span>{item}</span>
                  <button onClick={() => removeWishlistItem(item)} className="text-red-500"><FaTrash /></button>
                </div>
              ))
            ) : (
              <p>No items in wishlist.</p>
            )}
          </section>
        )}

        {activeSection === "notifications" && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
            <p className="text-gray-600">🔔 You have no new notifications.</p>
          </section>
        )}

        {activeSection === "payments" && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payments & Billing</h2>
            <p className="text-gray-600">💳 No recent transactions.</p>
          </section>
        )}

        {activeSection === "support" && (
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Support & Help</h2>
            <p className="text-gray-600">📞 Contact Support: support@smartrentals.com</p>
            <p className="text-gray-600">📖 FAQs: <a href="#" className="text-blue-500">View Here</a></p>
          </section>
        )}
      </main>
    </div>
  );
};

export default BuyerAccount;
