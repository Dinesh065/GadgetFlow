import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const BuyerRequestsModal = ({ itemId, requests = [], onClose, onAccept }) => {
    const [selectedRequest, setSelectedRequest] = useState(null);

    const sortedRequests = [...requests].sort((a, b) => {
        if (a.status === "Accepted") return -1;
        if (b.status === "Accepted") return 1;
        return new Date(a.requestedAt) - new Date(b.requestedAt);
    });

    const handleAccept = async (reqId) => {
        if (typeof onAccept === "function") {
            await onAccept(reqId, itemId); // ✅ pass itemId
        }
    };
    return (
        <>
            {/* Outer Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-[600px] h-[450px] relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-gray-500 hover:text-black"
                    >
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-xl font-bold mb-4">Buyer Requests</h2>

                    <div className="overflow-y-auto h-[360px] pr-2 space-y-2">
                        {sortedRequests.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No buyer requests yet.
                            </div>
                        ) : (
                            sortedRequests.map((req, idx) => {
                                const buyer = req.buyerId;
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between gap-2 border-b pb-2 mb-1"
                                    >
                                        <div className="flex items-center gap-3 min-w-[180px]">
                                            <img
                                                src={buyer?.profileImage || "/default-avatar.png"}
                                                alt="buyer"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <p className="font-medium truncate max-w-[120px]">
                                                {buyer?.fullName || "Unknown"}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleAccept(req._id)}
                                            className={`text-sm px-3 py-1 rounded-md font-medium ${req.status === "Accepted"
                                                    ? "bg-green-500 text-white"
                                                    : req.status === "Rejected"
                                                        ? "bg-red-400 text-white"
                                                        : "bg-gray-200 hover:bg-green-500 hover:text-white"
                                                }`}
                                            disabled={req.status !== "Pending"}
                                        >
                                            {req.status === "Accepted" ? "Accepted" : req.status === "Rejected" ? "Rejected" : "Accept"}
                                        </button>

                                        <p className={`text-sm w-[80px] text-center ${req.status === "Accepted"
                                            ? "text-green-600"
                                            : req.status === "Rejected"
                                                ? "text-red-500"
                                                : "text-gray-600"
                                            }`}>
                                            {req.status}
                                        </p>

                                        <button
                                            className="text-blue-600 hover:underline text-sm"
                                            onClick={() => setSelectedRequest(req)}
                                        >
                                            View
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Inner Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white p-6 rounded-lg w-[400px] relative shadow-xl">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-black"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Request Details</h3>

                        <div className="flex items-center gap-4 mb-3">
                            <img
                                src={selectedRequest.buyerId?.profileImage || "/default-avatar.png"}
                                alt="buyer"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">
                                    {selectedRequest.buyerId?.fullName || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {selectedRequest.buyerId?.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                    📞 {selectedRequest.buyerId?.contactNumber || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <p><strong>Address:</strong> {selectedRequest.buyerId?.address || "Not available"}</p>
                        <p><strong>Message:</strong> {selectedRequest.message || "No message provided."}</p>
                        <p><strong>Status:</strong> {selectedRequest.status}</p>
                        <p><strong>Requested At:</strong> {new Date(selectedRequest.requestedAt).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default BuyerRequestsModal;
