self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Push event received with no payload data.');
    return;
  }

  try {
    const data = event.data.json();
    const title = data.title || 'Mindmingle';
    const options = {
      body: data.body || 'You have a new update.',
      icon: data.icon || '/favicon.ico',
      badge: data.icon || '/favicon.ico',
      data: data.data || {},
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open', title: 'Open Mindmingle' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('Push Service Worker JSON parse failed, displaying text:', error);
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Mindmingle Notification', {
        body: text
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Retrieve matching target route URL
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus if window already matches URL
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
