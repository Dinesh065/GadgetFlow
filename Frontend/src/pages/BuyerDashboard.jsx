import { FaSearch } from "react-icons/fa";
import ProductCard from "../components/productCard.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config.jsx";
import SummaryCards from "../components/SummaryCards.jsx";

const BuyerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(""); // low, mid, high
  const [category, setCategory] = useState(""); // category filter
  const [rating, setRating] = useState(""); // rating filter
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  const navigate = useNavigate();

  // Map price filter to actual range
  const getPriceRange = (range) => {
    switch (range) {
      case "low":
        return { min: 0, max: 100 };
      case "mid":
        return { min: 100, max: 300 };
      case "high":
        return { min: 300, max: undefined };
      default:
        return {};
    }
  };

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get(`${API_BASE_URL}/buyers/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWishlistItems(res.data.wishlist.map((entry) => entry.itemId._id));
        }
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };

    fetchWishlist();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { min, max } = getPriceRange(priceRange);
        const params = {
          category: category || undefined,
          rating: rating || undefined,
          minPrice: min,
          maxPrice: max,
        };

        const res = await axios.get(`${API_BASE_URL}/buyers/items`, { params });
        setProducts(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [priceRange, category, rating]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-20 p-6 w-full max-w-screen-2xl mx-auto">
      {/* Summary Cards */}
      <SummaryCards/>

      {/* Filters */}
      <h2 className="text-2xl font-bold mt-6 pb-4">Browse Products</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700"
          >
            <option value="">Price</option>
            <option value="low">Below $100</option>
            <option value="mid">$100 - $300</option>
            <option value="high">Above $300</option>
          </select>

          <select
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700"
          >
            <option value="">Category</option>
            <option value="laptop">Laptop</option>
            <option value="camera">Camera</option>
            <option value="headphones">Headphones</option>
            <option value="smartwatch">Smartwatch</option>
          </select>

          <select
            onChange={(e) => setRating(e.target.value)}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700"
          >
            <option value="">Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
          </select>
        </div>

        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-100 w-full md:w-64">
          <input
            type="text"
            placeholder="Search Product"
            className="bg-transparent outline-none text-base flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-gray-500 text-lg" />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              images={product.images}
              name={product.name}
              price={`$${product.price}`}
              description={product.description}
              rentalDuration={product.days_for_rent}
              isWishlisted={wishlistItems.includes(product._id)}
              status={product.status}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;