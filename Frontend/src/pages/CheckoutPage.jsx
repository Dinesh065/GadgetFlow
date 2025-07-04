import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import OrderSuccessPopup from "../components/OrderSuccessPopup";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
  const [deliveryType, setDeliveryType] = useState("pickup"); // default is pickup
  const [showPopup, setShowPopup] = useState(false);
  // const { productId } = useParams();


  useEffect(() => {
    if (!state || !state.order) return navigate("/orders");

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const itemRes = await axios.get(
          `${API_BASE_URL}/items/checkOutPage/${state.order.productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const item = itemRes.data;

        const sellerRes = await axios.get(
          `${API_BASE_URL}/users/checkOutPage/${item.ownerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setItem(item);
        setSeller(sellerRes.data);
      } catch (error) {
        console.error("Error fetching item/seller info", error);
      }
    };

    fetchData();
  }, [state, navigate]);

  const handleStripePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/payment/create-checkout-session/${item._id}`,
        { deliveryType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Payment failed. Please try again.";
      toast.error(msg); // show the specific message from backend (e.g. seller not onboarded)
      console.error(err);
      navigate(`/checkout/${item._id}`); // optional: redirect back to item or stay on page
    }
  };

  if (!item || !seller) {
    return <div className="p-8 pt-24 text-gray-600">Loading...</div>;
  }

  const deliveryCost =
    deliveryType === "delivery" && item.deliveryOptions.delivery
      ? item.deliveryOptions.deliveryCost
      : 0;

  const days = item.days_for_rent || 1;
  const subtotal = item.price * days;
  const total = subtotal + deliveryCost;

  return (
    <div className="p-8 pt-24 min-h-screen max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left - Item and Seller Info */}
      <div className="col-span-2 space-y-8">
        {/* Item Box */}
        <div className="border border-gray-200 bg-white p-6 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Item Details</h2>
          <div className="flex items-center gap-6">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-32 h-32 object-cover rounded"
            />
            <div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">Category: {item.category}</p>
              <p className="text-sm text-gray-600">Price/Day: ₹{item.price}</p>
              <p className="text-sm mt-2 text-gray-700">{item.description}</p>
            </div>
          </div>
        </div>

        {/* Seller Box */}
        <div className="border border-gray-200 bg-white p-6 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Seller Info</h2>
          <div className="flex items-center gap-4">
            <img
              src={seller.profileImage || "https://via.placeholder.com/80"}
              alt="Seller"
              className="w-20 h-20 object-cover rounded-full"
            />
            <div>
              <p className="font-semibold text-lg">{seller.fullName}</p>
              <p className="text-sm text-gray-600">
                Location: {seller.address || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Contact: {seller.contactNumber || "N/A"}
              </p>
              <p className="text-sm text-gray-600">Rating: N/A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Payment Summary */}
      <div className="border border-gray-200 bg-white p-6 rounded shadow-sm h-fit">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {/* Delivery Option */}
        {item.deliveryOptions.delivery ? (
          <div className="mb-4">
            <label className="block font-medium mb-1">Select Delivery Option:</label>
            <select
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="pickup">Pickup (Free)</option>
              <option value="delivery">Delivery (+₹{item.deliveryOptions.deliveryCost})</option>
            </select>
          </div>
        ) : (
          <p className="mb-4 text-sm text-gray-600 font-medium">Only Pickup is available.</p>
        )}

        {/* Price Summary */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Item Price (₹{item.price} × {days} day{days > 1 ? "s" : ""})</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{deliveryType === "delivery" ? `₹${deliveryCost}` : "Pickup (Free)"}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-black text-base">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition text-sm mt-4"
          onClick={handleStripePayment}
        >
          Pay with Stripe
        </button>

        <OrderSuccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      </div>
    </div>
  );
};

export default CheckoutPage;
