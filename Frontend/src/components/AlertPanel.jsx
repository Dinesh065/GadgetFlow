import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const AlertPanel = ({ alerts = [], onClose, onPay }) => {
    const navigate = useNavigate();

    // Disable background scroll when panel is open
    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    const processedAlerts = alerts
        .filter(alert => alert.acceptedAt && !alert.paymentDone)
        .map((alert) => {
            const expiresAt = dayjs(alert.acceptedAt).add(24, "hour");
            const now = dayjs();
            const timeLeft = expiresAt.diff(now) > 0 ? expiresAt.diff(now) : 0;

            return {
                id: alert._id,
                name: alert.name,
                timeLeft,
                paymentDone: alert.paymentDone,
                productId: alert.productId,
            };
        });

    const formatTimeLeft = (ms) => {
        const dur = dayjs.duration(ms);
        const h = String(Math.floor(dur.asHours())).padStart(2, "0");
        const m = String(dur.minutes()).padStart(2, "0");
        const s = String(dur.seconds()).padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    const handlePayNow = (alert) => {
        onPay?.(alert); // call onPay only if provided
        onClose?.();
    };

    return (
        <div className="fixed top-0 right-0 h-full w-full sm:w-[360px] bg-white border-l border-gray-200 z-50 shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-bold">Alerts</h2>
                <button
                    className="text-gray-600 hover:text-black text-xl font-bold"
                    onClick={onClose}
                >
                    ×
                </button>
            </div>

            <div className="p-4">
                {processedAlerts.length === 0 ? (
                    <div className="text-center text-gray-600">No pending alerts 🚀</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {processedAlerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="p-4 border-l-4 border-red-500 bg-red-50 rounded-md shadow"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="text-red-500" size={20} />
                                    <span className="font-semibold">Payment Reminder</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">
                                    Please pay for{" "}
                                    <span className="font-semibold text-black">{alert.name}</span>{" "}
                                    within 24 hours.
                                </p>
                                <p className="text-orange-600 text-sm font-mono mb-2">
                                    Time left: {formatTimeLeft(alert.timeLeft)}
                                </p>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handlePayNow(alert)} 
                                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertPanel;
