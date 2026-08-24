const webpush = require('web-push');

const configureWebPush = () => {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const emailSender = process.env.EMAIL_SENDER || 'mailto:support@mindmingle.com';

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn('WARNING: VAPID keys are missing in environment. Push notifications will not function.');
    return;
  }

  try {
    webpush.setVapidDetails(
      emailSender,
      vapidPublicKey,
      vapidPrivateKey
    );
    console.log('Web Push VAPID configuration successful.');
  } catch (error) {
    console.error('Error setting VAPID details:', error.message);
  }
};

module.exports = configureWebPush;
