import React from "react";
import SearchBar from "./SearchBar"; 
import FeaturedGadgets from "./FeaturedGadgets";
import NormalGadgetsGrid from "./NormalGadgetsGrid";
import BuyerNavbar from "./BuyerNavbar";

const BuyerDashboard = () => {
  return (
    <div>
      <nav className="dashboard-navbar">
        <BuyerNavbar/>
      </nav>
     
      <div className="dashboard-content">
        <SearchBar />
        <FeaturedGadgets /> 
        <NormalGadgetsGrid />
      </div>
    </div>
  );
};

export default BuyerDashboard;
