import { Router } from "express";
import mongoose from "mongoose";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Notification } from "../models/notification.model.js";
import { Server } from "socket.io";

const router = Router();

// REST API to get notifications by userId
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// REST API to mark notification as read
router.post('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Store online users and their socket IDs
const onlineUsers = new Map();

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user joins with their userId
  socket.on('registerUser', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log('Registered user:', userId);
  });

  // Listen for new notification event from anywhere (e.g. order service)
  socket.on('sendNotification', async (notificationData) => {
    // Save notification in DB
    const notification = new Notification(notificationData);
    await notification.save();

    // Send notification to recipient if online
    const recipientSocketId = onlineUsers.get(notification.userId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newNotification', notification);
    }
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  });
});

export default router;