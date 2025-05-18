import { Router } from "express";
import mongoose from "mongoose";
import fs from "fs";
import { Item } from "../models/item.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
            requests = 0,
            rentalDate = null,
            dueDate = null,
            renter = null,
            category,
            description,
            location,
            ownerId,
            deliveryOption,
            deliveryCost = 0
        } = req.body;

        if (!name || !images || images.length < 3 || !price || !category || !location || !ownerId) {
            return res.status(400).json({ message: "Missing required fields or insufficient images." });
        }
        if (!["Pickup", "Delivery"].includes(deliveryOption)) {
            return res.status(400).json({ message: "Invalid delivery option." });
        }

        if (deliveryOption === "Delivery" && (!deliveryCost || deliveryCost <= 0)) {
            return res.status(400).json({ message: "Delivery cost is required for delivery option." });
        }


        const newItem = new Item({
            name,
            images,
            price,
            status,
            requests,
            rentalDate,
            dueDate,
            renter,
            category,
            description,
            location,
            ownerId,
            deliveryOption,
            deliveryCost
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

export default router;


// router.get("/", async (req, res) => {
//     try {
//         const newItem = new Item(req.body);
//         const savedItem = await newItem.save();
//         res.status(201).json(savedItem);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // 🟡 Update item status
// router.put("/updateItem/:id", async (req, res) => {
//     try {
//         const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedItem);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // 🔴 Delete item
// router.delete("/deleteItem/:id", async (req, res) => {
//     try {
//         await Item.findByIdAndDelete(req.params.id);
//         res.json({ message: "Item deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // 📊 Get profit & rental statistics for graphs
// router.get("/stats", async (req, res) => {
//     try {
//         const allItems = await Item.find();

//         // Monthly Profit Calculation (Assuming price is in ₹)
//         const profitData = {};
//         allItems.forEach(item => {
//             const month = new Date(item.rentalDate).toLocaleString("default", { month: "short" });
//             profitData[month] = (profitData[month] || 0) + item.price;
//         });

//         // Format data for frontend
//         const formattedProfitData = Object.keys(profitData).map(month => ({
//             name: month,
//             value: profitData[month]
//         }));

//         // Rental Count Calculation
//         const rentalData = allItems.reduce((acc, item) => {
//             acc[item.name] = (acc[item.name] || 0) + (item.status === "Rented" ? 1 : 0);
//             return acc;
//         }, {});

//         const formattedRentalData = Object.keys(rentalData).map(name => ({
//             name,
//             value: rentalData[name]
//         }));

//         res.json({ profitData: formattedProfitData, rentalData: formattedRentalData });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });