import React, { useEffect, useState } from "react";
import axios from "axios";
import StripeSetupNotice from "./StripeSetupNotice";
import { API_BASE_URL } from "../config";

const SetupStripe = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/stripe/onboarding-url`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrl(res.data.url);
      } catch (err) {
        console.error("Failed to fetch onboarding URL:", err);
      }
    };

    fetchUrl();
  }, []);

  return (
    <>
      {url ? <StripeSetupNotice stripeSetupUrl={url} /> : <div className="text-center mt-20 text-lg">Loading setup info...</div>}
    </>
  );
};

export default SetupStripe;
