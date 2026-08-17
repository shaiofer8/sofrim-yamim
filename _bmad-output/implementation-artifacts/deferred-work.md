# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-story-1-1-color-typography-tokens.md`
  summary: Heebo font loads from Google Fonts CDN (cross-origin) and is not cached by the service worker, so it does not persist for fully-offline first-loads and adds a third-party network dependency — self-hosting the woff2 subset (hebrew+latin, weights 400-800) would fix both, but reliable extraction of per-weight files needs verification in a real browser context, not automated here.
  evidence: Blind-hunter review of Story 1.1 (style.css/index.html/service-worker.js diff) flagged this; assessed as non-blocking because FR-11's actual offline acceptance criterion is about event data (localStorage), not font rendering — missing custom font offline degrades gracefully to the existing system-font fallback chain, it does not break functionality.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-compact-row-tokens.md`
  summary: On `.event-card.past`, the `opacity: 0.55` dimming (pre-existing, unchanged per Story 1.3's own AC) is applied to the whole box including the new keyboard `:focus-visible` outline, so the focus ring on past rows renders at reduced effective opacity — contrast against background hasn't been verified to still clear ~3:1 (WCAG 2.4.7/1.4.11) now that these rows are keyboard-focusable for the first time.
  evidence: Blind-hunter review of Story 1.3 (app.js/style.css diff — role/tabindex/aria-label/keydown added to compact rows) flagged this; not fixed in Story 1.3 because a real fix (moving the "past" dimming off the blunt `opacity` property, e.g. onto per-property alpha-reduced colors) is exactly the kind of manual-contrast-verification work Story 1.5 ("רצפת נגישות בסיסית") is chartered to do across all of Epic 1's interactive components, not a one-line patch scoped to this story.
  **Resolved (Story 1.5, 2026-08-17):** `.event-card.past:focus-visible { opacity: 1; }` — verified via real keyboard Tab navigation (Playwright) that a focused past row measures opacity 0.55→1.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-compact-row-tokens.md`
  summary: `render()` fully rebuilds `#eventList`'s DOM (`innerHTML = ""` then re-append) on every add/edit/delete, so a keyboard user who opens a row via Enter, saves, and expects focus to return near where they were instead loses focus to `<body>` entirely — no focus-restoration was added alongside making rows keyboard-operable. The Hero Card (Story 1.2) has the identical gap.
  evidence: Blind-hunter review of Story 1.3 flagged this; deferred rather than patched because a real fix (track the focused event id before re-render, refocus its equivalent element after) is app-wide focus-management work spanning both Hero Card and Compact Row and multiple trigger paths (save/delete/preset-add), not a change scoped to one component — natural fit for Story 1.5.
  **Resolved (Story 1.5, 2026-08-17):** `focusEventRow()`/`celebrateNewEvent()`/explicit `addBtn.focus()` cover edit, new-add (incl. presets), and delete respectively — verified via Playwright for all three paths.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-accessibility-floor.md`
  summary: No automated test coverage (unit/e2e/axe-style) exists anywhere in this repo for keyboard/focus/touch-target/contrast behavior — every verification in every story so far has been a one-off Playwright script run by the implementing agent, not a committed, re-runnable regression guard.
  evidence: Blind-hunter review of Story 1.5 flagged this. Not fixed here because introducing a test framework is an architectural decision (AD-1 chose zero build-step/vanilla JS specifically; most JS test runners assume Node/npm tooling) that needs human buy-in, not something to decide unilaterally inside an accessibility-floor story.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-microcopy-pass.md`
  summary: `loadEvents()` silently swallows a `JSON.parse` failure (returns `[]`, discarding whatever was actually stored) and `saveEvents()` has no error handling at all — a user whose `localStorage` write silently fails (private/incognito mode, quota exceeded) still sees the "האירוע נשמר." success announcement and celebration, with no indication the save didn't actually persist.
  evidence: Blind-hunter review of Story 1.8 flagged this. Not fixed here because it's a functional gap (missing error-handling + a new failure-state UI surface), not a wording/tone issue — out of scope for a microcopy-alignment pass, which only touches existing user-visible text, not adds new error-handling flows.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-notification-permission.md`
  summary: A web `Notification.requestPermission()` call inside a TWA-wrapped app depends on the wrapping Android app declaring/holding the `POST_NOTIFICATIONS` runtime permission (required on Android 13+) for the browser-level prompt to actually surface at all — nothing in the web code can detect or work around a missing manifest declaration on the native side.
  evidence: Blind-hunter review of Story 2.2 flagged this. Not fixed here because it's entirely outside what JS/web code controls — it's a TWA-wrapper configuration concern for Epic 4 (Story 4.1, Bubblewrap project setup). Flagged here so it isn't silently missed when that story is implemented: verify `POST_NOTIFICATIONS` is declared and check real notification behavior on an Android 13+ test device before relying on this feature in production.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-settings-dialog.md`
  summary: The Settings dialog's notification toggle only re-checks `Notification.permission` when the dialog is opened (and after the user interacts with the toggle itself) — if the user changes the permission via the browser's own site-settings UI (e.g. the address-bar padlock) while the Settings dialog happens to still be open, the toggle/hint go stale until the dialog is closed and reopened.
  evidence: Blind-hunter review of Story 2.3 flagged this. Not fixed here because a live fix requires the `Permissions` API's `PermissionStatus.onchange` event (`navigator.permissions.query({name: "notifications"})`), a meaningfully bigger addition for an edge case (user has both the app's Settings dialog AND the browser's own permission UI open at the same time) that the story's AC doesn't ask for.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-periodic-background-sync.md`
  summary: `notifyForTomorrow()` fires one separate `showNotification()` per matching event with no cap or grouping — a user with several events landing on the exact same date gets a burst of individual notifications instead of one summary notification.
  evidence: Blind-hunter review of Story 2.4 flagged this. Not fixed here because proper grouping (a single "N events tomorrow" notification, or a collapsed/expandable one) is real UX design work the story's AC doesn't ask for, and the current one-per-event behavior is at least correct, just potentially noisy in a rare case (multiple events on the same day).

- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-periodic-background-sync.md`
  summary: The reminder notification's `badge` option reuses the full-color `icons/icon-192.png` asset. Android renders `badge` as a monochrome silhouette mask in the status bar; a detailed full-color icon not designed for that treatment may look wrong/illegible once masked.
  evidence: Blind-hunter review of Story 2.4 flagged this. Not fixed here because it needs a dedicated masked-badge image asset (like `gen_icons.py` produced the existing icons), which is asset-creation work, not something to improvise inline in a code-review fix.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-fallback-reminder-check.md`
  summary: `checkFallbackReminders()` only runs on script load (cold start) and on `visibilitychange`->visible (returning from background) — an app kept open and foregrounded continuously across local midnight, with no backgrounding or reload, never re-checks, so an event that becomes "today" while the tab stays frontmost the whole time can be missed until the next background/foreground cycle.
  evidence: Blind-hunter review of Story 2.5 flagged this. Not fixed here because it matches the story's AC exactly ("האפליקציה נפתחת" — the check runs on open/resume, not continuously) — adding a standing timer to also catch the "left open across midnight" case is a different, additional mechanism the AC doesn't ask for.
