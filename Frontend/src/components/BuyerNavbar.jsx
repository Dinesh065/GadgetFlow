import React, { useState } from "react";
import "./BuyerNavbar.css";

const BuyerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="buyer-navbar">
      <div className="logo">
        <h2>GadgetRental</h2>
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><a href="/dashboard">Home</a></li>
        <li><a href="/rentals">My Rentals</a></li>
        <li><a href="/favorites">Favorites</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/support">Support</a></li>
      </ul>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={`line ${isOpen ? "line1" : ""}`}></div>
        <div className={`line ${isOpen ? "line2" : ""}`}></div>
        <div className={`line ${isOpen ? "line3" : ""}`}></div>
      </div>
    </nav>
  );
};

export default BuyerNavbar;
