import React, { useEffect, useState } from "react";
import { FaBell, FaComments, FaExclamationTriangle } from "react-icons/fa";
import NotificationPanel from "./NotificationPanel";
import ChatPanel from "./ChatPanel";
import AlertPanel from "./AlertPanel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import dayjs from "dayjs";

const FloatingIcons = () => {
    const navigate = useNavigate();
    const [openPanel, setOpenPanel] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(3);
    const [alerts, setAlerts] = useState([]);

    const togglePanel = (panelType) => {
        setOpenPanel((prev) => (prev === panelType ? null : panelType));
    };

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_BASE_URL}/buyers/accepted-orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const pendingPayments = res.data.filter(order => {
                    const acceptedAt = dayjs(order.acceptedAt);
                    return !order.paymentDone && dayjs().diff(acceptedAt, "hour") < 24;
                });

                setAlerts(pendingPayments);
            } catch (err) {
                console.error("Failed to fetch alerts", err);
            }
        };

        fetchAlerts();
    }, []);

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

                {/* 🔔 Alert Button (top) */}
                <div className="relative">
                    <button
                        className="bg-red-600 text-white p-4 rounded-full shadow-xl hover:bg-red-700 transition"
                        onClick={() => togglePanel("alerts")}
                        title="Payment Alerts"
                    >
                        <FaExclamationTriangle size={22} />
                        {alerts.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                                {alerts.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* 💬 Chat Button */}
                <div className="relative">
                    <button
                        className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition"
                        onClick={() => togglePanel("chat")}
                        title="Customer Chat"
                    >
                        <FaComments size={22} />
                        {unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                                {unreadMessages}
                            </span>
                        )}
                    </button>
                </div>

                {/* 🛎 Notifications Button */}
                <div className="relative">
                    <button
                        className="bg-yellow-500 text-white p-4 rounded-full shadow-xl hover:bg-yellow-600 transition"
                        onClick={() => togglePanel("notifications")}
                        title="Notifications"
                    >
                        <FaBell size={22} />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                                {notifications.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Panels */}
            {openPanel === "alerts" && (
                <AlertPanel
                    alerts={alerts}
                    onClose={() => setOpenPanel(null)}
                    onPay={(order) =>
                        navigate(`/checkout/${order.productId}`, { state: { order } })
                    }
                    onClear={() => setAlerts([])}
                />
            )}
            {openPanel === "chat" && (
                <ChatPanel
                    unreadMessages={unreadMessages}
                    onClose={() => setOpenPanel(null)}
                    markMessagesRead={() => setUnreadMessages(0)}
                />
            )}
            {openPanel === "notifications" && (
                <NotificationPanel
                    notifications={notifications}
                    onClose={() => setOpenPanel(null)}
                />
            )}
        </>
    );
};

export default FloatingIcons;

// import React, { useState } from 'react';
// import { FaBell, FaComments } from 'react-icons/fa';
// import NotificationPanel from './NotificationPanel';

// const FloatingIcons = () => {
//     const [openPanel, setOpenPanel] = useState(null);
//     const [notifications, setNotifications] = useState([
//         { id: 1, message: "Order #123 confirmed" },
//         { id: 2, message: "New message from support" }
//     ]);

//     const handleChatClick = () => {
//         setOpenPanel(null); // Close notifications if open
//         if (window.Tawk_API?.maximize) {
//             window.Tawk_API.maximize(); // 🔥 Open Tawk.to chat
//         }
//     };

//     return (
//         <>
//             <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
//                 {/* Chat Icon */}
//                 <div className="relative">
//                     <button
//                         className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition"
//                         onClick={handleChatClick}
//                         title="Customer Chat"
//                     >
//                         <FaComments size={22} />
//                     </button>
//                 </div>

//                 {/* Notifications Icon */}
//                 <div className="relative">
//                     <button
//                         className="bg-yellow-500 text-white p-4 rounded-full shadow-xl hover:bg-yellow-600 transition"
//                         onClick={() => setOpenPanel(prev => prev === 'notifications' ? null : 'notifications')}
//                         title="Notifications"
//                     >
//                         <FaBell size={22} />
//                         {notifications.length > 0 && (
//                             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
//                                 {notifications.length}
//                             </span>
//                         )}
//                     </button>
//                 </div>
//             </div>

//             {/* Notification Panel */}
//             {openPanel === 'notifications' && (
//                 <NotificationPanel
//                     notifications={notifications}
//                     onClose={() => setOpenPanel(null)}
//                 />
//             )}
//         </>
//     );
// };

// export default FloatingIcons;
