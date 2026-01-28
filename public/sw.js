const CACHE_NAME = "amra-v1";
const urlsToCache = ["/", "/manifest.json"];

// Install event - cache essential resources
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(function () {
        return caches.match(event.request);
      }),
  );
});

// Push notification event
self.addEventListener("push", function (event) {
  console.log("Push notification received:", event);

  let notificationData = {
    title: "Amra",
    body: "You have a new notification",
    icon: "/web-app-manifest-192x192.png",
  };

  // Try to parse the data if it exists
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
      };
    } catch (error) {
      console.error("Error parsing notification data:", error);
      // Use text if JSON parsing fails
      notificationData.body = event.data.text();
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: "/web-app-manifest-192x192.png",
    vibrate: [200, 100, 200],
    tag: "amra-notification",
    requireInteraction: false,
    data: {
      dateOfArrival: Date.now(),
      url: "/",
    },
    actions: [
      {
        action: "open",
        title: "Open App",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options),
  );
});

// Notification click event
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received:", event);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(function (clientList) {
        // Check if there's already a window open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === self.registration.scope && "focus" in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
