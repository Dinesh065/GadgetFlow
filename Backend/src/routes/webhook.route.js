// import express from "express";
// import Stripe from "stripe";
// import bodyParser from "body-parser";
// import dayjs from "dayjs";
// import { Item } from "../models/item.model.js";
// import { User } from "../models/user.model.js";

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // This MUST be raw, not JSON
// router.post(
//   "/webhook",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     // console.log("✅ Stripe Webhook Triggered");

//     const sig = req.headers["stripe-signature"];
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(
//         req.body, // this is raw buffer
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );
//     } catch (err) {
//       console.error("⚠️ Webhook signature error:", err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;
//       const { itemId, buyerId, deliveryType } = session.metadata;

//       try {
//         const item = await Item.findById(itemId);
//         if (!item) throw new Error("Item not found");

//         const today = dayjs();
//         const rentalDate = today.add(1, "day").toDate();
//         const dueDate = today.add(item.days_for_rent + 1, "day").toDate();

//         item.requests = item.requests.map((req) => {
//           if (
//             req.buyerId.toString() === buyerId &&
//             req.status === "Accepted"
//           ) {
//             return {
//               ...req.toObject(),
//               paymentDone: true,
//               acceptedAt: req.acceptedAt || new Date(),
//               deliveryType: deliveryType, // ✅ will be saved
//             };
//           }
//           return req;
//         });

//         item.status = "Rented";
//         item.renter = buyerId;
//         item.rentalDate = rentalDate;
//         item.dueDate = dueDate;

//         await item.save();

//         const saved = await Item.findById(itemId).lean();
//         const matched = saved.requests.find(r => r.buyerId.toString() === buyerId);
//         // console.log("✅ Final deliveryType in DB:", matched?.deliveryType);

//         const seller = await User.findById(item.ownerId);
//         console.log(
//           `🔔 Seller ${seller.fullName} notified: Payment completed for "${item.name}"`
//         );

//         res.status(200).json({ received: true });
//       } catch (err) {
//         console.error("Webhook DB update error:", err.message);
//         res.status(500).send("Failed to update item");
//       }
//     } else {
//       res.status(200).json({ received: true });
//     }
//   }
// );

// export default router;


import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dayjs from "dayjs";
import { Item } from "../models/item.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This MUST be raw, not JSON
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    // console.log("✅ Stripe Webhook Triggered");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, // this is raw buffer
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { itemId, buyerId, deliveryType } = session.metadata;

      try {
        const item = await Item.findById(itemId);
        if (!item) throw new Error("Item not found");

        const amountPaid = session.amount_total / 100; // 🟢 in INR

        item.totalPaid = amountPaid; // ✅ save the amount actually paid
        item.status = "Rented";
        item.renter = buyerId;
        item.rentalDate = dayjs().add(1, "day").toDate();
        item.dueDate = dayjs().add(item.days_for_rent + 1, "day").toDate();

        item.requests = item.requests.map((req) => {
          if (
            req.buyerId.toString() === buyerId &&
            req.status === "Accepted"
          ) {
            return {
              ...req.toObject(),
              paymentDone: true,
              acceptedAt: req.acceptedAt || new Date(),
              deliveryType: deliveryType,
            };
          }
          return req;
        });

        await item.save();
          
        const seller = await User.findById(item.ownerId);
        console.log(`💰 Payment success: ₹${amountPaid} for item "${item.name}"`);

        res.status(200).json({ received: true });
      } catch (err) {
        console.error("Webhook DB update error:", err.message);
        res.status(500).send("Failed to update item");
      }
    }
    else {
      res.status(200).json({ received: true });
    }
  }
);

export default router;
