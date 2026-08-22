const webpush = require('web-push');
const User = require('../models/User');

/**
 * Sends a push notification to all registered subscriptions of a user
 * @param {string} userId - User ID
 * @param {Object} payload - Notification payload { title, body, icon, data }
 */
const sendPushNotification = async (userId, payload) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}. Skipping.`);
      return;
    }

    console.log(`Sending push notification to user ${userId} across ${user.pushSubscriptions.length} subscriptions.`);
    const failedSubscriptions = [];

    const sendPromises = user.pushSubscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, JSON.stringify(payload));
      } catch (error) {
        console.error(`Push subscription error (Endpoint: ${sub.endpoint}):`, error.message);
        // Clean up subscription if it's no longer valid (410 Gone / 404 Not Found)
        if (error.statusCode === 410 || error.statusCode === 404) {
          failedSubscriptions.push(sub);
        }
      }
    });

    await Promise.all(sendPromises);

    // If there are stale subscriptions, prune them from the database
    if (failedSubscriptions.length > 0) {
      user.pushSubscriptions = user.pushSubscriptions.filter(
        (sub) => !failedSubscriptions.some((failed) => failed.endpoint === sub.endpoint)
      );
      await user.save();
      console.log(`Cleaned up ${failedSubscriptions.length} expired subscription(s) for user ${userId}.`);
    }
  } catch (error) {
    console.error(`Failed to send push notification to user ${userId}:`, error);
  }
};

module.exports = {
  sendPushNotification
};
