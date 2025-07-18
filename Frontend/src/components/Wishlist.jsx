import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 99999]);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to fetch wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    let data = wishlist;

    if (search) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      data = data.filter(item => item.category === category);
    }

    data = data.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    setFiltered(data);
  }, [search, category, priceRange, wishlist]);

  const handleRemove = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/wishlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const clearAll = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cleared all items");
      fetchWishlist();
      setShowConfirmModal(false);
    } catch {
      toast.error("Failed to clear wishlist");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pt-28">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {[...new Set(wishlist.map(item => item.category))].map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          className="border px-3 py-2 rounded w-24"
          placeholder="Min Price"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-24"
          placeholder="Max Price"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
        />
        <button
          onClick={() => setShowConfirmModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear All
        </button>
      </div>

      <hr className="border-t border-gray-300 mb-6" />

      {/* Wishlist Items */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div key={item._id} className="bg-white rounded shadow-md p-4">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="h-48 w-full object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{item.name}</h3>
              <p className="text-sm text-gray-600">Category: {item.category}</p>
              <p className="text-sm text-gray-600 mb-2">Price/Day: ₹{item.price}</p>
              <div className="flex justify-between items-center">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  View Details
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={clearAll}
      />

    </div>
  );
};

export default WishlistPage;
