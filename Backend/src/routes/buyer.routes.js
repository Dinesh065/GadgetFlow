import { Router } from "express";
import mongoose from "mongoose";
import { Item } from "../models/item.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";
import { Review } from "../models/review.model.js";
import { Wishlist } from "../models/wishlist.model.js";
import nodemailer from "nodemailer";
import dayjs from "dayjs";
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

// GET: Get user's wishlist
router.get('/wishlist', verifyJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.find({ userId }).populate('itemId');
    res.status(200).json({ wishlist });
  } catch (err) {
    console.error("Fetch wishlist error:", err);
    res.status(500).json({ message: "Server error fetching wishlist" });
  }
});


router.get('/orders', verifyJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const items = await Item.find({
      'requests.buyerId': userId
    }).lean();

    const requested = [], accepted = [], rejected = [];

    items.forEach(item => {
      item.requests.forEach(reqEntry => {
        if (String(reqEntry.buyerId) !== userId) return;

        const base = {
          productId: item._id,
          name: item.name,
          category: item.category,
          price: item.price,
        };

        if (reqEntry.status === 'Requested') {
          requested.push({
            ...base,
            requestedOn: reqEntry.requestedAt,
            orderId: `${item._id}-${reqEntry._id}`
          });
        }
        else if (reqEntry.status === 'Accepted') {
          const acceptedAt = reqEntry.acceptedAt;
          const paymentDone = reqEntry.paymentDone || false;
          const dueDate = paymentDone ? item.dueDate : null;

          accepted.push({
            ...base,
            acceptedAt,
            dueDate,
            paymentDone: reqEntry.paymentDone || false,
            deliveryType: reqEntry.deliveryType,
            deliveryStatus: item.deliveryStatus,
            rentalDate: item.rentalDate,
            orderId: `${item._id}-${reqEntry._id}`
          });

        }
        else if (reqEntry.status === 'Rejected') {
          rejected.push({
            ...base,
            rejectedOn: reqEntry.requestedAt,
            reason: 'Request denied',
            orderId: `${item._id}-${reqEntry._id}`
          });
        }
      });
    });

    res.status(200).json({ requested, accepted, rejected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

router.get("/accepted-orders", verifyJWT, async (req, res) => {
  try {
    const buyerId = req.user._id;

    // Fetch only items that have requests made by this buyer
    const items = await Item.find({
      "requests.buyerId": buyerId
    });

    const acceptedOrders = [];

    items.forEach(item => {
      item.requests.forEach(req => {
        if (
          req.buyerId.toString() === buyerId.toString() &&
          req.status === "Accepted" &&
          !req.paymentDone &&
          dayjs().diff(dayjs(req.acceptedAt), "hour") < 24
        ) {
          acceptedOrders.push({
            _id: req._id,
            name: item.name,
            productId: item._id,
            acceptedAt: req.acceptedAt,
            paymentDone: req.paymentDone || false
          });
        }
      });
    });

    res.status(200).json(acceptedOrders);
  } catch (err) {
    console.error("Error in /buyers/accepted-orders:", err);
    res.status(500).json({ error: "Server error while fetching accepted orders." });
  }
});

router.post("/confirm-delivery", verifyJWT, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const item = await Item.findById(productId).populate("ownerId renter");
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Find the correct request object
    const requestIndex = item.requests.findIndex(req =>
      req.buyerId.toString() === userId && req.status === "Accepted"
    );

    if (requestIndex === -1)
      return res.status(404).json({ message: "Request not found" });

    // ✅ Update buyerConfirmed
    item.requests[requestIndex].buyerConfirmed = true;
    item.deliveryStatus = "Confirmed";
    item.markModified("requests"); // ✅ Force Mongoose to notice the array change

    await item.save();

    // Notify seller
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Rental Platform" <${process.env.EMAIL_USER}>`,
      to: item.ownerId.email,
      subject: `Buyer confirmed ${item.deliveryType} for "${item.name}"`,
      html: `
        <p>Buyer <b>${item.renter.fullName}</b> has confirmed they've ${item.deliveryType === "delivery" ? "received" : "picked up"
        } the item: <b>${item.name}</b>.</p>
        <p>Please acknowledge to finalize the rental in the system.</p>
      `,
    };

    transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Buyer confirmation received. Awaiting seller." });
  } catch (err) {
    console.error("Confirm delivery error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Send Rental Request for an Item
router.post('/:itemId/request', verifyJWT, async (req, res) => {
  const buyerId = req.user.id;
  const { itemId } = req.params;
  const { message } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item || item.status !== "Available") {
      return res.status(400).json({ message: "Item not available for request" });
    }

    const alreadyRequested = item.requests.some(
      (r) => r.buyerId.toString() === buyerId
    );

    if (alreadyRequested) {
      return res.status(409).json({ message: "You already requested this item" });
    }

    item.requests.push({
      buyerId,
      message: message || "Interested in renting",
      requestedAt: new Date(),
      status: "Requested",
    });

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
      .populate("ownerId", "fullName email profileImage rating location joinedDate bio contactNumber")
      .lean(); // lean gives a plain JS object to modify easily

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Fetch reviews separately if not embedded in item schema
    const reviews = await Review.find({ itemId: req.params.id })
      .populate("userId", "fullName profileImage") // who gave the review
      .sort({ createdAt: -1 });

    res.status(200).json({
      ...item,
      reviews
    });
  } catch (err) {
    console.error("Error fetching item by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/addToWishlist/:itemId', verifyJWT, async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.params;

  try {
    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Check if already added
    const exists = await Wishlist.findOne({ userId, itemId });
    if (exists) return res.status(409).json({ message: "Item already in wishlist" });

    // Add to wishlist
    const entry = new Wishlist({ userId, itemId });
    await entry.save();

    res.status(201).json({ message: "Item added to wishlist" });
  } catch (err) {
    console.error("Wishlist error:", err);
    res.status(500).json({ message: "Server error adding to wishlist" });
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

