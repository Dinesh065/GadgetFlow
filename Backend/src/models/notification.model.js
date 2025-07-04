// const notificationSchema = new mongoose.Schema({
//   userId: { type: String, required: true }, // recipient user ID
//   message: { type: String, required: true },
//   type: { type: String, required: true }, // e.g. 'order', 'message'
//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
// });

// const Notification = mongoose.model('Notification', notificationSchema);

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
  message: { type: String, required: true },
  type: { type: String, enum: ["info", "payment", "delivery", "return", "overdue", "system"], default: "info" },
  link: { type: String }, // Optional: can redirect user to a specific route
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model("Notification", notificationSchema);
