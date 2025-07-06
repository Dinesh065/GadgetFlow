import cron from 'node-cron';
import { Item } from '../models/item.model.js';
import dayjs from 'dayjs';

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  const now = new Date();

  try {
    const items = await Item.find({
      paymentDeadline: { $lt: now },
      status: 'Accepted',
      'requests.status': 'Accepted',
      'requests.paymentDone': false,
    });

    for (const item of items) {
      let reverted = false;

      item.requests = item.requests.map(req => {
        if (req.status === 'Accepted' && !req.paymentDone) {
          req.status = 'Requested'; // buyer can re-request
          req.acceptedAt = null;
          reverted = true;
        } else if (req.status === 'Rejected') {
          req.status = 'Requested'; // previously rejected buyers come back
        }
        return req;
      });

      if (reverted) {
        item.status = 'Requested';
        item.renter = null;
        item.paymentDeadline = null;
        await item.save();
        console.log(`⏳ Reverted item ${item._id} due to no payment in time`);
      }
    }
  } catch (error) {
    console.error("❌ Cron job error:", error.message);
  }
});
