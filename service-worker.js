const CACHE_NAME = "sofrim-yamim-v35";
// Relative (no leading "/"): resolved against this file's own location, so
// this works whether the app is deployed at a domain root or under a
// subpath (e.g. a GitHub Pages project site at /sofrim-yamim/) without any
// per-deployment configuration. Root-absolute paths broke exactly this case
// -- caught when redeploying to https://shaiofer8.github.io/sofrim-yamim/.
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./holidays.js",
  "./notifications.js",
  "./billing.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Same-origin only. Without this, cross-origin requests -- Google
  // Fonts (Story 1.1), and since Story 3.1 the AdSense script/ad
  // iframes/pixels -- would run through this cache-then-network-race
  // logic too, which is unnecessary overhead for assets this app never
  // intends to cache, and a real risk for ad-serving specifically (ad
  // networks often depend on cookies/redirect behavior this generic
  // handler doesn't preserve).
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

// Story 2.4: scheduled reminder via Periodic Background Sync. AD-2: this
// is the ONLY reader of the IndexedDB snapshot notifications.js writes
// (page code never reads it back) -- this file has no access to
// localStorage or app.js at all, by design.
//
// Contract with notifications.js: these exact literals (name, version,
// store name, record shape { id, name, date }) must match what that
// file writes. No shared-module mechanism exists between page scripts
// and this file in this build-less project -- kept in sync by hand.
const EVENTS_DB_NAME = "sofrim-yamim-db";
const EVENTS_DB_VERSION = 1;
const EVENTS_STORE_NAME = "events";
const REMINDER_SYNC_TAG = "sofrim-yamim-reminders";

function openEventsDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(EVENTS_DB_NAME, EVENTS_DB_VERSION);
    // This worker only ever *reads* the store (never writes to it -- AD-2),
    // but it still needs to be able to create it on upgrade, matching
    // notifications.js's own onupgradeneeded exactly. Without this: if
    // periodicsync ever fires before the page has run even once (so the
    // DB doesn't exist yet), this open() call would create the DB at
    // version 1 with NO object store -- and since IndexedDB only fires
    // onupgradeneeded when the requested version is *higher* than what's
    // stored, notifications.js's later open() at the same version 1 would
    // never get a chance to create the store either, permanently breaking
    // the Story 2.1 snapshot until the user clears site data. Whichever
    // side opens the DB first must be able to create the store.
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(EVENTS_STORE_NAME)) {
        db.createObjectStore(EVENTS_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("IndexedDB open blocked"));
  });
}

async function getAllEvents() {
  let db;
  try {
    db = await openEventsDB();
    if (!db.objectStoreNames.contains(EVENTS_STORE_NAME)) return [];
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(EVENTS_STORE_NAME, "readonly");
      const request = tx.objectStore(EVENTS_STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db?.close();
  }
}

function tomorrowDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function notifyForTomorrow() {
  // Whole body in one try/catch (not just the getAllEvents() call) so
  // this can never throw into event.waitUntil() -- AD-6: best-effort,
  // every failure here is silent and never surfaced anywhere.
  try {
    const events = await getAllEvents();
    const tomorrow = tomorrowDateStr();
    const matches = events.filter((ev) => ev && ev.date === tomorrow && ev.name);
    console.debug(`[sofrim-yamim] notifyForTomorrow: ${matches.length} match(es) for ${tomorrow}`);
    for (const ev of matches) {
      try {
        // Without granted permission, showNotification() *rejects* (it
        // does not silently no-op) -- the try/catch here is load-bearing,
        // not a defensive extra.
        await self.registration.showNotification(ev.name, {
          body: "מחר",
          tag: `sofrim-yamim-reminder-${ev.id}`, // shared with notifications.js's fallback check (Story 2.5) -- same tag on purpose, so the two mechanisms collapse into one notification instead of showing two
          renotify: true, // re-alert (sound/vibration) even on a same-tag replacement -- a silent retry that never actually surfaces defeats a best-effort feature that may need exactly that retry
          icon: "./icons/icon-192.png",
          badge: "./icons/icon-192.png",
          dir: "rtl",
          lang: "he",
        });
      } catch (err) {
        console.debug("[sofrim-yamim] showNotification failed (non-blocking):", err);
      }
    }
  } catch (err) {
    console.debug("[sofrim-yamim] notifyForTomorrow failed (non-blocking):", err);
  }
}

self.addEventListener("periodicsync", (event) => {
  if (event.tag === REMINDER_SYNC_TAG) {
    event.waitUntil(notifyForTomorrow());
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ("focus" in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow("./");
        return undefined;
      })
  );
});
