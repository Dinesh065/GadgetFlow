// Updated Stripe routes (without /stripe-success page)
import express from "express";
import Stripe from "stripe";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Express account
router.post("/create-account", verifyJWT, async (req, res) => {
  try {
    const account = await stripe.accounts.create({ type: "express" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { stripeAccountId: account.id },
      { new: true }
    );

    res.status(200).json({ accountId: account.id });
  } catch (err) {
    res.status(500).json({ error: "Stripe account creation failed" });
  }
});

// Generate onboarding link
router.post("/onboard", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.stripeAccountId) return res.status(400).json({ error: "No Stripe account" });

    // ✅ Check onboarding status
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    if (account.details_submitted) {
      user.stripeOnboarded = true;
      await user.save();
    }

    const link = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${process.env.CLIENT_URL}/setup-stripe`,
      return_url: `${process.env.CLIENT_URL}/seller-dashboard`,
      type: "account_onboarding",
    });

    res.status(200).json({ url: link.url });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate onboarding link" });
  }
});

router.get("/onboarding-url", verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.stripeAccountId) {
      return res.status(400).json({ error: "No Stripe account" });
    }

    const link = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${process.env.CLIENT_URL}/setup-stripe`,
      return_url: `${process.env.CLIENT_URL}/seller-dashboard`,
      type: "account_onboarding",
    });

    res.status(200).json({ url: link.url });
  } catch (err) {
    console.error("Stripe onboarding URL error:", err);
    res.status(500).json({ error: "Failed to generate onboarding link" });
  }
});


export default router;
