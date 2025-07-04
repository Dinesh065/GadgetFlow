import React from "react";
import { useNavigate } from "react-router-dom";

const StripeSetupNotice = ({ stripeSetupUrl }) => {
  const navigate = useNavigate();

  const handleStartSetup = () => {
    window.location.href = stripeSetupUrl; // redirect to Stripe onboarding
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Setup Your Stripe Payout Account</h2>
        <p className="text-gray-600 mb-4">
          To receive payments for your rentals, Stripe needs to verify your identity. This is a one-time setup required by law and ensures your payments are secure.
        </p>
        <ul className="text-left text-sm text-gray-700 mb-6 list-disc pl-5">
          <li>Your information stays secure with Stripe</li>
          <li>Only required once</li>
          <li>Takes just 2-3 minutes to complete</li>
        </ul>
        <button
          onClick={handleStartSetup}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition"
        >
          Continue to Stripe
        </button>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default StripeSetupNotice;
