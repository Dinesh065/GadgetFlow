import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/user.routes.js'
import dotenv from "dotenv"
dotenv.config();

const app = express()

const corsOptions = {
    origin: process.env.CORS_ORIGIN,  
    credentials: false,  
};

app.use(cors(corsOptions))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.use("/api/v1/users",userRouter) 
export { app }