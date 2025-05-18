import mongoose from "mongoose";

// Validation function for minimum images
function arrayLimit(val) {
    return val.length >= 3;
}

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Item name
    images: {
        type: [String],
        validate: [arrayLimit, "You must provide at least 3 images"],
        required: true
    }, // Array of image URLs (Min: 3)
    price: { type: Number, required: true }, // Rental price per day
    status: { type: String, enum: ["Available", "Rented"], default: "Available" },
    requests: { type: Number, default: 0 },
    rentalDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    category: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    deliveryOption: {
        type: String,
        enum: ["Pickup", "Delivery"],
        required: true
    },
    deliveryCost: {
        type: Number,
        default: 0,
        validate: {
            validator: function (val) {
                return this.deliveryOption === "Delivery" ? val > 0 : val === 0;
            },
            message: "Delivery cost must be greater than 0 if delivery option is 'Delivery'"
        }
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const Item = mongoose.model("Item", itemSchema);
