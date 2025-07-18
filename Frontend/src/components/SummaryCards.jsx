import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const SummaryCards = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState({ requested: [], accepted: [], rejected: [] });
  const today = dayjs();

  const cardStyle =
    "bg-white border-l-4 border-green-600 rounded-2xl p-6 shadow-xl flex flex-col justify-between transform transition hover:scale-[1.02] hover:shadow-2xl";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [wishlistRes, ordersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/wishlist`, { headers }),
          axios.get(`${API_BASE_URL}/buyers/orders`, { headers }),
        ]);

        setWishlistItems(wishlistRes.data || []);
        setOrders(ordersRes.data || {});
      } catch (error) {
        console.error("Failed to fetch summary data:", error);
      }
    };

    fetchData();
  }, []);

  const acceptedOrders = orders.accepted || [];
  const upcoming = acceptedOrders[0]; // Take the first accepted order

  const dueDate = upcoming?.dueDate ? dayjs(upcoming.dueDate).format("YYYY-MM-DD") : null;
  const remainingDays = dueDate ? dayjs(dueDate).diff(today, "day") : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-6">
      {/* Wishlist */}
      <div className={cardStyle}>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Wishlist Items</h3>
          <p className="text-4xl font-bold text-green-700">{wishlistItems.length}</p>
        </div>
        <button
          onClick={() => navigate("/wishlist")}
          className="mt-6 px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-xl transition w-fit"
        >
          View Wishlist
        </button>
      </div>

      {/* Upcoming Return */}
      <div className={cardStyle}>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Accepted Order</h3>
          {upcoming ? (
            <>
              <p className="text-md text-gray-600 mb-1">
                Product: <span className="font-medium">{upcoming.name}</span>
              </p>
              <p className="text-md text-gray-600">
                Status:{" "}
                <span className="text-green-600 font-semibold">Accepted</span>
              </p>
              <p className="text-sm mt-2 text-gray-500">
                Pay by: <strong>{dueDate}</strong>
              </p>
              <p className="text-sm text-yellow-600 font-medium">
                {remainingDays} day{remainingDays !== 1 ? "s" : ""} remaining
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-sm">
              No active accepted orders right now.
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="mt-6 px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-xl transition w-fit"
        >
          View Orders
        </button>
      </div>

      {/* Total Rentals */}
      <div className={cardStyle}>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Rentals</h3>
          <p className="text-4xl font-bold text-green-700">{acceptedOrders.length}</p>
        </div>
        <button
          onClick={() => navigate("/my-rentals")}
          className="mt-6 px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-xl transition w-fit"
        >
          My Rentals
        </button>
      </div>
    </div>
  );
};

export default SummaryCards;
