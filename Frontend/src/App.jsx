import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import SharedNavbar from "./components/SharedNavbar.jsx";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole); // ✅ Restore role from localStorage
    }
    setLoading(false); // ✅ Prevents rendering before fetching role
  }, []);

  if (loading) {
    return <div className="text-center p-10 text-gray-700 text-2xl">Loading...</div>; // ✅ Prevents flickering
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes (No Navbar) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup setUserRole={setUserRole} />} />

        {/* Protected Routes (With Navbar) */}
        <Route
          path="/buyer-dashboard"
          element={
            userRole === "buyer" ? (
              <WithNavbar>
                <BuyerDashboard />
              </WithNavbar>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            userRole === "seller" ? (
              <WithNavbar>
                <SellerDashboard />
              </WithNavbar>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

/* ✅ Ensures Navbar and Padding is Correct */
const WithNavbar = ({ children }) => (
  <div>
    <SharedNavbar />
    <div className="pt-20">{children}</div> {/* ✅ Prevents overlap */}
  </div>
);

export default App;
