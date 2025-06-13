import React, { useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../config";
export default function OverdueManager({ onClose }) {
    const [activeTab, setActiveTab] = useState("overdues");
    const [overdueItems, setOverdueItems] = useState([]);
    const [pendingItems, setPendingItems] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [overdueRes, pendingRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/item_overdues/overdues`),
                axios.get(`${API_BASE_URL}/item_overdues/pending`),
            ]);

            console.log("Overdues:", overdueRes.data);  // 🔍 Add this
            console.log("Pending:", pendingRes.data);    // 🔍 Add this

            setOverdueItems(overdueRes.data);
            setPendingItems(pendingRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const sendWarning = async (item) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/item_overdues/send-warning`, {
                renterId: item.renterId,
                itemId: item.id,
            });

            alert(res.data.message || "Warning sent successfully.");
            fetchData(); // Refresh data after warning sent
        } catch (error) {
            console.error("Error sending warning:", error);
            alert("Failed to send warning.");
        }
    };

    const takeAction = async (item) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/item_overdues/take-action`, {
                renterId: item.renterId,
                itemId: item.id,
            });

            alert(res.data.message || "Action taken successfully.");
            fetchData(); // Refresh data after action
        } catch (error) {
            console.error("Error taking action:", error);
            alert("Failed to take action.");
        }
    };

    const renderOverdues = () => (
        overdueItems.length === 0 ? (
            <p className="text-center text-gray-500">No current overdues.</p>
        ) : (
            <ul className="divide-y divide-gray-200">
                {overdueItems.map((item) => (
                    <li key={item.id} className="py-4">
                        <p><strong>Item:</strong> {item.item}</p>
                        <p><strong>Renter:</strong> {item.renter}</p>
                        <p><strong>Contact:</strong> {item.contact}</p>
                        <p><strong>Due on:</strong> {item.returnDate}</p>
                        <div className="mt-2 flex gap-3">
                            <button
                                onClick={() => sendWarning(item)}
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                                Send Warning
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        )
    );

    const renderPending = () => (
        pendingItems.length === 0 ? (
            <p className="text-center text-gray-500">No pending actions.</p>
        ) : (
            <ul className="divide-y divide-gray-200">
                {pendingItems.map((item) => (
                    <li key={item.id} className="py-4">
                        <p><strong>Item:</strong> {item.item}</p>
                        <p><strong>Renter:</strong> {item.renter}</p>
                        <p><strong>Contact:</strong> {item.contact}</p>
                        <p><strong>Warning Sent:</strong> {new Date(item.warningSentAt).toLocaleString()}</p>
                        <div className="mt-2">
                            <button
                                onClick={() => takeAction(item)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Take Action
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        )
    );

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[85vh] overflow-hidden p-6 flex flex-col">
                {/* Header */}
                <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
                    <FaExclamationCircle className="mr-2" />
                    Overdue Manager
                </h2>

                {/* Tabs */}
                <div className="flex w-full border-b">
                    {["overdues", "pending"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-1/2 py-2 font-semibold transition-all duration-300 text-center ${activeTab === tab
                                ? "border-b-4 border-red-600 text-red-600"
                                : "text-gray-600 hover:text-red-500"
                                }`}
                        >
                            {tab === "overdues" ? "Overdues" : "Pending Overdues"}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 mt-4 overflow-y-auto pr-2">
                    {activeTab === "overdues" ? renderOverdues() : renderPending()}
                </div>

                {/* Close Button */}
                <div className="pt-4 border-t mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
