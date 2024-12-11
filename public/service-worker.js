// https://developer.mozilla.org/en-US/docs/Web/API/Cache
const OFFLINE_CACHE = "offline-cache-v1";
const DATA_CACHE = "data-cache-v1";
const NOTIFICATION_CACHE = "notification-cache-v1";
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
let notificationTimer = null;
const tenMinutes = 600000;
const dailyNotificationTime = 20;

// This message is sent from index.html to provide the session id and timestamp to handle notifications.
// event will have this data due to the index.html sending a postMessage with this data.
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/message_event
self.addEventListener("message", async (event) => {
  if (event.data.sessionId) {
    sessionId = event.data.sessionId;
    console.log("Session ID updated in service worker:", sessionId);
    const nextNotificationTime = await getCachedNotificationTime();

    // Schedules notification at first time use or if it's past 8 PM
    // Schedules notification for the next time it'll be 8 PM on the current or next day
    if (!nextNotificationTime || new Date().getTime() > nextNotificationTime) {
      scheduleNotification(true);
    } else {
      // Schedules a notification for 8 PM or 10 minutes later if a notification wasn't received on today
      scheduleNotification(false, nextNotificationTime - new Date().getTime());
    }
  }
});

//Schedule a notification to be polled every day at 8 PM
async function scheduleNotification(
  isNotificationSent = false,
  timeDelay = null,
) {
  const currentTime = new Date();
  if (isNotificationSent) {
    // Logic for scheduling a notification for the next day
    const nextNotificationTime = new Date();
    nextNotificationTime.setHours(dailyNotificationTime, 0, 0, 0);

    if (currentTime.getTime() > nextNotificationTime.getTime()) {
      nextNotificationTime.setDate(currentTime.getDate() + 1);
    }

    const nextNotificationTimestamp = nextNotificationTime.getTime();
    await cachedNotificationTime(nextNotificationTimestamp);
    scheduleNextPoll(nextNotificationTimestamp - currentTime.getTime());
  } else if (timeDelay !== null) {
    // Logic for for retrying to send a notification after 10 minutes
    const notificationRetryTimestamp = currentTime.getTime() + timeDelay;
    await cachedNotificationTime(notificationRetryTimestamp);
    scheduleNextPoll(timeDelay);
  } else {
    console.error("Invalid scheduling parameters");
  }
}

// Caches the timestamp for when the next notification should be sent
async function cachedNotificationTime(time) {
  const cache = await caches.open(NOTIFICATION_CACHE);
  const response = new Response(JSON.stringify({ nextNotificationTime: time }));
  await cache.put("nextNotificationTime", response);
}

async function getCachedNotificationTime() {
  const cache = await caches.open(NOTIFICATION_CACHE);
  const response = await cache.match("nextNotificationTime");
  if (response) {
    const data = await response.json();
    return data.nextNotificationTime;
  }
  return null;
}

// Receive notification everyday at 8 PM.
// If no notifications are available check again every 10 minutes (600000 as setTimeout uses milliseconds)
function scheduleNextPoll(timeDelay) {
  if (notificationTimer !== null) {
    clearTimeout(notificationTimer);
  }
  if (timeDelay > 0) {
    notificationTimer = setTimeout(() => {
      pollNotifications();
    }, timeDelay);
  } else {
    console.error("Invalid time delay parameter:", timeDelay);
  }
}

async function pollNotifications() {
  // Will not start polling without a session id and enabled notification permissions
  if (!sessionId || Notification.permission !== "granted") {
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

      scheduleNotification(true);
    } else {
      console.log("No notifications are currently available");
      scheduleNotification(false, tenMinutes);
    }
  } catch (error) {
    console.error("Failed to poll notifications:", error);
    scheduleNotification(false, tenMinutes);
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

/* This function is currently not used, as we send notifications at a specific time slot
   If more advanced logic for sending notifications will be implemented in the future, this functionality will be used

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
      Date.currentTime() - lastNotificationTime >= notificationThreshold;

    return shouldNotify;
  } catch (error) {
    console.error(
      "Failed to retrieve notification timestamp from cache:",
      error,
    );
    return true;
  }
}

async function updateLastNotificationTime() {
  try {
    const cache = await caches.open(NOTIFICATION_CACHE);
    const response = new Response(JSON.stringify(Date.currentTime()));
    await cache.put("lastNotificationTime", response);
  } catch (error) {
    console.error("Failed to update notification timestamp in cache:", error);
  }
} */

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

      // iterate over all the cache keys and delete everything but
      // the keys that we use
      // ... why do we need to do this? what other caches are there?
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

    // Fetches data from the network and updates the cache with the new data
    // If unable to, then it fetches from the cache instead, which can be used offline
  } else if (requestUrl.pathname.startsWith("/bookmarks_in_pipeline")) {
    event.respondWith(
      // ML: as far as we can tell, once the words have been cached, they will never be refreshed
      // because this match will succeed, and then this first if will be true, and then we will always
      // return the same words
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