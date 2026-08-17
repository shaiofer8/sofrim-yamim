# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-story-1-1-color-typography-tokens.md`
  summary: Heebo font loads from Google Fonts CDN (cross-origin) and is not cached by the service worker, so it does not persist for fully-offline first-loads and adds a third-party network dependency — self-hosting the woff2 subset (hebrew+latin, weights 400-800) would fix both, but reliable extraction of per-weight files needs verification in a real browser context, not automated here.
  evidence: Blind-hunter review of Story 1.1 (style.css/index.html/service-worker.js diff) flagged this; assessed as non-blocking because FR-11's actual offline acceptance criterion is about event data (localStorage), not font rendering — missing custom font offline degrades gracefully to the existing system-font fallback chain, it does not break functionality.
