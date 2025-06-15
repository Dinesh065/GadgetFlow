import { Router } from "express";
import mongoose from "mongoose";
import { Item } from "../models/item.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";

const router = Router();

// Get All Available Items with Optional Filters
router.get("/items", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating } = req.query;

    const query = {};

    // Brand/category filter (case-insensitive match)
    if (category) {
      query.name = { $regex: category, $options: "i" };
    }

    // Rating filter
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const items = await Item.find(query);
    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Send Rental Request for an Item
router.post('/request/:itemId', verifyJWT, async (req, res) => {
    const buyerId = req.user.id;
    const { itemId } = req.params;

    try {
        const item = await Item.findById(itemId);
        if (!item || item.status !== "Available") {
            return res.status(400).json({ message: "Item not available for request" });
        }

        // Prevent duplicate requests
        const alreadyRequested = item.requests.some(r => r.buyerId.toString() === buyerId);
        if (alreadyRequested) {
            return res.status(409).json({ message: "You already requested this item" });
        }

        item.requests.push({ buyerId, requestedAt: new Date() });
        await item.save();

        res.status(200).json({ message: "Request sent successfully" });
    } catch (error) {
        console.error("Request error:", error);
        res.status(500).json({ message: "Error sending request" });
    }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("ownerId", "fullName email profilePic rating location joinedDate bio contactNumber")
      .exec();

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching item by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel a Rental Request
router.delete('/cancel-request/:itemId', verifyJWT, async (req, res) => {
    const buyerId = req.user.id;
    const { itemId } = req.params;

    try {
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.requests = item.requests.filter(r => r.buyerId.toString() !== buyerId);
        await item.save();

        res.status(200).json({ message: "Request cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling request:", error);
        res.status(500).json({ message: "Error cancelling request" });
    }
});

// View Buyer’s Active Requests
router.get('/my-requests', verifyJWT, async (req, res) => {
    const buyerId = req.user.id;

    try {
        const items = await Item.find({ "requests.buyerId": buyerId })
            .populate("ownerId", "name")
            .select("name price category requests status");

        const myRequests = items.map(item => {
            const myRequest = item.requests.find(r => r.buyerId.toString() === buyerId);
            return {
                itemId: item._id,
                itemName: item.name,
                price: item.price,
                status: item.status,
                requestedAt: myRequest?.requestedAt
            };
        });

        res.status(200).json(myRequests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Failed to fetch requests" });
    }
});

// View Buyer’s Rented Items
router.get('/my-rented-items', verifyJWT, async (req, res) => {
    const buyerId = req.user.id;

    try {
        const items = await Item.find({ renter: buyerId, status: "Rented" })
            .populate("ownerId", "name email");

        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching rented items:", error);
        res.status(500).json({ message: "Error fetching rented items" });
    }
});

// View Rental History (Returned Items)
router.get('/rental-history', verifyJWT, async (req, res) => {
    const buyerId = req.user.id;

    try {
        const items = await Item.find({
            renter: buyerId,
            status: "Returned"
        }).populate("ownerId", "name");

        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: "Error fetching history" });
    }
});

export default router;

