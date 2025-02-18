import React from "react";
import SellerNavbar from "./SellerNavbar";
import BuyerNavbar from "./BuyerNavbar";

const SharedNavbar = ({ role }) => {
  return role === "seller" ? <SellerNavbar /> : <BuyerNavbar />;
};

export default SharedNavbar;
