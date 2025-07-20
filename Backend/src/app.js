import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userRouter from './routes/user.routes.js';
import itemRoutes from "./routes/item.route.js";
import overdueRoutes from "./routes/overdue.route.js";
import rentalRoutes from "./routes/rental.route.js";
import buyerRoutes from "./routes/buyer.routes.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import deliveryRoutes from "./routes/delivery.route.js";
import authRoutes from "./routes/auth.route.js";
import paymentRoutes from "./routes/payment.route.js";
import webhookRoutes from "./routes/webhook.route.js"; // 👈
import stripeConnectRoutes from "./routes/stripeConnect.route.js";

// Load .env
dotenv.config();

const app = express();

// ✅ Mount webhook BEFORE using express.json()
app.use("/api/v1/webhook", webhookRoutes);

// CORS and other middlewares
const corsOptions = {
  origin: "https://gadget-flow-fjo9.vercel.app",
  // origin: '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" })); // 👈 this should come AFTER webhook
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Other routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/item_overdues", overdueRoutes);
app.use("/api/v1/rentals", rentalRoutes);
app.use("/api/v1/buyers", buyerRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/delivery", deliveryRoutes)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/stripe", stripeConnectRoutes);
// app.use("/api/v1/notifications", noti);

export { app };
