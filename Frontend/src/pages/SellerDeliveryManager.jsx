import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

const SellerDeliveryManager = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingItems, setPendingItems] = useState([]);
  const [acknowledgedItems, setAcknowledgedItems] = useState([]);
  const [returnItems, setReturnItems] = useState([]);

  const fetchItems = async () => {
    try {
      const ownerId = localStorage.getItem("ownerId");
      const res = await axios.get(`${API_BASE_URL}/delivery/pending-acknowledgements/${ownerId}`);
      const acknowledgedRes = await axios.get(`${API_BASE_URL}/delivery/acknowledged-history/${ownerId}`);

      setPendingItems(res.data);
      setAcknowledgedItems(acknowledgedRes.data.reverse()); // newest first
      const returnRes = await axios.get(`${API_BASE_URL}/delivery/pending-return-ack/${ownerId}`);
      setReturnItems(returnRes.data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load delivery items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAcknowledge = async (itemId) => {
    try {
      await axios.post(`${API_BASE_URL}/delivery/acknowledge-delivery/${itemId}`);
      toast.success("Acknowledged successfully");

      const acknowledgedItem = pendingItems.find(item => item._id === itemId);
      setPendingItems(prev => prev.filter(item => item._id !== itemId));
      setAcknowledgedItems(prev => [acknowledgedItem, ...prev]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to acknowledge");
    }
  };

  const handleReturnAcknowledge = async (itemId) => {
    try {
      await axios.post(`${API_BASE_URL}/delivery/acknowledge-return/${itemId}`);
      toast.success("Return acknowledged");
      fetchItems(); // refresh state
    } catch (err) {
      console.error(err);
      toast.error("Failed to acknowledge return");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-24 px-4">
      <h1 className="text-2xl font-bold mb-6">Confirm Handover</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2 font-medium ${activeTab === "pending"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-blue-500"
            }`}
        >
          🔔 Pending Confirmations
        </button>
        <button
          onClick={() => setActiveTab("acknowledged")}
          className={`pb-2 font-medium ${activeTab === "acknowledged"
            ? "border-b-2 border-green-600 text-green-600"
            : "text-gray-500 hover:text-green-500"
            }`}
        >
          📦 Acknowledged History
        </button>
        <button
          onClick={() => setActiveTab("returns")}
          className={`pb-2 font-medium ${activeTab === "returns"
            ? "border-b-2 border-purple-600 text-purple-600"
            : "text-gray-500 hover:text-purple-500"
            }`}
        >
          🔄 Return Confirmations
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "pending" && (
        <div>
          {pendingItems.length === 0 ? (
            <p className="text-gray-600 mb-6">No handovers pending confirmation.</p>
          ) : (
            <div className="space-y-4 mb-10">
              {pendingItems.map(item => (
                <div
                  key={item._id}
                  className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p>Status: Awaiting your confirmation</p>
                    <p>Delivery Type: {item.deliveryType}</p>
                    <p>Buyer: {item.renter?.name} ({item.renter?.email})</p>
                  </div>
                  <button
                    onClick={() => handleAcknowledge(item._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Acknowledge {item.deliveryType === "delivery" ? "Delivery" : "Pickup"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "acknowledged" && (
        <div>
          {acknowledgedItems.length === 0 ? (
            <p className="text-gray-600">No past acknowledgments.</p>
          ) : (
            <div className="space-y-4">
              {acknowledgedItems.map(item => (
                <div
                  key={item._id}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p>Status: Confirmed</p>
                  <p>Delivery Type: {item.deliveryType}</p>
                  <p>Buyer: {item.renter?.name} ({item.renter?.email})</p>
                  <p>Rental Period: {new Date(item.rentalDate).toDateString()} ➜ {new Date(item.dueDate).toDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "returns" && (
        <div>
          {returnItems.length === 0 ? (
            <p className="text-gray-600">No pending return confirmations.</p>
          ) : (
            <div className="space-y-4">
              {returnItems.map(item => {
                const isAcknowledged = item.requests?.[0]?.sellerReturnAcknowledged === true;
                return (
                  <div key={item._id} className="bg-white p-4 shadow-md rounded-lg flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-lg">{item.name}</h2>
                      <p>Buyer: {item.renter?.name} ({item.renter?.email})</p>
                      <p>Status: Returned by renter</p>
                      <p>Expected Return: {new Date(item.dueDate).toDateString()}</p>
                      <p>Requested Return On: {new Date(item.returnRequestedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      {isAcknowledged ? (
                        <span className="text-green-600 font-semibold">✅ Return Acknowledged</span>
                      ) : (
                        <button
                          onClick={() => handleReturnAcknowledge(item._id)}
                          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        >
                          Confirm Return
                        </button>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SellerDeliveryManager;
