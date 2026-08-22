const asyncHandler = require('../utils/asyncHandler');

/**
 * Store a browser Web Push subscription object
 * POST /api/v1/notifications/subscribe
 */
const subscribe = asyncHandler(async (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid push subscription details' });
  }

  const user = req.user;

  // Check if subscription already registered
  const exists = user.pushSubscriptions.some(
    (sub) => sub.endpoint === subscription.endpoint
  );

  if (!exists) {
    user.pushSubscriptions.push(subscription);
    await user.save();
  }

  res.status(201).json({ message: 'Successfully subscribed to push notifications' });
});

/**
 * Remove a Web Push subscription object
 * DELETE /api/v1/notifications/subscribe
 */
const unsubscribe = asyncHandler(async (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid push subscription details' });
  }

  const user = req.user;

  // Remove the specified subscription
  user.pushSubscriptions = user.pushSubscriptions.filter(
    (sub) => sub.endpoint !== subscription.endpoint
  );
  await user.save();

  res.status(200).json({ message: 'Successfully unsubscribed from push notifications' });
});

module.exports = {
  subscribe,
  unsubscribe
};
