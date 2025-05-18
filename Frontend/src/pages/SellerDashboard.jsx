// import React, { useState } from "react";
// import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";
// import { FaPlus, FaEye } from "react-icons/fa";

// import SellerAddItemForm from "./SellerAddNewItemForm";
// import DetailCard from "../components/DetailCard";
// import axios from "axios";

// const SellerDashboard = () => {
//     const [profit] = useState(5000);
//     const [filter, setFilter] = useState("All");
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedGadget, setSelectedGadget] = useState(null);


//     const profitData = [
//         { name: "Jan", value: 2000 },
//         { name: "Feb", value: 3000 },
//         { name: "Mar", value: 5000 },
//         { name: "Apr", value: 4000 },
//     ];

//     const rentalData = [
//         { name: "Watch", value: 2 },
//         { name: "Laptop", value: 7 },
//         { name: "Phone", value: 5 },
//         { name: "Camera", value: 6 },
//     ];

//     const [items, setItems] = useState([]);

//     const handleAddItem = async (newItem) => {
//         try {
//             const owner_id = localStorage.getItem("ownerId");
//             const response = await axios.post("http://localhost:8000/api/v1/items/addNewItems", {
//                 ...newItem,
//                 price: parseInt(newItem.price.replace(/[^\d]/g, ""), 10),
//                 ownerId: owner_id // Use actual ownerId from logged-in user
//             });
//             setItems((prevItems) => [...prevItems, response.data]);
//             setIsModalOpen(false);
//         } catch (error) {
//             console.error("Error occurred while adding item:", error.message);
//         }
//     };

//     const getStatusColor = (status) => {
//         if (status === "Available") return "bg-green-500"; // Green for Available
//         if (status === "Rented") return "bg-red-500"; // Red for Rented
//         return ""; // No default case (removes unnecessary colors)
//     };

//     const filteredItems = filter === "All" ? items : items.filter(item => item.status === filter);


//     return (
//         <div className="bg-gray-50 w-full min-h-screen p-6 text-black">
//             <div className="shadow-lg">
//                 {/* Upper Section */}
//                 <div className="bg-white p-6 rounded-md grid grid-cols-2 gap-6">
//                     {/* Profit Graph */}
//                     <div className="flex flex-col bg-gray-100 p-4 rounded-md">
//                         <h1 className="text-2xl font-semibold">Profit: ₹{profit}</h1>
//                         <div className="ml-[-18px] mt-3">
//                             <ResponsiveContainer width="100%" height={180}>
//                                 <LineChart data={profitData}>
//                                     <XAxis dataKey="name" stroke="#666" />
//                                     <YAxis stroke="#666" />
//                                     <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }} />
//                                     <Line type="monotone" dataKey="value" stroke="#FFCE56" strokeWidth={3} dot={{ fill: "#FFCE56", r: 5 }} />
//                                 </LineChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>

//                     {/* Status Graph */}
//                     <div className="flex flex-col bg-gray-100 p-4 rounded-md">
//                         <h1 className="text-2xl font-semibold">Status:</h1>
//                         <div className="mt-3">
//                             <ResponsiveContainer width="100%" height={200}>
//                                 <BarChart data={rentalData}>
//                                     <XAxis dataKey="name" stroke="#666" />
//                                     <YAxis stroke="#666" />
//                                     <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }} />
//                                     <Legend />
//                                     <Bar dataKey="value" fill="#36A2EB" />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Filter Section */}
//             <div className="bg-white p-6 rounded-md shadow-md flex items-center justify-between">
//                 <h1 className="text-2xl font-semibold">Filter by Status:</h1>
//                 <div className="flex space-x-6">
//                     {["All", "Available", "Rented"].map(status => (
//                         <label key={status} className="flex items-center space-x-2 cursor-pointer">
//                             <input
//                                 type="radio"
//                                 value={status}
//                                 checked={filter === status}
//                                 onChange={() => setFilter(status)}
//                                 className="form-radio text-blue-500 h-5 w-5"
//                             />
//                             <span className="text-gray-700">{status}</span>
//                         </label>
//                     ))}
//                 </div>
//                 <button
//                     onClick={() => setIsModalOpen(true)}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
//                     <FaPlus />
//                     Add New Item
//                 </button>
//             </div>

//             {/* Item Cards */}
//             <div className="grid grid-cols-4 gap-6 mt-6">
//                 {filteredItems.map(item => (
//                     <div key={item.id} className="relative bg-white p-6 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 border border-gray-300 hover:border-blue-500 hover:shadow-2xl">
//                         {/* Status Indicator */}
//                         <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${getStatusColor(item.status)} animate-pulse`}></div>

//                         {/* Gadget Thumbnail */}
//                         <div className="relative overflow-hidden rounded-lg">
//                             <img src={item.images?.[0] || item.img} alt={item.name} className="w-full h-40 object-cover rounded-md transition-transform duration-300 group-hover:scale-105" />
//                         </div>

//                         {/* Item Details */}
//                         <p className="text-gray-900 font-bold text-lg mt-4">{item.name}</p>
//                         <p className="text-gray-800 font-semibold mt-2">Price: ₹{item.price}</p>
//                         <p className="text-gray-800 font-semibold ">Requests: ₹{item.requests}</p>
//                         <p className="text-gray-600">Status: <span className="font-semibold">{item.status}</span></p>

