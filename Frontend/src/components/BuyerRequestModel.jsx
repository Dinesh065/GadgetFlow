import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const BuyerRequestsModal = ({ requests = [], onClose }) => {
    const [selectedRequest, setSelectedRequest] = useState(null);

    const sortedRequests = [...requests].sort(
        (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt)
    );

    return (
        <>
            {/* Outer Modal */}
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] h-[400px] relative">
                    <button onClick={onClose} className="absolute top-3 right-4 text-gray-500 hover:text-black">
                        <FaTimes size={20} />
                    </button>
                    <h2 className="text-xl font-bold mb-4">Buyer Requests</h2>

                    <div className="overflow-y-auto h-[310px] pr-2">
                        {sortedRequests.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                No buyer requests yet.
                            </div>
                        ) : (
                            sortedRequests.map((req, idx) => (
                                <div key={idx} className="flex items-center gap-4 border-b pb-2 mb-2">
                                    <img
                                        src={req.buyerImage}
                                        alt="buyer"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium">{req.buyerName}</p>
                                    </div>
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => setSelectedRequest(req)}
                                    >
                                        View
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Inner Modal for request details */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                    <div className="bg-white p-6 rounded-lg w-[400px] relative shadow-xl">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-black"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h3 className="text-lg font-bold mb-4">Request Details</h3>
                        <p><strong>Name:</strong> {selectedRequest.buyerName}</p>
                        <p><strong>Message:</strong> {selectedRequest.message}</p>
                        <p><strong>Status:</strong> {selectedRequest.status}</p>
                        <p><strong>Requested At:</strong> {new Date(selectedRequest.requestedAt).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default BuyerRequestsModal;
