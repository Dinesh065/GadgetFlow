// routes/overdues.js
import express from 'express';
import { Item } from '../models/item.model.js';
const router = express.Router();
const MS_IN_24_HOURS = 24 * 60 * 60 * 1000;

router.get('/overdues', async (req, res) => {
    try {
        const now = new Date();

        const allRentedItems = await Item.find({
            status: "Rented",
            rentalDate: { $ne: null },
            warningSentAt: null,
        }).populate('renter', 'name contact');

        const overdueItems = allRentedItems.filter(item => {
            const dueDate = new Date(item.rentalDate);
            dueDate.setDate(dueDate.getDate() + item.daysForRent);
            return dueDate < now;
        });

        const formatted = overdueItems.map(item => {
            const dueDate = new Date(item.rentalDate);
            dueDate.setDate(dueDate.getDate() + item.daysForRent);
            return {
                id: item._id,
                item: item.name,
                renter: item.renter?.name || "Unknown",
                contact: item.renter?.contact || "N/A",
                returnDate: dueDate.toLocaleString(),
                renterId: item.renter?._id
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch overdues" });
    }
});

router.get('/pending', async (req, res) => {
    try {
        const now = new Date();

        const allWarnedItems = await Item.find({
            status: "Rented",
            rentalDate: { $ne: null },
            warningSentAt: { $ne: null },
            actionTaken: false,
        }).populate('renter', 'name contact');

        const pendingItems = allWarnedItems.filter(item => {
            const dueDate = new Date(item.rentalDate);
            dueDate.setDate(dueDate.getDate() + item.daysForRent);
            return dueDate < now && (now - new Date(item.warningSentAt)) > MS_IN_24_HOURS;
        });

        const formatted = pendingItems.map(item => ({
            id: item._id,
            item: item.name,
            renter: item.renter?.name || "Unknown",
            contact: item.renter?.contact || "N/A",
            warningSentAt: item.warningSentAt,
            renterId: item.renter?._id
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch pending warnings" });
    }
});

// POST /api/send-warning
router.post('/send-warning', async (req, res) => {
    try {
        const { renterId, itemId } = req.body;

        await Item.findByIdAndUpdate(itemId, {
            warningSentAt: new Date()
        });

        // TODO: Send actual email/notification to renterId

        res.json({ message: "Warning sent successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send warning" });
    }
});

// POST /api/take-action
router.post('/take-action', async (req, res) => {
    try {
        const { itemId } = req.body;

        await Item.findByIdAndUpdate(itemId, {
            actionTaken: true
        });

        // TODO: Implement custom penalty logic if required

        res.json({ message: "Action recorded successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to take action" });
    }
});

export default router;
