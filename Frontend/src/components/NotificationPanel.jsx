import React from 'react';
import { FaTimes } from 'react-icons/fa';

const NotificationPanel = ({ notifications, onClose }) => {
    return (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white border rounded-lg shadow-2xl p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Notifications</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                    <FaTimes />
                </button>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto text-sm text-gray-700">
                {notifications.length === 0 ? (
                    <li className="text-gray-500 italic">No new notifications</li>
                ) : (
                    notifications.map((n) => (
                        <li key={n.id} className="border-b pb-1">{n.message}</li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default NotificationPanel;
