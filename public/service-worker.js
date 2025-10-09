// https://developer.mozilla.org/en-US/docs/Web/API/Cache
const OFFLINE_CACHE = "offline-cache-v20251009T05410";
const DATA_CACHE = "data-cache-v20250814T11364";
const OFFLINE_URL = "offline.html";

// These are the files downloaded into the cache for the PWA
// If more offline pages are created for the PWA, they need to be added here
const CACHE_STATIC_FILES = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/static/fonts/montserrat.css",
  "/logo192.png",
  "/favicon.ico",
];

let sessionId = null;

// This message is sent from index.html to provide the session id and timestamp to handle notifications.
// event will have this data due to the index.html sending a postMessage with this data.
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event
self.addEventListener("message", async (event) => {
  if (event.data.sessionId) {
    sessionId = event.data.sessionId;
    console.log("Session ID updated in service worker: asd", sessionId);
  }

  // Handle PWA update requests
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "zeeguu-notification") {
    event.waitUntil(pollNotifications());
  }
});

async function pollNotifications() {
  // Will not start polling without a session id and enabled notification permissions
  if (!sessionId || Notification.permission !== "granted") {
    console.error(
      "Session id can't be found or notification permissions were not granted.",
    );
    return;
  }

  try {
    const data = await fetchNotificationData();
    if (data && data.notification_available) {
      self.registration.showNotification("Zeeguu Notification", {
        body: data.message,
        icon: "/logo192.png",
        tag: "zeeguu-notification",
        data: {
          url: data.url,
          notificationId: data.user_notification_id,
        },
      });
    } else {
      console.log("No notifications are currently available");
    }
  } catch (error) {
    console.error("Failed to poll notifications:", error);
  }
}

async function fetchNotificationData() {
  try {
    const response = await fetch(
      `https://api.zeeguu.org/get_notification_for_user?session=${sessionId}`,
    );
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch notificaiton data:", error);
    return null;
  }
}


// Used for handling notification clicks
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Use event.waitUntil to ensure that all client handling is completed before terminating the service worker
  // https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
  event.waitUntil(
    (async () => {
      try {
        const notificationId = event.notification.data.user_notification_id;
        if (notificationId) {
          await notificationWasClicked(notificationId);
        }

        const allClients = await clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });

        // Proritizes opening the notifcation in the PWA if installed, otherwise it will open it in the browser
        let matchingClient = null;
        for (const client of allClients) {
          if (client.url.includes("zeeguu")) {
            matchingClient = client;
            break;
          }
        }

        if (matchingClient) {
          matchingClient.focus();
          matchingClient.navigate(event.notification.data.url);
        } else {
          await clients.openWindow(event.notification.data.url);
        }
      } catch (error) {
        console.error("Failed to handle notification click:", error);
      }
    })(),
  );
});

// Sends data to an endpoint if notfication was clicked
async function notificationWasClicked(notificaitonId) {
  try {
    const response = await fetch(
      `https://api.zeeguu.org/set_notification_click_date`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notification_id: notificaitonId }),
      },
    );
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Failed to tell the endpoint that the notification was clicked:",
      error,
    );
  }
}

// Occurs when the service worker is installed
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/install_event
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      await cache.addAll(CACHE_STATIC_FILES);

      // Force the newest service worker to take over
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
      self.skipWaiting();
    })(),
  );
});

// Occurs when the service worker takes control of the page
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/activate_event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Optimizes startup time for the SW with preloading responses
      // https://web.dev/blog/navigation-preload
      // see also the implementeation of handleNavigationRequest
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          if (key !== OFFLINE_CACHE && key !== DATA_CACHE) {
            return caches.delete(key);
          }
        }),
      );
    })(),
  );
  self.clients.claim();
});

// Occurs whenever the main app thread makes a network request
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/fetch_event
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Add a parameter to track media control activations
  if (event.request.mode === "navigate" && event.request.referrer === "") {
    // This might be from a lock screen tap
    const modifiedUrl = new URL(requestUrl);
    modifiedUrl.searchParams.set('media_activation', '1');
    event.respondWith(
      fetch(modifiedUrl.toString()).catch(() => {
        return handleNavigationRequest(event);
      })
    );
    return;
  }
  
  if (event.request.mode === "navigate") {
    handleNavigationRequest(event);
  } else if (CACHE_STATIC_FILES.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            return caches.open(OFFLINE_CACHE).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      }),
    );

    // Fetches data from the network and updates the cache with the new data
    // If unable to, then it fetches from the cache instead, which can be used offline
  } else if (requestUrl.pathname.startsWith("/bookmarks_in_pipeline")) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      }),
    );
  }
});

// Returns a preloaded response if it is enabled.
// Otherwise it makes a network fetch and if that fails, it returns the offline fallback page
function handleNavigationRequest(event) {
  event.respondWith(
    (async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        const response = preloadResponse
          ? preloadResponse
          : await fetch(event.request);
        return response;
      } catch (error) {
        const cache = await caches.open(OFFLINE_CACHE);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })(),
  );
}
