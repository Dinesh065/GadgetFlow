// const fetchSellerItems = async () => {
//     try {
//         const owner_id = localStorage.getItem("ownerId");
//         if (!owner_id) return;

//         const response = await axios.get(`${API_BASE_URL}/items/getItemsByOwner/${owner_id}`);
//         setItems(response.data);
//     } catch (error) {
//         console.error("Error fetching items:", error.message);
//     }
// };
// const fetchProfitData = async () => {
//     try {
//         const ownerId = localStorage.getItem("ownerId");
//         const response = await axios.get(`${API_BASE_URL}/items/monthly-profit?ownerId=${ownerId}`);
//         setProfitData(response.data);
//     } catch (err) {
//         console.error("Failed to fetch profit data", err);
//     }
// };

import React, { useState } from "react";
import { useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";
import { FaPlus, FaEye } from "react-icons/fa";
import SellerAddItemForm from "./SellerAddNewItemForm";
import DetailCard from "../components/DetailCard";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BuyerRequestsModal from "../components/BuyerRequestModel";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
    const [profitData, setProfitData] = useState([]);
    const [filter, setFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGadget, setSelectedGadget] = useState(null);
    const [currentItemId, setCurrentItemId] = useState(null);

    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfitData = async () => {
            try {
                const ownerId = localStorage.getItem("ownerId");
                const response = await axios.get(`${API_BASE_URL}/items/monthly-profit?ownerId=${ownerId}`);

                // Fix if response.data is wrapped
                if (Array.isArray(response.data)) {
                    setProfitData(response.data);
                } else if (Array.isArray(response.data?.data)) {
                    setProfitData(response.data.data);
                } else {
                    console.error("Unexpected profit data format:", response.data);
                    setProfitData([]);
                }
            } catch (err) {
                console.error("Failed to fetch profit data", err);
                setProfitData([]);
            }
        };
        fetchProfitData();
    }, []);

    const fetchSellerItems = async () => {
        try {
            const owner_id = localStorage.getItem("ownerId");
            if (!owner_id) return;

            const response = await axios.get(`${API_BASE_URL}/items/getItemsByOwner/${owner_id}`);
            if (Array.isArray(response.data)) {
                setItems(response.data);
            } else if (Array.isArray(response.data?.items)) {
                setItems(response.data.items);
            } else {
                console.error("Unexpected items format:", response.data);
                setItems([]);
            }
        } catch (error) {
            console.error("Error fetching items:", error.message);
            setItems([]);
        }
    };

    const rentalData = Array.isArray(items) ? items.reduce((acc, item) => {
        const existing = acc.find(entry => entry.name === item.name);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: item.name, value: 1 });
        }
        return acc;
    }, []) : [];

    useEffect(() => {
        fetchSellerItems();
    }, []);

    const handleAddItem = async (newItem) => {
        try {
            console.log("Adding new item:", newItem);
            const owner_id = localStorage.getItem("ownerId");
            const response = await axios.post(`${API_BASE_URL}/items/addNewItems`, {
                ...newItem,
                price: parseInt(newItem.price.replace(/[^\d]/g, ""), 10),
                ownerId: owner_id, // Use actual ownerId from logged-in user
                status: newItem.availability || "Available", // status from form
                deliveryOptions: newItem.deliveryOptions
            });
            setItems((prevItems) => [...prevItems, response.data]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error occurred while adding item:", error.message);
        }
    };

    const getStatusColor = (status) => {
        if (status === "Available") return "bg-green-500"; // Green for Available
        if (status === "Rented") return "bg-red-500"; // Red for Rented
        return ""; // No default case (removes unnecessary colors)
    };

    const filteredItems = filter === "All" ? items : items.filter(item => item.status === filter);
    const dummyProfitData = [
        { name: "Jan", value: 0 },
        { name: "Feb", value: 0 },
        { name: "Mar", value: 0 },
        { name: "Apr", value: 0 }
    ];

    const graphData = profitData.length > 0 ? profitData : dummyProfitData;

    const totalProfit = Array.isArray(profitData)
        ? profitData.reduce((sum, entry) => sum + entry.value, 0)
        : 0;

    const [showRequests, setShowRequests] = useState(false);
    const [buyerRequests, setBuyerRequests] = useState([]); // fetched from backend

    const fetchBuyerRequests = async (itemId) => {
        try {
            console.log("Fetching buyer requests for item ID:", itemId);
            const res = await fetch(`${API_BASE_URL}/items/requests/${itemId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setBuyerRequests(data);
            } else {
                console.error("Response is not an array:", data);
                setBuyerRequests([]);
            }
        } catch (err) {
            console.error("Failed to fetch buyer requests:", err);
            setBuyerRequests([]);
        }
    };

    const handleAcceptRequest = async (acceptedRequestId, itemId) => {
        try {
            await axios.post(`${API_BASE_URL}/items/requests/accept/${acceptedRequestId}`);
            fetchBuyerRequests(itemId); // ✅ now itemId is available
        } catch (err) {
            console.error("Error accepting request", err);
        }
    };

    return (
        <div className="bg-gray-50 pt-24">
            <div className="bg-gray-50 w-full min-h-screen p-4 md:p-6 text-black">
                <div className="shadow-lg">
                    {/* Top Graphs Section */}
                    <div className="bg-white p-4 md:p-6 rounded-md grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profit Graph */}
                        <div className="flex flex-col bg-gray-100 p-4 rounded-md">
                            <h1 className="text-xl md:text-2xl font-semibold">Profit: ₹{totalProfit}</h1>
                            {totalProfit === 0 && (
                                <p className="text-gray-600 text-sm mt-1">
                                    No rentals yet. Profit data will appear once an item is rented.
                                </p>
                            )}
                            <div className="mt-4 -ml-3">
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={graphData}>
                                        <XAxis dataKey="name" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#FFCE56"
                                            strokeWidth={3}
                                            dot={{ fill: "#FFCE56", r: 5 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Status Graph */}
                        <div className="flex flex-col bg-gray-100 p-4 rounded-md">
                            <h1 className="text-xl md:text-2xl font-semibold">Status:</h1>
                            <div className="mt-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={rentalData}>
                                        <XAxis dataKey="name" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }} />
                                        <Legend />
                                        <Bar dataKey="value" fill="#36A2EB" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter & Actions */}
                <div className="bg-white mt-6 p-4 md:p-6 rounded-md shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-xl md:text-2xl font-semibold">Filter by Status:</h1>
                        <select
                            className="border p-2 rounded-md"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Available">Available</option>
                            <option value="Requested">Requested</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Paid">Paid</option>
                            <option value="Returned">Returned</option>
                            <option value="Rented">Rented</option>
                        </select>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                        >
                            <FaPlus /> Add New Item
                        </button>
                        <button
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            onClick={() => navigate("/setup-stripe")}
                        >
                            Setup Stripe Account
                        </button>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="relative bg-white p-4 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 border border-gray-300 hover:border-blue-500 hover:shadow-2xl"
                        >
                            {/* Status Indicator */}
                            {/* <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${getStatusColor(item.status)} animate-pulse`}></div> */}

                            {/* Thumbnail */}
                            <div className="relative overflow-hidden rounded-lg">
                                <img
                                    src={item.images?.[0] || item.img}
                                    alt={item.name}
                                    className="w-full h-40 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Info */}
                            <p className="text-gray-900 font-bold text-lg mt-4">{item.name}</p>
                            <p className="text-gray-800 font-semibold mt-1">Price: ₹{item.price}</p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-gray-800 font-semibold">Requests: {item.requests.length}</p>
                                <button
                                    onClick={() => {
                                        setCurrentItemId(item._id);
                                        setShowRequests(true);
                                        fetchBuyerRequests(item._id);
                                    }}
                                    className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700"
                                >
                                    View
                                </button>
                            </div>

                            <p className="text-gray-600 mt-1">
                                Status: <span className="font-semibold">{item.status}</span>
                            </p>

                            <button
                                onClick={() => setSelectedGadget(item)}
                                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                            >
                                <FaEye />
                                View Details
                            </button>
                        </div>
                    ))}
                </div>

                {/* Modals */}
                {isModalOpen && (
                    <SellerAddItemForm onClose={() => setIsModalOpen(false)} onSubmit={handleAddItem} />
                )}
                {selectedGadget && (
                    <DetailCard gadget={selectedGadget} onClose={() => setSelectedGadget(null)} />
                )}
                {showRequests && (() => {
                    return (
                        <BuyerRequestsModal
                            itemId={currentItemId}
                            requests={buyerRequests}
                            onClose={() => setShowRequests(false)}
                            onAccept={handleAcceptRequest}
                        />
                    );
                })()}

            </div>
        </div>
    );
};

export default SellerDashboard;