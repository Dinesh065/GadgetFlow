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
        console.log("Accept clicked for", reqId); // 🔍 Debug
        if (typeof onAccept === "function") {
            await onAccept(reqId, itemId);
        }
    };

    return (
        <>
            {/* Outer Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] relative overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-gray-500 hover:text-black"
                    >
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Buyer Requests</h2>

                    <div className="overflow-y-auto max-h-[70vh] pr-1 sm:pr-2 space-y-3">
                        {sortedRequests.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-500 text-center py-8">
                                No buyer requests yet.
                            </div>
                        ) : (
                            sortedRequests.map((req, idx) => {
                                const buyer = req.buyerId;
                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={buyer?.profileImage || "/default-avatar.png"}
                                                alt="buyer"
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <p className="font-medium truncate max-w-[140px] sm:max-w-[120px]">
                                                {buyer?.fullName || "Unknown"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                            <button
                                                onClick={() => handleAccept(req._id)}
                                                className={`text-sm px-3 py-1 rounded-md font-medium whitespace-nowrap ${req.status === "Accepted"
                                                    ? "bg-green-500 text-white"
                                                    : req.status === "Rejected"
                                                        ? "bg-red-400 text-white"
                                                        : "bg-gray-200 hover:bg-green-500 hover:text-white"
                                                    }`}
                                                disabled={req.status !== "Requested"}
                                            >
                                                {req.status === "Accepted"
                                                    ? "Accepted"
                                                    : req.status === "Rejected"
                                                        ? "Rejected"
                                                        : "Accept"}
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
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Inner Modal for request details */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2">
                    <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md relative shadow-xl max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-black"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Request Details</h3>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                            <img
                                src={selectedRequest.buyerId?.profileImage || "/default-avatar.png"}
                                alt="buyer"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="text-center sm:text-left">
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

                        <p className="text-sm"><strong>Address:</strong> {selectedRequest.buyerId?.address || "Not available"}</p>
                        <p className="text-sm"><strong>Message:</strong> {selectedRequest.message || "No message provided."}</p>
                        <p className="text-sm"><strong>Status:</strong> {selectedRequest.status}</p>
                        <p className="text-sm"><strong>Requested At:</strong> {new Date(selectedRequest.requestedAt).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default BuyerRequestsModal;
