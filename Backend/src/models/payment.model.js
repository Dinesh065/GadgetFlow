import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Make sure you have a User model
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Paid",
  },
  deliveryType: {
    type: String, // like "Pickup" or "Delivery"
  },
  stripePaymentId: {
    type: String,
  },
});

const PaymentModel = mongoose.model("Payment", paymentSchema);
export default PaymentModel;
