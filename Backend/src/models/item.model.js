import mongoose from "mongoose";

// Validation function for minimum images
function arrayLimit(val) {
    return val.length >= 3;
}

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    images: {
        type: [String],
        validate: [arrayLimit, "You must provide at least 3 images"],
        required: true
    },
    price: { type: Number, required: true },

    status: {
        type: String,
        enum: ["Available", "Requested", "Accepted", "Paid", "Rented", "Returned"],
        default: "Available"
    },

    requests: [{
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
        requestedAt: { type: Date, default: Date.now }
    }],
    days_for_rent: {
        type: Number,
        required: true,
        default: 1
    },// Defined by seller
    rentalDate: { type: Date, default: null },  // Set when payment done
    dueDate: { type: Date, default: null },     // Auto calculated: rentalDate + daysForRent

    renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    category: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    deliveryOptions: {
        pickup: { type: Boolean, default: true },
        delivery: { type: Boolean, default: false },
        deliveryCost: { type: Number, default: 0 }
    },

    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    warningSentAt: { type: Date, default: null },
    actionTaken: { type: Boolean, default: false }

}, { timestamps: true });


itemSchema.pre('validate', function (next) {
    const { delivery, deliveryCost } = this.deliveryOptions || {};

    if (delivery && (!deliveryCost || deliveryCost <= 0)) {
        return next(new Error("Delivery cost must be greater than 0 if delivery is selected"));
    }

    if (!delivery && deliveryCost > 0) {
        return next(new Error("Delivery cost must be 0 if delivery is not selected"));
    }

    next();
});


export const Item = mongoose.model("Item", itemSchema);

// import mongoose from "mongoose";

// // Validation function for minimum images
// function arrayLimit(val) {
//     return val.length >= 3;
// }

// const itemSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     images: {
//         type: [String],
//         validate: [arrayLimit, "You must provide at least 3 images"],
//         required: true
//     },
//     price: { type: Number, required: true },
//     status: { type: String, enum: ["Available", "Rented"], default: "Available" },
//     requests: { type: Number, default: 0 },
//     rentalDate: { type: Date, default: null },
//     daysForRent: { type: Number, default: 1 }, // ⬅️ NEW FIELD
//     renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//     category: { type: String, required: true },
//     description: { type: String },
//     location: { type: String, required: true },
//     deliveryOption: {
//         type: String,
//         enum: ["Pickup", "Delivery"],
//         required: true
//     },
//     deliveryCost: {
//         type: Number,
//         default: 0,
//         validate: {
//             validator: function (val) {
//                 return this.deliveryOption === "Delivery" ? val > 0 : val === 0;
//             },
//             message: "Delivery cost must be greater than 0 if delivery option is 'Delivery'"
//         }
//     },
//     ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     // Additional fields for overdue system
//     warningSentAt: { type: Date, default: null },
//     actionTaken: { type: Boolean, default: false }

// }, { timestamps: true });

// export const Item = mongoose.model("Item", itemSchema);
