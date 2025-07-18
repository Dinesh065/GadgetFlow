import express from "express";
import Stripe from "stripe";
import { Item } from "../models/item.model.js";
import { User } from "../models/user.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import PaymentModel from "../models/payment.model.js";
import PDFDocument from 'pdfkit'
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session/:itemId", verifyJWT, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { deliveryType } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const seller = await User.findById(item.ownerId);
    if (!seller || !seller.stripeAccountId) {
      return res.status(400).json({ error: "Seller has no Stripe account connected" });
    }

    const account = await stripe.accounts.retrieve(seller.stripeAccountId);
    if (!account.charges_enabled) {
      return res.status(400).json({ error: "Seller's Stripe account is not ready to accept payments" });
    }

    const days = item.days_for_rent || 1;
    const baseAmount = item.price * days * 100;
    const deliveryAmount =
      deliveryType === "delivery" && item.deliveryOptions.delivery
        ? item.deliveryOptions.deliveryCost * 100
        : 0;

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `${item.name} Rental (${days} day${days > 1 ? "s" : ""})`,
            description: item.description,
          },
          unit_amount: baseAmount,
        },
        quantity: 1,
      },
    ];

    if (deliveryAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charge",
            description: "Optional delivery selected by buyer",
          },
          unit_amount: deliveryAmount,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success/${item._id}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout/${item._id}`,
      metadata: {
        buyerId: req.user._id.toString(),
        itemId: item._id.toString(),
        deliveryType: deliveryType || "pickup",
      },
      payment_intent_data: {
        transfer_data: {
          destination: seller.stripeAccountId,
        },
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    // console.error("Stripe checkout error:", err);
    res.status(500).json({ error: "Stripe checkout failed" });
  }
});

router.get("/earnings", verifyJWT, async (req, res) => {
  try {
    const sellerId = req.user._id;

    const items = await Item.find({ ownerId: sellerId, status: { $in: ["Paid", "Rented", "Returned"] } })
      .populate("renter", "fullName email")
      .lean();

    const result = items.map((item) => ({
      _id: item._id,
      itemName: item.name,
      amount: item.totalPaid || item.price,
      buyerName: item.renter?.fullName || "N/A",
      date: item.rentalDate || item.updatedAt,
      status: item.status,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching seller earnings:", err);
    res.status(500).json({ error: "Failed to fetch earnings" });
  }
});

router.get("/invoice/:id", verifyJWT, async (req, res) => {
  const paymentId = req.params.id;
  console.log("Trying to download invoice for:", paymentId);

  const payment = await PaymentModel.findById(paymentId).populate("buyer");

  if (!payment) return res.status(404).send("Payment not found");

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${paymentId}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice ID: ${paymentId}`);
  doc.text(`Buyer: ${payment.buyer.name}`);
  doc.text(`Item: ${payment.itemName}`);
  doc.text(`Amount: ₹${payment.amount}`);
  doc.text(`Date: ${new Date(payment.date).toLocaleString()}`);
  doc.text(`Status: ${payment.status}`);
  doc.text(`Type: ${payment.deliveryType || 'Pickup'}`);

  doc.end();
});


export default router;
