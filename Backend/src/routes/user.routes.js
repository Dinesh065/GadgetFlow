import { Router } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import zod from "zod";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const router = Router();
import fs from "fs";

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
            ownerId: user._id,
            role: user.role
        });

    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

router.get('/fetchProfileData', verifyJWT, async (req, res) => {
    try {
        // `req.user` must be set by your auth middleware
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("fullName profileImage");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            fullName: user.fullName,
            profileImage: user.profileImage || "/images/defaultProfile.png", // fallback
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/profile/fetchProfileData", verifyJWT, async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.post(
    "/profile/update",
    verifyJWT,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "aadhaarDoc", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const user = await User.findById(req.user._id);

            if (!user) return res.status(404).json({ message: "User not found" });

            // Update basic text fields
            const fields = [
                "fullName",
                "contactNumber",
                "alternateContact",
                "address",
                "pickupLocation",
                "bio",
            ];
            fields.forEach((field) => {
                if (req.body[field]) user[field] = req.body[field];
            });

            // Password change
            const { newPassword, confirmPassword } = req.body;

            if (newPassword && confirmPassword) {
                if (newPassword !== confirmPassword) {
                    return res.status(400).json({ message: "Passwords do not match" });
                }
                // const salt = await bcrypt.genSalt(10);
                // user.password = await bcrypt.hash(newPassword, salt);
                user.password = newPassword; 
            }

            // Handle file uploads to Cloudinary
            const uploads = {};

            const uploadField = async (fieldName) => {
                try {
                    if (req.files?.[fieldName]?.[0]) {
                        const file = req.files[fieldName][0];
                        const result = await uploadOnCloudinary(file.path);
                        if (result?.secure_url) {
                            uploads[fieldName] = result.secure_url;
                            fs.unlinkSync(file.path);
                        }
                    }
                } catch (error) {
                    console.error(`Failed to upload ${fieldName}:`, error);
                }
            };


            await uploadField("profileImage");
            await uploadField("aadhaarDoc");

            // Set uploaded URLs
            if (uploads.profileImage) user.profileImage = uploads.profileImage;
            if (uploads.aadhaarDoc) user.aadhaarDoc = uploads.aadhaarDoc;

            await user.save();

            res.status(200).json({ message: "Profile updated successfully" });
        } catch (err) {
            console.error("Profile update error:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.delete("/profile/remove-aadhaar", verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.aadhaarDoc) {
            return res.status(404).json({ message: "Document not found" });
        }

        user.aadhaarDoc = null;
        await user.save();

        res.status(200).json({ message: "Aadhaar document removed" });
    } catch (err) {
        console.error("Aadhaar remove error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
//For getting address of user profile for 'use default address' in add item form
router.get("/profile/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ address: user.address || null });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching user profile", error: err.message });
    }
});

router.get("/checkOutPage/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("fullName contactNumber email address pickupLocation profileImage")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
