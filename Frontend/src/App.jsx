import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import BuyerNavbar from "./components/BuyerNavbar.jsx";
import SellerNavbar from "./components/SellerNavbar.jsx";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setUserRole(storedRole);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("authToken");
    setUserRole(null);
    window.location.href = "/login";  
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-700 text-2xl">Loading...</div>;
  }

  return (
    <Router>
      <MainContent userRole={userRole} handleLogout={handleLogout} setUserRole={setUserRole} />
    </Router>
  );
}

function MainContent({ userRole, handleLogout, setUserRole }) {
  const location = useLocation(); 

  const hideNavbar = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && userRole === "buyer" && <BuyerNavbar onLogout={handleLogout} />}
      {!hideNavbar && userRole === "seller" && <SellerNavbar className="bg-black" onLogout={handleLogout} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup setUserRole={setUserRole} />} />

        {/* Protected Routes */}
        <Route
          path="/buyer-dashboard"
          element={userRole === "buyer" ? <BuyerDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/seller-dashboard"
          element={userRole === "seller" ? <SellerDashboard /> : <Navigate to="/login" />}
        />

        {/* Add additional routes here -> */}
      </Routes>
    </>
  );
}

export default App;