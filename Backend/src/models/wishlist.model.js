import { User } from "./user.model.js";
import { Item } from "./item.model.js";
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  addedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);