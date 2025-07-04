import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dayjs from "dayjs";
import { Item } from "../models/item.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ On payment success
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { itemId, buyerId, deliveryType } = session.metadata;

      try {
        const item = await Item.findById(itemId);
        if (!item) throw new Error("Item not found");

        const today = dayjs();
        const rentalDate = today.add(1, "day").toDate(); // start from next day
        const dueDate = today.add(item.days_for_rent + 1, "day").toDate();

        // 🛠️ Update only the accepted request
        const updatedRequests = item.requests.map((req) => {
          if (
            req.buyerId.toString() === buyerId &&
            req.status === "Accepted"
          ) {
            return {
              ...req.toObject(),
              paymentDone: true,
              acceptedAt: req.acceptedAt || new Date(),
            };
          }
          return req;
        });

        item.requests = updatedRequests;
        item.status = "Rented";
        item.renter = buyerId;
        item.rentalDate = rentalDate;
        item.dueDate = dueDate;

        await item.save();

        // 🚀 OPTIONAL: Notify seller
        const seller = await User.findById(item.ownerId);
        console.log(
          `🔔 Seller ${seller.fullName} notified: Payment completed for "${item.name}"`
        );

        res.status(200).json({ received: true });
      } catch (err) {
        console.error("Webhook DB update error:", err.message);
        res.status(500).send("Failed to update item");
      }
    } else {
      res.status(200).json({ received: true });
    }
  }
);

export default router;
