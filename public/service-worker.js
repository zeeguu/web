//https://developer.mozilla.org/en-US/docs/Web/API/Cache
const OFFLINE_CACHE = "offline-cache-v1";
const DATA_CACHE = "data-cache-v1";
const NOTIFICATION_CACHE = "notification-cache-v1";
const OFFLINE_URL = "offline.html";
//Is localhost until I have an endpoint
const ENDPOINT_URL = "localhost:3000";

//These are the files downloaded into the cache for the PWA
//If more offline pages are created for the PWA, they need to be added here
const CACHE_STATIC_FILES = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/static/fonts/montserrat.css",
  "/logo192.png",
  "/favicon.ico",
];
let sessionId = null;
let notificationTimer = null;

// This message is sent from index.html to provide the session id and timestamp to handle notifications.
// event will have this data due to the index.html sending a postMessage with this data.
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event
self.addEventListener("message", async (event) => {
  if (event.data.sessionId) {
    sessionId = event.data.sessionId;
    console.log("Session ID updated in service worker:", sessionId);
  }
  pollNotifications();
});

async function pollNotifications() {
  // Will not start without a session ID or notification permissions
  if (!sessionId || Notification.permission !== "granted") {
    scheduleNextPoll();
    return;
  }
  if (!(await canSendNotification())) {
    console.log("Notification was recently shown. Skipping notification.");
    scheduleNextPoll();
    return;
  }

  try {
    const data = await fetchNotificationData();
    if (data) {
      // These random numbers will be removed with the new endpoint
      const randomNumber = Math.floor(Math.random() * 4);
      const notificationUrl = data[randomNumber].url
        ? data[randomNumber].url
        : "/articles";

      self.registration.showNotification("Zeeguu Notification", {
        body: data[randomNumber].message,
        icon: "/logo192.png",
        tag: "zeeguu-notification",
        data: { url: notificationUrl },
      });
      await updateLastNotificationTime();
    }
  } catch (error) {
    console.error("Failed to poll notifications:", error);
  }
  scheduleNextPoll();
}

async function fetchNotificationData() {
  try {
    // Temporary json file/endpoint until I've received new endpoint
    // const response = await fetch(`https://api.zeeguu.org/available_languages`);
    const response = await fetch(`/mock_notification.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch notificaiton data", error);
  }
}

async function canSendNotification() {
  try {
    const cache = await caches.open(NOTIFICATION_CACHE);
    const cachedNotificationTimestamp = await cache.match(
      "lastNotificationTime",
    );
    const lastNotificationTime = cachedNotificationTimestamp
      ? await cachedNotificationTimestamp.json()
      : null;

    const notificationThreshold = 5000;

    const shouldNotify =
      !lastNotificationTime ||
      Date.now() - lastNotificationTime >= notificationThreshold;

    return shouldNotify;
  } catch (error) {
    console.error("Error checking notification time from cache:", error);
    return true;
  }
}

async function updateLastNotificationTime() {
  try {
    const cache = await caches.open(NOTIFICATION_CACHE);
    const response = new Response(JSON.stringify(Date.now()));
    await cache.put("lastNotificationTime", response);
  } catch (error) {
    console.error("Error updating notification time in cache:", error);
  }
}

// Receive notification every 5 seconds (5000 as setTimeout uses milliseconds)
function scheduleNextPoll() {
  if (notificationTimer !== null) {
    clearTimeout(notificationTimer);
  }
  notificationTimer = setTimeout(pollNotifications, 5000);
}

// Used for handling notification clicks
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data) {
    // Use event.waitUntil to ensure that all client handling is completed before terminating the service worker
    // https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
    event.waitUntil(
      (async () => {
        const allClients = await clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });
        let matchingClient = null;
        for (const client of allClients) {
          //Should be "zeeguu" in production, but this works for prod
          if (client.url.includes(ENDPOINT_URL)) {
            matchingClient = client;
            break;
          }
        }
        if (matchingClient) {
          console.log("Focusing on the existing Zeeguu client.");
          matchingClient.focus();
          matchingClient.navigate(event.notification.data.url);
        } else {
          console.log("No existing client found, opening a new window.");
          await clients.openWindow(event.notification.data.url);
        }
      })(),
    );
  }
});

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
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          if (
            key !== OFFLINE_CACHE &&
            key !== DATA_CACHE &&
            key !== NOTIFICATION_CACHE
          ) {
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
    // Tries to serve the requested data from the DATA_CACHE
    // If unable to, then it makes a network fetch and stores the data in the cache
  } else if (requestUrl.pathname.startsWith("/bookmarks_in_pipeline")) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) =>
        cache.match(event.request, { ignoreSearch: true }).then((response) => {
          if (response) {
            return response;
          } else {
            return fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
        }),
      ),
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
