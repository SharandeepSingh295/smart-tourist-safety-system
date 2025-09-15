const express = require('express');
const router = express.Router();

let notifications = [];

// GET /api/notifications - Get notifications
router.get('/', (req, res) => {
  res.json({ success: true, data: notifications });
});

// POST /api/notifications - Send notification
router.post('/', (req, res) => {
  const notification = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString(),
    sent: true
  };
  notifications.push(notification);
  res.status(201).json({ success: true, data: notification });
});

module.exports = router;