//                         {/* View Details Button */}
//                         <button
//                             onClick={() => setSelectedGadget(item)}
//                             className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition">
//                             <FaEye />
//                             View Details
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {isModalOpen && <SellerAddItemForm onClose={() => setIsModalOpen(false)} onSubmit={handleAddItem} />}
//             {selectedGadget && <DetailCard gadget={selectedGadget} onClose={() => setSelectedGadget(null)} />}
//         </div>
//     );
// };

// export default SellerDashboard;

import React, { useState } from "react";
import { useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";
import { FaPlus, FaEye } from "react-icons/fa";
import SellerAddItemForm from "./SellerAddNewItemForm";
import DetailCard from "../components/DetailCard";
import axios from "axios";

const SellerDashboard = () => {
    const [profitData, setProfitData] = useState([]);
    const [filter, setFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGadget, setSelectedGadget] = useState(null);

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchProfitData = async () => {
            try {
                const ownerId = localStorage.getItem("ownerId");
                const response = await axios.get(`http://localhost:8000/api/v1/items/monthly-profit?ownerId=${ownerId}`);
                setProfitData(response.data);
            } catch (err) {
                console.error("Failed to fetch profit data", err);
            }
        };

        fetchProfitData();
    }, []);

    const fetchSellerItems = async () => {
        try {
            const owner_id = localStorage.getItem("ownerId");
            if (!owner_id) return;

            const response = await axios.get(`http://localhost:8000/api/v1/items/getItemsByOwner/${owner_id}`);
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error.message);
        }
    };

    const rentalData = items.reduce((acc, item) => {
        const existing = acc.find(entry => entry.name === item.name);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: item.name, value: 1 });
        }
        return acc;
    }, []);

    useEffect(() => {
        fetchSellerItems();
    }, []);

    const handleAddItem = async (newItem) => {
        try {
            const owner_id = localStorage.getItem("ownerId");
            const response = await axios.post("http://localhost:8000/api/v1/items/addNewItems", {
                ...newItem,
                price: parseInt(newItem.price.replace(/[^\d]/g, ""), 10),
                ownerId: owner_id, // Use actual ownerId from logged-in user
                status: newItem.availability || "Available", // status from form
                deliveryOption: newItem.deliveryOption || "pickup" // fallback default
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

    const totalProfit = profitData.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div className="bg-gray-50 w-full min-h-screen p-6 text-black">
            <div className="shadow-lg">
                {/* Upper Section */}
                <div className="bg-white p-6 rounded-md grid grid-cols-2 gap-6">
                    {/* Profit Graph */}
                    <div className="flex flex-col bg-gray-100 p-4 rounded-md">
                        <h1 className="text-2xl font-semibold">Profit: ₹{totalProfit}</h1>
                        {totalProfit === 0 && <p className="text-gray-600 text-sm">No rentals yet. Profit data will appear once an item is rented.</p>}
                        <div className="ml-[-18px] mt-3">
                            <ResponsiveContainer width="100%" height={180}>
                                <LineChart data={graphData}>
                                    <XAxis dataKey="name" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }} />
                                    <Line type="monotone" dataKey="value" stroke="#FFCE56" strokeWidth={3} dot={{ fill: "#FFCE56", r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Status Graph */}
                    <div className="flex flex-col bg-gray-100 p-4 rounded-md">
                        <h1 className="text-2xl font-semibold">Status:</h1>
                        <div className="mt-3">
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

            {/* Filter Section */}
            <div className="bg-white p-6 rounded-md shadow-md flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Filter by Status:</h1>
                <div className="flex space-x-6">
                    {["All", "Available", "Rented"].map(status => (
                        <label key={status} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                value={status}
                                checked={filter === status}
                                onChange={() => setFilter(status)}
                                className="form-radio text-blue-500 h-5 w-5"
                            />
                            <span className="text-gray-700">{status}</span>
                        </label>
                    ))}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                    <FaPlus />
                    Add New Item
                </button>
            </div>

            {/* Item Cards */}
            <div className="grid grid-cols-4 gap-6 mt-6">
                {filteredItems.map((item, index) => (
                    <div key={item.id || index} className="relative bg-white p-6 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 border border-gray-300 hover:border-blue-500 hover:shadow-2xl">
                        {/* Status Indicator */}
                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${getStatusColor(item.status)} animate-pulse`}></div>

                        {/* Gadget Thumbnail */}
                        <div className="relative overflow-hidden rounded-lg">
                            <img src={item.images?.[0] || item.img} alt={item.name} className="w-full h-40 object-cover rounded-md transition-transform duration-300 group-hover:scale-105" />
                        </div>

                        {/* Item Details */}
                        <p className="text-gray-900 font-bold text-lg mt-4">{item.name}</p>
                        <p className="text-gray-800 font-semibold mt-2">Price: ₹{item.price}</p>
                        <p className="text-gray-800 font-semibold ">Requests: ₹{item.requests}</p>
                        <p className="text-gray-600">Status: <span className="font-semibold">{item.status}</span></p>

                        {/* View Details Button */}
                        <button
                            onClick={() => setSelectedGadget(item)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                            <FaEye />
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && <SellerAddItemForm onClose={() => setIsModalOpen(false)} onSubmit={handleAddItem} />}
            {selectedGadget && <DetailCard gadget={selectedGadget} onClose={() => setSelectedGadget(null)} />}
        </div>
    );
};

export default SellerDashboard;