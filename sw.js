/* ============================================================
   Home Hub — Service Worker  (sw.js)
   Place this file in the SAME folder as home-hub.html
   ============================================================ */

const CACHE = 'homehub-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

/* ── Receive a scheduled notification message ─────────────── */
self.addEventListener('message', event => {
  const { type, title, body, tag, delay } = event.data || {};

  if (type === 'SCHEDULE_NOTIFICATION') {
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        tag,
        icon: '/home-hub-icon.png',   // optional: add a 192x192 icon file
        badge: '/home-hub-badge.png', // optional: 96x96 monochrome badge
        requireInteraction: false,
        silent: false,
        data: { url: event.data.url || '/' }
      });
    }, delay);
  }
});

/* ── Notification click → focus/open the dashboard tab ───── */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('home-hub') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
