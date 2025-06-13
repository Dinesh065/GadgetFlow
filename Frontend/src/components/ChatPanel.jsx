import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ChatPanel = ({ onClose, unreadMessages, markMessagesRead }) => {
    useEffect(() => {
        markMessagesRead(); // clear unread badge on open
    }, []);

    return (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white border rounded-lg shadow-2xl p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Customer Support</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-red-500">
                    <FaTimes />
                </button>
            </div>
            <div className="text-sm mb-3 text-gray-600">How can we help you today?</div>
            <textarea
                className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:border-blue-500"
                rows={3}
                placeholder="Type your message..."
            />
            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full">
                Send Message
            </button>
        </div>
    );
};

export default ChatPanel;
