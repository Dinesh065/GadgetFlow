import express from "express";
import { Wishlist } from "../models/wishlist.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Item } from "../models/item.model.js";
import { Router } from "express";
const router = Router();

router.get("/", verifyJWT, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.user._id })
      .populate("itemId");
    const items = wishlistItems.map(entry => entry.itemId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
});

// ✅ POST /wishlist/:itemId - Add item to wishlist
router.post("/:itemId", verifyJWT, async (req, res) => {
  try {
    const exists = await Wishlist.findOne({
      userId: req.user._id,
      itemId: req.params.itemId,
    });

    if (exists) {
      return res.status(200).json({ message: "Item already in wishlist" });
    }

    await Wishlist.create({
      userId: req.user._id,
      itemId: req.params.itemId,
    });

    res.status(201).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
});

// ✅ DELETE /wishlist/:itemId - Remove item from wishlist
router.delete("/:itemId", verifyJWT, async (req, res) => {
  try {
    await Wishlist.deleteOne({
      userId: req.user._id,
      itemId: req.params.itemId,
    });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
});

// ✅ DELETE /wishlist - Clear all
router.delete("/", verifyJWT, async (req, res) => {
  try {
    await Wishlist.deleteMany({ userId: req.user._id });
    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing wishlist", error });
  }
});

export default router;