// ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const startCooldown = () => {
    let timeLeft = 30;
    setCooldown(timeLeft);
    const interval = setInterval(() => {
      timeLeft--;
      setCooldown(timeLeft);
      if (timeLeft <= 0) clearInterval(interval);
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/send-otp`, { email });
      toast.success("OTP sent to email");
      setStep(2);
      startCooldown();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp });
      toast.success("OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("Enter new password");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, { email, otp, newPassword });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-20 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-4 py-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            disabled={loading || cooldown > 0}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border px-4 py-2 mb-4 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border px-4 py-2 mb-4 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
