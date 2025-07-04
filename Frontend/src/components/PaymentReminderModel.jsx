import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const PaymentReminderModal = ({ order, onClose, onPay }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const acceptedAt = dayjs(order.acceptedAt); // e.g., 2024-06-27T14:00:00.000Z
        const expiresAt = acceptedAt.add(24, "hour");

        const updateCountdown = () => {
            const now = dayjs();
            const diffInMs = expiresAt.diff(now);

            if (diffInMs <= 0) {
                setTimeLeft("00:00:00");
                clearInterval(interval); // stop the timer
                return;
            }

            const duration = dayjs.duration(diffInMs);
            const hours = Math.floor(duration.asHours());
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            setTimeLeft(
                `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [order.acceptedAt]);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[420px] relative border-2 border-red-600">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
                >
                    ×
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-red-600" size={28} />
                    <h2 className="text-xl font-bold text-red-600">Payment Reminder</h2>
                </div>

                <p className="text-gray-800 mb-2 leading-relaxed">
                    Your rental request for{" "}
                    <span className="font-semibold text-black">{order.name}</span> has been
                    <span className="text-green-600 font-semibold"> accepted</span>.
                </p>
                <p className="text-gray-700 mb-4">
                    Please complete the payment within{" "}
                    <span className="font-semibold text-red-500">24 hours</span> to confirm your rental.
                </p>

                <div className="text-center text-lg font-bold text-orange-600 mb-4">
                    Time left to pay:{" "}
                    <span className="font-mono">{timeLeft}</span>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onPay}
                        className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 font-semibold shadow"
                    >
                        Pay Now
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-5 py-2 rounded hover:bg-gray-400 font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentReminderModal;
