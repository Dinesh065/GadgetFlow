import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const markPaymentDone = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${API_BASE_URL}/items/mark-paid/${itemId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Payment Successful!");
        navigate("/orders");
      } catch (err) {
        toast.error("Failed to update payment status.");
        console.error(err);
      }
    };

    markPaymentDone();
  }, [itemId, navigate]);

  return <div className="pt-20 text-center text-xl">Processing Payment...</div>;
};

export default PaymentSuccess;
