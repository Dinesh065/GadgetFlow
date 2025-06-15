import { FaSlidersH, FaSearch } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const BuyerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const wishlistCount = 5;
  const status = "accepted";
  const dueDate = "2025-06-20";
  const today = dayjs();
  const remainingDays = dayjs(dueDate).diff(today, "day");
  const totalRentals = 12;

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/v1/buyers/items", {
          params: {
            category: brandFilter,
            // minPrice: priceFilter === "low" ? 0 : priceFilter === "mid" ? 100 : undefined,
            // maxPrice: priceFilter === "low" ? 99 : priceFilter === "mid" ? 300 : priceFilter === "high" ? undefined : undefined,
            rating: ratingFilter,
          },
        });

        setProducts(response.data);
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
  }, [brandFilter, priceFilter, ratingFilter]);

  // Filter by search only (other filters are server-side)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-20 p-6 pt-0 w-5/6 w-full mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col h-full bg-blue-100 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">Wishlist Items</h3>
          <p className="text-3xl font-bold text-blue-700">{wishlistCount}</p>
          <button
            onClick={() => navigate("/account", { state: { section: "wishlist" } })}
            className="mt-auto w-fit px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            View Wishlist
          </button>
        </div>

        <div className="bg-yellow-100 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">Laptop</h3>
          <p className="text-lg">Status: {status}</p>
          <p className="text-lg">Return by: <strong>{dueDate}</strong></p>
          <p className="text-lg text-yellow-700">{remainingDays} days remaining</p>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            View Orders
          </button>
        </div>

        <div className="flex flex-col h-full bg-green-100 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">Total Rentals</h3>
          <p className="text-3xl font-bold text-green-700">{totalRentals}</p>
          <button
            onClick={() => navigate("/myrentals")}
            className="mt-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-fit"
          >
            My Rentals
          </button>
        </div>
      </div>

      {/* Filters */}
      <h2 className="text-2xl font-bold mt-6 pb-6">Products:</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Price Filter */}
          <select onChange={(e) => setPriceFilter(e.target.value)} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700">
            <option value="">Price</option>
            <option value="low">Below $100</option>
            <option value="mid">$100 - $300</option>
            <option value="high">Above $300</option>
          </select>

          {/* Brand Filter */}
          <select onChange={(e) => setBrandFilter(e.target.value)} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700">
            <option value="">Brand</option>
            <option value="airpods">AirPods</option>
            <option value="bose">Bose</option>
            <option value="jbl">JBL</option>
            <option value="mpow">Mpow</option>
          </select>

          {/* Rating Filter */}
          <select onChange={(e) => setRatingFilter(e.target.value)} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700">
            <option value="">Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="md:flex items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-100 w-96 md:w-64">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              images={product.images}
              name={product.name}
              price={`$${product.price}`}
              description={product.description}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
