// Reminders (Epic 2). Loaded after app.js (AD-1) -- may reference its
// globals (loadEvents, saveEvents) but never the reverse.

// Story 2.1: minimal read-only-for-the-Service-Worker snapshot of events.
// AD-2: localStorage stays the single source of truth for the page; the
// Service Worker has no access to it at all, so this is its only way to
// know what events exist. One-way only -- page code (app.js, this file)
// never reads this snapshot back.
//
// Contract for Story 2.4 (the Service Worker's Periodic Background Sync
// handler, not yet built): these exact literals must match on that side
// too. There's no shared-module mechanism between page scripts and
// service-worker.js in this build-less project (AD-1) -- both sides
// necessarily hardcode the same values, so keep them in sync by hand.
const EVENTS_DB_NAME = "sofrim-yamim-db";
const EVENTS_DB_VERSION = 1;
const EVENTS_STORE_NAME = "events"; // object store keyPath: "id"; records: { id, name, date }

function openEventsDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const request = indexedDB.open(EVENTS_DB_NAME, EVENTS_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(EVENTS_STORE_NAME)) {
        db.createObjectStore(EVENTS_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    // A stale connection held open elsewhere (e.g. another tab) can block
    // a version-change request indefinitely, with neither onsuccess nor
    // onerror ever firing -- reject explicitly instead of hanging forever.
    request.onblocked = () => reject(new Error("IndexedDB open blocked (another tab may have it open)"));
  });
}

async function writeSnapshot(events) {
  const db = await openEventsDB();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(EVENTS_STORE_NAME, "readwrite");
      const store = tx.objectStore(EVENTS_STORE_NAME);
      store.clear();
      for (const ev of events) {
        // keyPath is "id" -- a record missing one would throw and abort
        // the whole transaction, silently dropping every otherwise-valid
        // event in this sync cycle. Skip just the bad record instead.
        if (!ev?.id) continue;
        store.put({ id: ev.id, name: ev.name, date: ev.date });
      }
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

// Full clear-then-rewrite on every call: simplest correct way to keep the
// snapshot in exact sync with localStorage (add/edit/delete all funnel
// through this), and this app's event counts are small enough that this
// is not a performance concern.
//
// Calls are chained through this queue rather than fired independently,
// so two saveEvents() calls in quick succession (e.g. a fast double-tap
// on Save) can't race and leave the snapshot on a stale intermediate
// state instead of the final one -- each sync now waits for the previous
// one to finish before starting.
let snapshotQueue = Promise.resolve();

function syncIndexedDBSnapshot(events) {
  snapshotQueue = snapshotQueue
    .catch(() => {}) // don't let one failure poison the chain for later calls
    .then(() => writeSnapshot(events))
    .catch((err) => {
      // Silent fail, matching this epic's convention (AD-6 area): reminders
      // are a best-effort layer on top of the app, never a blocker for the
      // core countdown functionality saveEvents() is part of.
      console.warn("syncIndexedDBSnapshot failed (non-blocking):", err);
    });
  return snapshotQueue;
}

// Backfill on load: without this, a returning user who doesn't touch
// their event list after this feature ships would keep an empty/stale
// snapshot indefinitely, since syncIndexedDBSnapshot() only otherwise
// runs from inside saveEvents().
syncIndexedDBSnapshot(loadEvents());

// Story 2.2 / FR-6: request Notification permission exactly once, right
// after the user's very first-ever new event save (manual add or a
// holiday preset) -- never at onboarding, and never asked again
// regardless of the outcome. Per the architecture spine, app.js doesn't
// call this directly -- it dispatches a plain DOM CustomEvent on every
// new-event save (never on edits) and doesn't know or care who's
// listening; this file hooks in independently.
const NOTIF_PROMPT_SHOWN_KEY = "sofrim-yamim.notif-prompt-shown.v1";

function maybeRequestNotificationPermission() {
  try {
    if (localStorage.getItem(NOTIF_PROMPT_SHOWN_KEY)) return; // already attempted the request, ever -- FR-6: once only
    if (!("Notification" in window)) return; // unsupported context (e.g. some in-app browsers)
    if (Notification.permission !== "default") return; // already decided via some other path -- don't re-prompt
    // Marked *before* requesting, so even if the call throws synchronously
    // (some embedded/in-app browser contexts do, e.g. without a live user
    // gesture) this still counts as "attempted" and is never retried
    // automatically. Story 2.3's Settings toggle, when a user re-enables
    // notifications after having denied them, calls
    // Notification.requestPermission() directly itself -- this function
    // is intentionally single-use and isn't the path for that.
    localStorage.setItem(NOTIF_PROMPT_SHOWN_KEY, "1");
    Notification.requestPermission().catch(() => {
      // Denial isn't an error path here -- FR-6: must never block anything
      // else in the app. Nothing to do; the permission state itself
      // (Notification.permission) is what everything downstream checks.
    });
  } catch {
    // Belt-and-suspenders: some environments throw synchronously instead
    // of rejecting a promise (or expose a legacy callback-only signature
    // with no Promise return at all, making the .catch() above itself
    // throw a TypeError). Either way, this must never propagate out to
    // the event dispatch in app.js and interrupt anything there.
  }
}

document.addEventListener("sofrim-yamim:event-added", maybeRequestNotificationPermission);
