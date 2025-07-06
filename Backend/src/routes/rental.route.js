// routes/rentals.js
import express from "express";
import { Item } from "../models/item.model.js";
import mongoose from "mongoose";

const router = express.Router();

// routes/rentals.js
router.get("/fetchCalendarData", async (req, res) => {
    try {
        const includePast = req.query.includePast === "true";

        const today = new Date();
        const matchQuery = {
            status: "Rented",
            rentalDate: { $ne: null }
        };

        // Only include ongoing/future rentals unless explicitly asked for past
        if (!includePast) {
            matchQuery.$expr = {
                $gte: [
                    { $add: ["$rentalDate", { $multiply: ["$days_for_rent", 86400000] }] },
                    today
                ]
            };
        }

        const items = await Item.find(matchQuery)
            .populate("renter", "name contact");

        const data = items.map(item => {
            const rented_start = item.rentalDate;
            const rented_end = new Date(item.rentalDate);
            rented_end.setDate(rented_end.getDate() + item.days_for_rent);

            return {
                name: item.name,
                renterName: item.renter?.name || "Unknown",
                renterContact: item.renter?.contact || "N/A",
                rented_start,
                rented_end
            };
        });

        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching rental calendar data:", err);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;
