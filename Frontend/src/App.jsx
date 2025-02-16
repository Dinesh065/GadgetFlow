import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/Login";
import BuyerDashboard from "./components/BuyerDashboard"
function App() {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<BuyerDashboard />} />
        </Routes>
    </Router>
  );
}

export default App;