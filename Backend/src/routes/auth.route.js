// ✅ auth.routes.js
import express from "express";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";

const router = express.Router();
const OTP_STORE = new Map();

// POST /auth/send-otp
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  OTP_STORE.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"GadgetFlow Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Password Reset OTP",
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
  });

  res.json({ message: "OTP sent" });
});

// POST /auth/verify-otp
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = OTP_STORE.get(email);

  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified" });
});

// POST /auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = OTP_STORE.get(email);

  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });
  OTP_STORE.delete(email);

  res.json({ message: "Password reset successful" });
});

export default router;
