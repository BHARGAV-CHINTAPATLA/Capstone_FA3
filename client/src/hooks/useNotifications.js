import { useState, useEffect } from 'react';
import { subscribePushNotifications, unsubscribePushNotifications } from '../api';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * Utility helper to convert VAPID public key base64 string to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
        setIsSubscribed(!!sub);
        if (sub && localStorage.getItem('token')) {
          // Sync subscription with backend to handle cases where DB was reset
          await subscribePushNotifications(sub).catch(err => {
            console.error('Failed to sync push subscription with server:', err);
          });
        }
      } catch (err) {
        console.error('Failed to get active push subscription:', err);
      }
    }
  };

  const subscribe = async () => {
    setError(null);

    if (!window.isSecureContext) {
      setError('Notifications require HTTPS. localhost is supported for development.');
      return false;
    }

    if (!('Notification' in window)) {
      setError('This browser does not support notifications.');
      return false;
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Web Push notifications are not supported in this browser.');
      setError('Push notifications are not supported in this browser.');
      return false;
    }

    if (!VAPID_PUBLIC_KEY) {
      console.error('VITE_VAPID_PUBLIC_KEY environment variable is not defined.');
      setError('Push notifications are not configured.');
      return false;
    }

    try {
      // 1. Request user permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        console.warn('Notification permission denied.');
        setError('Notification permission was not granted.');
        return false;
      }

      // 2. Wait for Service Worker registration to be ready
      const registration = await navigator.serviceWorker.ready;

      // 3. Register user subscription with push service
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      // 4. Send subscription endpoint object to server API
      await subscribePushNotifications(sub);

      setSubscription(sub);
      setIsSubscribed(true);
      console.log('Successfully registered Web Push subscription.');
      return true;
    } catch (err) {
      console.error('Error during push notification subscription:', err);
      if (err.name === 'AbortError') {
        const isBrave = Boolean(navigator.brave);
        setError(isBrave
          ? 'Brave rejected the push service request. Enable "Use Google services for push messaging" in brave://settings/privacy, allow notifications for this site, then reload.'
          : 'The browser push service rejected this subscription. Try a current browser on HTTPS, disable strict privacy or VPN blocking, then reload the page.');
      } else if (err.response) {
        setError(err.response.data?.error || 'The subscription could not be saved to your account.');
      } else {
        setError('Could not enable notifications. Check the browser permission and try again.');
      }
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return false;

    try {
      // 1. Delete subscription from backend server
      await unsubscribePushNotifications(subscription);
      
      // 2. Unsubscribe in the browser
      await subscription.unsubscribe();

      setSubscription(null);
      setIsSubscribed(false);
      console.log('Successfully removed Web Push subscription.');
      return true;
    } catch (err) {
      console.error('Failed to unsubscribe push notifications:', err);
      return false;
    }
  };

  return {
    permission,
    isSubscribed,
    subscribe,
    unsubscribe,
    checkSubscription,
    error
  };
};
