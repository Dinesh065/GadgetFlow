const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // recipient user ID
  message: { type: String, required: true },
  type: { type: String, required: true }, // e.g. 'order', 'message'
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);