import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config"; // make sure your base URL is correct
import toast from "react-hot-toast";

const OnboardStripe = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const onboardSeller = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in");
          return navigate("/login");
        }

        // Step 1: Create Stripe account (only once)
        await axios.post(`${API_BASE_URL}/stripe/create-account`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Step 2: Get onboarding link
        const { data } = await axios.post(`${API_BASE_URL}/stripe/onboard`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Step 3: Redirect to Stripe onboarding
        window.location.href = data.url;
      } catch (error) {
        console.error(error);
        toast.error("Failed to onboard with Stripe");
      }
    };

    onboardSeller();
  }, [navigate]);

  return (
    <div className="pt-20 text-center text-xl">
      Redirecting to Stripe onboarding...
    </div>
  );
};

export default OnboardStripe;
