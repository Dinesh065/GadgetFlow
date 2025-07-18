import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../config";

const ProductCard = ({
  id,
  images,
  name,
  price,
  description,
  isWishlisted: propWishlisted,
  rentalDuration,
  status,
}) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(propWishlisted);

  useEffect(() => {
    setIsWishlisted(propWishlisted);
  }, [propWishlisted]);

  const handleWishlistClick = async (e) => {
    e.stopPropagation(); // prevent card click

    if (isWishlisted) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/buyers/addToWishlist/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Added to wishlist");
      setIsWishlisted(true);
    } catch (err) {
      if (err?.response?.data?.message?.toLowerCase().includes("already")) {
        toast("Item already in wishlist", { icon: "⚠️" });
        setIsWishlisted(true);
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  };

  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case "available":
      default:
        return "text-red-600 bg-red-100";
    }
  };

  return (
    <div className="rounded-md w-full relative shadow-md bg-white">
      {/* Wishlist Button */}
      <button
        className={`absolute top-3 right-4 text-lg ${
          isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
        }`}
        onClick={handleWishlistClick}
      >
        <FaHeart />
      </button>

      {/* Image */}
      <img
        src={images[0]}
        alt={name}
        className="w-full h-40 object-cover mx-auto rounded-md"
      />

      {/* Info */}
      <h3 className="ml-4 mt-3 text-lg font-semibold text-gray-900">{name}</h3>
      <p className="ml-4 text-gray-500 text-sm">{description}</p>

      <p className="ml-4 text-blue-600 text-sm mt-1">
        On rent for <span className="font-semibold">{rentalDuration}</span> days
      </p>

      {/* Status */}
      <p
        className={`ml-4 mt-2 inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle()}`}
      >
        {status === "Available"
          ? "Available"
          : "Item Unavailable"}
      </p>

      <p className="ml-4 text-gray-900 font-bold text-lg mt-1">{price}</p>

      <button
        onClick={() => navigate(`/product/${id}`)}
        className="ml-4 mt-3 mb-5 bg-green-600 text-white px-4 py-2 w-half rounded-full hover:bg-green-700 transition"
      >
        View Details
      </button>
    </div>
  );
};

export default ProductCard;
