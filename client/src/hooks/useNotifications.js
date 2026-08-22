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
      } catch (err) {
        console.error('Failed to get active push subscription:', err);
      }
    }
  };

  const subscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Web Push notifications are not supported in this browser.');
      return false;
    }

    if (!VAPID_PUBLIC_KEY) {
      console.error('VITE_VAPID_PUBLIC_KEY environment variable is not defined.');
      return false;
    }

    try {
      // 1. Request user permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        console.warn('Notification permission denied.');
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
    checkSubscription
  };
};
