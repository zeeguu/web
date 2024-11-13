const OFFLINE_VERSION = 1;
const OFFLINE_CACHE_NAME = "offline-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
const NOTIFICATION_CACHE_NAME = "notification-cache-v1";
const OFFLINE_URL = "offline.html";
const assets = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/static/fonts/montserrat.css",
  "/logo192.png",
  "/favicon.ico",
];
let sessionId = null;
let notificationTimer = null;

self.addEventListener("message", async (event) => {
  if (event.data.sessionId) {
    sessionId = event.data.sessionId;
    const cache = await caches.open(NOTIFICATION_CACHE_NAME);
    const response = new Response(JSON.stringify(event.data.timestamp));
    await cache.put("lastInteractionTime", response);
    console.log("Session ID updated in service worker:", sessionId);
  }
  startPollingNotifications();
});

function startPollingNotifications() {
  if (notificationTimer !== null) {
    console.log("Polling already running.");
    return;
  }
  pollNotifications();
}

async function pollNotifications() {
  if (!sessionId || Notification.permission !== "granted") {
    return;
  }

  const canSendNotification = await shouldSendNotification();
  if (!canSendNotification) {
    console.log("Notification was recently shown. Skipping notification.");
    notificationTimer = setTimeout(pollNotifications, 5000);
    return;
  }
  try {
    // Temporary json file/endpoint until I've received new endpoint
    // const response = await fetch(`https://api.zeeguu.org/available_languages`);
    const response = await fetch(`/mock_notification.json`);
    if (response.ok) {
      const data = await response.json();
      const randomNumber = Math.floor(Math.random() * 4);
      const notificationUrl = data[randomNumber].url
        ? data[randomNumber].url
        : "/articles";
      if (data) {
        self.registration.showNotification("Zeeguu Notification", {
          body: data[randomNumber].message,
          icon: "/logo192.png",
          tag: "zeeguu-notification",
          data: { url: notificationUrl },
        });
        await updateLastNotificationTime();
      }
    }
  } catch (error) {
    console.error("Error polling notifications:", error);
  }

  //Receive notification every 5 seconds (5000 as setTimeout uses milliseconds)
  notificationTimer = setTimeout(pollNotifications, 5000);
}

async function shouldSendNotification() {
  try {
    const cache = await caches.open(NOTIFICATION_CACHE_NAME);
    const responseNotification = await cache.match("lastNotificationTime");
    const responseInteraction = await cache.match("lastInteractionTime");
    const lastNotificationTime = responseNotification
      ? await responseNotification.json()
      : null;
    const lastInteractionTime = responseInteraction
      ? await responseInteraction.json()
      : null;

    const notificationThreshold = 5000;
    const interactionThreshold = 10000;

    const canSendNotification =
      (!lastInteractionTime ||
        Date.now() - lastInteractionTime >= interactionThreshold) &&
      (!lastNotificationTime ||
        Date.now() - lastNotificationTime >= notificationThreshold);
    return canSendNotification;
  } catch (error) {
    console.error("Error checking notification time from cache:", error);
    return true;
  }
}

async function updateLastNotificationTime() {
  try {
    const cache = await caches.open(NOTIFICATION_CACHE_NAME);
    const response = new Response(JSON.stringify(Date.now()));
    await cache.put("lastNotificationTime", response);
  } catch (error) {
    console.error("Error updating notification time in cache:", error);
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  console.log("Notification clicked");
  if (notificationTimer) {
    clearTimeout(notificationTimer);
    notificationTimer = null;
  }
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      let matchingClient = null;

      for (const client of allClients) {
        //Should be "zeeguu" in production, but this works for prod
        if (client.url.includes("localhost:3000")) {
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
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      await cache.addAll(assets);
      self.skipWaiting();
    })(),
  );
});

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
            key !== OFFLINE_CACHE_NAME &&
            key !== DATA_CACHE_NAME &&
            key !== NOTIFICATION_CACHE_NAME
          ) {
            return caches.delete(key);
          }
        }),
      );
    })(),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          } else {
            const networkResponse = await fetch(event.request);
            return networkResponse;
          }
        } catch (error) {
          const cache = await caches.open(OFFLINE_CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })(),
    );
  } else if (assets.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            return caches.open(OFFLINE_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      }),
    );
  } else if (requestUrl.pathname.startsWith("/bookmarks_in_pipeline")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) =>
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
