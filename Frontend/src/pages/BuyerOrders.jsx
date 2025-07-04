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
  const [showReminder, setShowReminder] = useState(false);
  const [reminderOrder, setReminderOrder] = useState(null);

  // fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/buyers/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);

        // ✅ Show payment reminder modal for first unpaid accepted order
        const firstUnpaid = res.data.accepted.find(order => {
          const acceptedAt = dayjs(order.acceptedAt);
          const now = dayjs();
          return (
            acceptedAt.isValid() &&
            now.diff(acceptedAt, 'hour') < 24 &&
            !order.paymentDone // 🔁 This field should exist in backend schema
          );
        });

        if (firstUnpaid) {
          setReminderOrder(firstUnpaid);
          setShowReminder(true);
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderCard = (order, type) => {
    const daysRemaining = type === "accepted" && order.dueDate
      ? dayjs(order.dueDate).diff(today, "day")
      : null;

    return (
      <div
        key={order.orderId}
        className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition"
      >
        <div>
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
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
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
            <button
              onClick={() => navigate(`/rental-status/${order.productId}`)}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition text-sm"
            >
              Track Rental
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {
        showReminder && reminderOrder && (
          <PaymentReminderModal
            order={reminderOrder}
            onClose={() => setShowReminder(false)}
            onPay={() => navigate(`/checkout/${reminderOrder.productId}`)}
          />
        )
      }

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
