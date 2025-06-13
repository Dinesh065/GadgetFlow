import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//     {
//         fullName: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         email: {
//             type: String,
//             required: true,
//             lowercase: true,
//             unique: true,
//             trim: true
//         },
//         password: {
//             type: String,
//             required: true,
//         },
//         role: {
//             type: String,
//             enum: ["buyer", "seller"],
//             required: true
//         },
//         createdAt: {
//             type: Date,
//             default: Date.now(),
//         },
//     },
//     { timestamps: true }
// );

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      required: true,
    },

    // 🆕 Seller-specific fields
    contactNumber: {
      type: String,
      // required: function () {
      //   return this.role === "seller";
      // },
    },
    alternateContact: {
      type: String,
    },
    address: {
      type: String,
      // required: function () {
      //   return this.role === "seller";
      // },
    },
    pickupLocation: {
      type: String,
    },
    aadhaarDoc: {
      type: String, // Store file path or public URL
      default: null,
    },
    bio: {
      type: String,
    },
    profileImage: {
      type: String, // Store file path or public URL
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

export const User = mongoose.model("User", userSchema);
