import { useState } from "react";
import dayjs from "dayjs";

const BuyerOrders = () => {
  const [activeTab, setActiveTab] = useState("requested");

  const today = dayjs();

  const orders = {
    requested: [
      { id: 1, name: "Gaming Console", category: "Electronics", price: "$200", requestedOn: "2025-06-01" },
      { id: 2, name: "Bluetooth Speaker", category: "Audio", price: "$60", requestedOn: "2025-06-05" },
    ],
    accepted: [
      {
        id: 3,
        name: "Drone Camera",
        category: "Gadgets",
        price: "$500",
        acceptedOn: "2025-06-03",
        dueDate: "2025-06-15",
      },
    ],
    rejected: [
      {
        id: 4,
        name: "Smartwatch",
        category: "Wearables",
        price: "$120",
        reason: "Out of stock",
        rejectedOn: "2025-06-04",
      },
    ],
  };

  const renderCard = (order, type) => {
    const daysRemaining =
      type === "accepted"
        ? dayjs(order.dueDate).diff(today, "day")
        : null;

    return (
      <div
        key={order.id}
        className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-lg transition"
      >
        <div>
          <h3 className="text-lg font-semibold">{order.name}</h3>
          <p className="text-m text-gray-600">Category: {order.category}</p>
          <p className="text-m text-gray-600">Price: {order.price}</p>

          {type === "requested" && (
            <p className="text-sm text-blue-600 mt-1">
              Requested On: {dayjs(order.requestedOn).format("MMM DD, YYYY")}
            </p>
          )}

          {type === "accepted" && (
            <>
              <p className="text-sm text-green-600 mt-1">
                Accepted On: {dayjs(order.acceptedOn).format("MMM DD, YYYY")}
              </p>
              <p className="text-sm text-green-600">
                Due Date: {dayjs(order.dueDate).format("MMM DD, YYYY")}
              </p>
              <p className="text-sm text-yellow-600">
                {daysRemaining} day{daysRemaining !== 1 && "s"} remaining to return
              </p>
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
          <button className="border border-green-600 text-green-600 px-6 py-3 rounded-full hover:bg-green-600 hover:text-white transition text-sm">
            View Details
          </button>

          {type === "accepted" && (
            <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition text-sm">
              Pay Now
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pt-20 px-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300 pb-2">
        {["requested", "accepted", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`capitalize px-4 py-2 rounded-t-md font-medium ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} Orders
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {orders[activeTab].length > 0 ? (
          orders[activeTab].map((order) => renderCard(order, activeTab))
        ) : (
          <p className="text-gray-600">No {activeTab} orders available.</p>
        )}
      </div>
    </div>
  );
};

export default BuyerOrders;
