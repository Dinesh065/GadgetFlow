import { Router } from "express";
import mongoose from "mongoose";
import fs from "fs";
import { Item } from "../models/item.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";

const router = Router();

// Upload Route - Cloudinary
router.post('/upload', upload.array('images', 6), async (req, res) => {
    try {
        const uploadedUrls = [];
        for (let file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            if (result?.secure_url) {
                uploadedUrls.push(result.secure_url);
                fs.unlinkSync(file.path); // Remove local file
            }
        }

        res.json({ success: true, images: uploadedUrls });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({ success: false, message: "Upload failed" });
    }
});

// Add New Item
router.post("/addNewItems", async (req, res) => {
    try {

        const {
            name,
            images,
            price,
            status = "Available",
            requests = [],
            rentalDate = null,
            // dueDate = null,
            days_for_rent = 1, // Default to 1 day if not provided
            renter = null,
            category,
            description,
            location,
            ownerId,
            deliveryOptions
        } = req.body;

        if (!name || !images || images.length < 3 || !price || !category || !location || !ownerId) {
            return res.status(400).json({ message: "Missing required fields or insufficient images." });
        }
        if (!deliveryOptions || typeof deliveryOptions.delivery !== "boolean" || typeof deliveryOptions.pickup !== "boolean") {
            return res.status(400).json({ message: "Invalid delivery options." });
        }

        if (deliveryOptions.delivery && (!deliveryOptions.deliveryCost || deliveryOptions.deliveryCost <= 0)) {
            return res.status(400).json({ message: "Delivery cost must be greater than 0 if delivery is selected." });
        }

        if (!deliveryOptions.delivery && deliveryOptions.deliveryCost > 0) {
            return res.status(400).json({ message: "Delivery cost must be 0 if delivery is not selected." });
        }

        const newItem = new Item({
            name,
            images,
            price,
            status,
            requests,
            rentalDate,
            days_for_rent,
            renter,
            category,
            description,
            location,
            ownerId,
            deliveryOptions
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ message: "Error adding item", error: error.message });
    }
});

// Monthly Profit Route
router.get('/monthly-profit', async (req, res) => {
    const { ownerId } = req.query;

    try {
        const profitData = await Item.aggregate([
            {
                $match: {
                    ownerId: new mongoose.Types.ObjectId(ownerId),
                    status: "Rented",
                    rentalDate: { $ne: null }
                }
            },
            {
                $group: {
                    _id: { $month: "$rentalDate" },
                    total: { $sum: "$price" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const result = profitData.map(p => ({
            name: monthNames[p._id - 1],
            value: p.total
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error("Profit fetch error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get Items by Owner
router.get('/getItemsByOwner/:ownerId', async (req, res) => {
    const { ownerId } = req.params;

    try {
        const items = await Item.find({ ownerId }).populate("renter", "name email");
        res.status(200).json(items);
    } catch (error) {
        console.error("Failed to get items by owner:", error.message);
        res.status(500).json({ error: "Failed to fetch items." });
    }
});

router.get('/getItemsForML', verifyJWT, async (req, res) => {
    try {
        const sellerId = req.user.id; // Make sure auth middleware sets this

        const items = await Item.find({ ownerId: sellerId })
            .populate("ownerId", "name email");

        res.status(200).json({ items });
    } catch (error) {
        console.error("Failed to fetch items for seller:", error.message);
        res.status(500).json({ error: "Failed to fetch items." });
    }
});

router.put('/:id', verifyJWT, async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedData = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.status(200).json({
            message: 'Item updated successfully',
            updatedItem,
        });
    } catch (error) {
        console.error('Error updating item:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.patch('/:id/status', verifyJWT, async (req, res) => {
    const { id } = req.params;
    const { availability } = req.body;
    console.log("Updating item status:", id, availability);
    try {
        const updated = await Item.findByIdAndUpdate(
            id,
            { status: availability },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Item not found" });

        res.status(200).json({ availability: updated.status });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/:id', verifyJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Item.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Item not found" });

        res.status(200).json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/delete-multiple', verifyJWT, async (req, res) => {
    const { ids } = req.body;
    try {
        const result = await Item.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `${result.deletedCount} items deleted` });
    } catch (err) {
        res.status(500).json({ message: "Batch delete error" });
    }
});

// routes/requests.js
router.get('/requests/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const item = await Item.findById(itemId).populate('requests.buyerId', 'name image');

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        return res.status(200).json(item.requests); // send just the requests array
    } catch (error) {
        console.error('Error fetching buyer requests:', error);
        return res.status(500).json({ message: 'Server error while fetching buyer requests' });
    }
});

export default router;