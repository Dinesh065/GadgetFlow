import { Router } from "express";
import mongoose from "mongoose";
import fs from "fs";
import { Item } from "../models/item.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";
const router = Router();


// GET all items where buyer has confirmed but seller hasn't
router.get("/pending-acknowledgements/:sellerId", async (req, res) => {
  const { sellerId } = req.params;
  const items = await Item.find({
    ownerId: sellerId,
    "requests.paymentDone": true,
    "requests.buyerConfirmed": true,
    "requests.sellerAcknowledged": false,
  }).populate("renter");
  res.json(items);
});

// POST to acknowledge
router.post("/acknowledge-delivery/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    const requestIndex = item.requests.findIndex(
      (req) =>
        req.buyerId.toString() === item.renter.toString() &&
        req.status === "Accepted"
    );

    if (requestIndex === -1)
      return res.status(404).json({ message: "Matching request not found" });

    // ✅ Directly update the nested field
    item.requests[requestIndex].sellerAcknowledged = true;
    item.markModified("requests"); // Important to ensure Mongoose tracks nested updates

    // ✅ Other delivery details
    item.deliveryStatus = "Confirmed";
    item.status = "Rented";
    item.rentalDate = new Date();
    item.dueDate = new Date(
      Date.now() + item.days_for_rent * 24 * 60 * 60 * 1000
    );

    await item.save();

    return res.json({ message: "Acknowledged and rental confirmed" });
  } catch (err) {
    console.error("Acknowledge error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get previously acknowledged deliveries/pickups
router.get("/acknowledged-history/:sellerId", async (req, res) => {
  const { sellerId } = req.params;
  try {
    const items = await Item.find({
      ownerId: sellerId,
      "requests.sellerAcknowledged": true
    }).populate("renter");
    res.json(items);
  } catch (err) {
    console.error("Error fetching acknowledged history:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/pending-return-ack/:sellerId", async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    const items = await Item.find({
      ownerId: sellerId,
      status: "waiting_ack",
    }).populate("renter");

    const pendingReturnRequests = [];

    for (const item of items) {
      const matchingRequest = item.requests.find((req) =>
        req.buyerId?.toString() === item.renter?._id?.toString() &&
        req.status === "Accepted" 
        // &&
        // req.sellerReturnAcknowledged !== true
      );

      if (matchingRequest) {
        const modifiedItem = {
          ...item.toObject(),
          requests: [matchingRequest],
        };
        pendingReturnRequests.push(modifiedItem);
      }
    }

    res.json(pendingReturnRequests);
  } catch (err) {
    console.error("Error fetching pending return confirmations:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/acknowledge-return/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const requestIndex = item.requests.findIndex(
      req => req.buyerId.toString() === item.renter.toString() && req.status === "Accepted"
    );

    if (requestIndex === -1) return res.status(404).json({ message: "Request not found" });

    // Mark seller acknowledgment
    item.requests[requestIndex].sellerReturnAcknowledged = true;
    item.markModified("requests");

    item.status = "Returned";
    item.returnConfirmedAt = new Date(); // ✅ use the defined schema field
    item.isReturned = true; // optional if needed to flag returns

    await item.save();

    return res.json({ message: "Return acknowledged successfully" });
  } catch (err) {
    console.error("Acknowledge return error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
 
export default router;