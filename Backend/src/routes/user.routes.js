import { Router } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import zod from "zod";

const router = Router();

// ✅ Validation schema
const signupSchema = zod.object({
    fullName: zod.string().min(3, "Full name must be at least 3 characters"),
    email: zod.string().email("Invalid email format"),
    password: zod.string().min(6, "Password must be at least 6 characters")
        .regex(/^[a-zA-Z0-9]*$/, "Password must be alphanumeric"),
    role: zod.enum(["buyer", "seller"])
});

// ✅ Signup API
router.post("/signup", async (req, res) => {
    const response = signupSchema.safeParse(req.body);
    if (!response.success) {
        return res.status(400).json({ message: "Invalid input", errors: response.error.errors });
    }

    try {
        const { fullName, email, password, role } = req.body;

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        // ✅ Create a new user (password hashing handled in pre-save hook)
        const newUser = new User({ fullName, email, password, role });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully. Please login.",
        });

    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});

// ✅ Login API
router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // ✅ Validate user input
        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // ✅ Compare password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // ✅ Check if role matches the one user signed up with
        if (user.role !== role) {
            return res.status(403).json({ message: "Role mismatch! Please select the correct role." });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWTPRIVATEKEY,
            { expiresIn: "1h" }
        );

        // ✅ Send response with token & role
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            ownerId: user._id ,
            role: user.role
        });

    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

export default router;
