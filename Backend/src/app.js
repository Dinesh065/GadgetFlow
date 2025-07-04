import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/user.routes.js'
import dotenv from "dotenv"
import itemRoutes from "./routes/item.route.js";
import overdueRoutes from "./routes/overdue.route.js";
import rentalRoutes from "./routes/rental.route.js";
import buyerRoutes from "./routes/buyer.routes.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import paymentRoutes from "./routes/payment.route.js";
import webhookRoutes from "./routes/webhook.route.js";
import stripeConnectRoutes from "./routes/stripeConnect.route.js";
// import noti from "./routes/notification.route.js";
dotenv.config();

const app = express()

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "*",  
    credentials: false,  
};

app.use(cors(corsOptions))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/users",userRouter) 
app.use("/api/v1/items",itemRoutes) 
app.use("/api/v1/item_overdues",overdueRoutes) 
app.use("/api/v1/rentals",rentalRoutes) 
app.use("/api/v1/buyers",buyerRoutes)
app.use("/api/v1/wishlist",wishlistRoutes)
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/webhook", webhookRoutes);
app.use("/api/v1/stripe", stripeConnectRoutes);
// app.use("/api/v1/notifications",noti) 
export { app }