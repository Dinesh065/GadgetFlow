import React from "react";
import SearchBar from "../components/SearchBar";
import NormalGadgetsGrid from "../components/NormalGadgetsGrid";
import FeaturedGadgets from "../components/FeaturedGadgets";
// import BuyerNavbar from "./BuyerNavbar";

const BuyerDashboard = () => {
  return (
    <div>
      {/* <nav className="dashboard-navbar">
        <BuyerNavbar/>
      </nav>
      */}
      <div className="dashboard-content">
        <SearchBar />
        <FeaturedGadgets /> 
        <NormalGadgetsGrid />
      </div>
    </div>
  );
};

export default BuyerDashboard;
