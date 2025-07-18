// routes/rentals.js
import express from "express";
import { Item } from "../models/item.model.js";
import mongoose from "mongoose";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
router.get("/getAllRentals", verifyJWT, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();

    // In-progress rentals including "waiting_ack"
    const inProgressItems = await Item.find({
      renter: userId,
      status: { $in: ["Paid", "Rented", "waiting_ack"] },
      "requests.paymentDone": true
    }).lean();

    // Returned rentals
    const returnedItems = await Item.find({
      renter: userId,
      status: "Returned"
    }).lean();

    const rentals = {
      inProgress: inProgressItems.map(item => {
        const rentalEndDate = new Date(item.rentalDate);
        rentalEndDate.setDate(rentalEndDate.getDate() + item.days_for_rent);
        const isOverdue = rentalEndDate < today && !item.isReturned;

        let status = "in_use";
        if (item.status === "waiting_ack") {
          status = "waiting_ack";
        } else if (isOverdue) {
          status = "overdue";
        }

        return {
          id: item._id,
          name: item.name,
          category: item.category,
          startDate: item.rentalDate,
          returnDate: rentalEndDate,
          status: status,
          overdueDays: isOverdue ? Math.ceil((today - rentalEndDate) / (1000 * 60 * 60 * 24)) : 0,
          overdueCharge: isOverdue ? Math.ceil((today - rentalEndDate) / (1000 * 60 * 60 * 24)) * 100 : 0,
        };
      }),

      returned: returnedItems.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        startDate: item.rentalDate,
        returnDate: new Date(item.rentalDate).setDate(new Date(item.rentalDate).getDate() + item.days_for_rent),
        returnedOn: item.returnConfirmedAt || item.returnRequestedAt || null,
      })),
    };

    res.json(rentals);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ message: "Failed to fetch rentals." });
  }
});

router.post("/requestReturn", verifyJWT, async (req, res) => {
  const { itemId } = req.body;
  try {
    const item = await Item.findById(itemId).populate("owner renter");
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = "waiting_ack";
    item.returnRequestedAt = new Date();
    await item.save();

    // Send email to seller here
    sendEmail(item.owner.email, "Return Request", `The user ${item.renter.name} wants to return item ${item.name}. Please acknowledge.`);

    res.json({ message: "Return request sent" });
  } catch (err) {
    console.error("Return request error:", err);
    res.status(500).json({ message: "Error sending return request" });
  }
});


export default router;
