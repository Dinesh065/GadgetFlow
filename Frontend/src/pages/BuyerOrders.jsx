import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { API_BASE_URL } from "../config";
import PaymentReminderModal from "../components/PaymentReminderModel";

const BuyerOrders = () => {
  const [activeTab, setActiveTab] = useState("requested");
  const [orders, setOrders] = useState({ requested: [], accepted: [], rejected: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const today = dayjs();
  const [visibleTrackCard, setVisibleTrackCard] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmingOrder, setConfirmingOrder] = useState(null);

  useEffect(() => {

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/buyers/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE_URL}/buyers/confirm-delivery`, {
        productId: confirmingOrder.productId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Confirmation successful. Email sent!");
      setShowConfirmDialog(false);
      setVisibleTrackCard(null);
      setConfirmingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to confirm.");
    }
  };

  const renderTrackCard = (order) => {
    const deliveryMethod = order.deliveryType || order.delivery_type || order.delivery || "pickup";
    const label = deliveryMethod === "delivery" ? "Delivery" : "Pickup";
    const alreadyConfirmed = order.buyerConfirmed;
    console.log(alreadyConfirmed);
    const message = alreadyConfirmed
      ? order.sellerAcknowledged
        ? `You have successfully confirmed the ${label.toLowerCase()}.`
        : `You have confirmed. Waiting for seller to acknowledge the ${label.toLowerCase()}.`
      : deliveryMethod === "delivery"
        ? "Your item will be delivered within 24 hours. Once received, please confirm."
        : "Please collect the item within 24 hours and then confirm.";


    return (
      <div className="bg-gray-100 rounded p-4 mt-2 w-full">
        <p className="text-sm mb-2">{message}</p>
        <button
          onClick={() => {
            setConfirmingOrder(order);
            setShowConfirmDialog(true);
          }}
          disabled={alreadyConfirmed}
          className={`px-4 py-2 rounded text-white transition ${alreadyConfirmed
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
            }`}
        >
          Confirm {label}
        </button>
      </div>
    );
  };

  const renderCard = (order, type) => {
    const daysRemaining = type === "accepted" && order.dueDate
      ? dayjs(order.dueDate).diff(today, "day")
      : null;

    return (
      <div
        key={order.orderId}
        className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition"
      >
        <div className="flex-1 w-full">
          <h3 className="text-lg font-semibold">{order.name}</h3>
          <p className="text-gray-600">Category: {order.category}</p>
          <p className="text-gray-600">Price/Day: ${order.price}</p>

          {type === "requested" && (
            <p className="text-sm text-blue-600 mt-1">
              Requested On: {dayjs(order.requestedOn).format("MMM DD, YYYY")}
            </p>
          )}

          {type === "accepted" && (
            <>
              <p className="text-sm text-green-600 mt-1">
                Accepted On: {dayjs(order.acceptedAt).format("MMM DD, YYYY")}
              </p>

              {order.paymentDone && (
                <>
                  <p className="text-sm text-green-600">
                    Due Date: {dayjs(order.dueDate).format("MMM DD, YYYY")}
                  </p>
                  <p className="text-sm text-yellow-600">
                    {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
                  </p>
                </>
              )}
            </>
          )}

          {type === "rejected" && (
            <>
              <p className="text-sm text-red-600 mt-1">
                Rejected On: {dayjs(order.rejectedOn).format("MMM DD, YYYY")}
              </p>
              <p className="text-sm text-red-700 font-medium">
                Reason: {order.reason}
              </p>
            </>
          )}

          {visibleTrackCard === order.orderId && renderTrackCard(order)}
        </div>

        <div className="flex flex-col gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => navigate(`/product/${order.productId}`)}
            className="border border-green-600 text-green-600 px-6 py-3 rounded-full hover:bg-green-600 hover:text-white transition text-sm"
          >
            View Details
          </button>

          {type === "accepted" && !order.paymentDone && (
            <button
              onClick={() => navigate(`/checkout/${order.productId}`, { state: { order } })}
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition text-sm"
            >
              Pay Now
            </button>
          )}

          {type === "accepted" && order.paymentDone && (
            order.requests?.[0]?.buyerConfirmed && order.requests?.[0]?.sellerAcknowledged ? (
              <button
                onClick={() => navigate("/my-rentals")}
                className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition text-sm"
              >
                Go to My Rentals
              </button>
            ) : (
              <button
                onClick={() =>
                  setVisibleTrackCard(visibleTrackCard === order.orderId ? null : order.orderId)
                }
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition text-sm"
              >
                Track Rental
              </button>
            )
          )}
        </div>
      </div>
    );

  };

  return (
    <div className="max-w-5xl mx-auto pt-28 px-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-300 pb-2">
        {["requested", "accepted", "rejected"].map(tab => (
          <button
            key={tab}
            className={`capitalize px-4 py-2 rounded-t-md font-medium ${tab === activeTab ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {
          showConfirmDialog && confirmingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg p-6 shadow-md max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
                <p className="text-sm mb-4">
                  This action will confirm that you've {confirmingOrder.deliveryType === "delivery" ? "received" : "picked up"} the item. This cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelivery}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Yes, Confirm
                  </button>
                </div>
              </div>
            </div>
          )
        }
        {loading ? (
          <p>Loading orders...</p>
        ) : orders[activeTab]?.length ? (
          orders[activeTab].map(order => renderCard(order, activeTab))
        ) : (
          <p className="text-gray-600">No {activeTab} orders available.</p>
        )}
      </div>
    </div>

  );
};

export default BuyerOrders;
