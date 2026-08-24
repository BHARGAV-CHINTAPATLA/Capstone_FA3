const express = require('express');
const router = express.Router();
const { subscribeUser, unsubscribeUser } = require('../services/notificationService');
const authenticateJWT = require('../utilities/authenticateJWT');
const asyncHandler = require('../utilities/asyncHandler');

router.post('/notifications/subscribe', authenticateJWT, asyncHandler(async (req, res) => {
  await subscribeUser(req.user, req.body);
  res.status(201).json({ message: 'Successfully subscribed to push notifications' });
}));

router.delete('/notifications/subscribe', authenticateJWT, asyncHandler(async (req, res) => {
  await unsubscribeUser(req.user, req.body);
  res.status(200).json({ message: 'Successfully unsubscribed from push notifications' });
}));

module.exports = router;
