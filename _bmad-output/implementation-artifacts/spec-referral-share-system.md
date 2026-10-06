---
title: Referral Share System — Frontend Implementation
status: in-progress
created: 2026-10-06
updated: 2026-10-06
author: Shai Ofer
altitude: Feature
baseline_commit: a3353fd4b70b8d82be257ee8014f1fb92a0faab7
---

# Referral Share System — Frontend Implementation

<frozen-after-approval>
**User Story:** As a user of Sofrim Yamim, I want to share the app with friends via WhatsApp/Telegram/SMS/Email with a single tap, so they can discover it organically.

**Success Criteria:**
1. Share button visible in header (next to Settings) on every main screen
2. Tap opens native share sheet (system-managed channels: WhatsApp, Telegram, SMS, Email, etc.)
3. Message includes app link with referral code (`?ref=USER_CODE`)
4. GA4 event "referral_share_initiated" logged on button click
5. GA4 event "referral_link_opened" logged when app opens with `?ref=` in URL
6. Share message respects app's current language (Hebrew or English)
7. No database mutations, no user-facing tracking UI
8. One-tap flow, zero friction
</frozen-after-approval>

---

## Technical Context

**Architecture:** Event-driven stateless share flow (see `ARCHITECTURE-SPINE.md`)

**Key Technology Decisions:**
- `navigator.share()` API (native system, not custom UI)
- Firebase Dynamic Links for deep link resolution
- localStorage for referral code persistence
- GA4 for analytics (already integrated)
- Existing i18n.js for Hebrew/English support

---

## Acceptance Criteria

### Feature: Share Button

- [ ] **AC 1.1** Button appears in header (next to Settings icon ⚙️)
- [ ] **AC 1.2** Button icon: 📤 or ↗️
- [ ] **AC 1.3** Label: "שתף" (HE) / "Share" (EN), auto-detects from app lang
- [ ] **AC 1.4** Visible on: home, book detail, search results (all main screens)
- [ ] **AC 1.5** Tap opens native share sheet (no custom UI)
- [ ] **AC 1.6** Message template: "בואו לקרוא ספרים בסופרים ימים! [link]" (HE) / "Check out Sofrim Yamim for awesome books! [link]" (EN)

### Feature: Referral Code Generation

- [ ] **AC 2.1** On first app run, generate unique referral code
- [ ] **AC 2.2** Code format: `ref_${btoa(userId)}` (base64-encoded user ID)
- [ ] **AC 2.3** Store in localStorage key `sofrim_referral_code`
- [ ] **AC 2.4** Code persists across sessions (same user = same code)
- [ ] **AC 2.5** Share URL: `https://sofrim.app/?ref=REFERRAL_CODE`

### Feature: Deep Link

- [ ] **AC 3.1** Referral URL routed via Firebase Dynamic Links (`sofrim.page.link`)
- [ ] **AC 3.2** DL redirects to Google Play (Android) / App Store (iOS) / web landing
- [ ] **AC 3.3** `ref=` param preserved in app URL query string
- [ ] **AC 3.4** App detects `?ref=` on init, logs analytics event

### Feature: Analytics

- [ ] **AC 4.1** Event "referral_share_initiated" logged on Share button click
  - Params: `user_id`, `timestamp`
- [ ] **AC 4.2** Event "referral_link_opened" logged when app starts with `?ref=` in URL
  - Params: `referrer_user_id`, `timestamp`
- [ ] **AC 4.3** No user-facing dashboard or counter (analytics backend only)
- [ ] **AC 4.4** GA4 integration (assumed already present)

### Feature: Localization

- [ ] **AC 5.1** Share message template in i18n.js
  - Key: `referral.shareText.he` and `referral.shareText.en`
- [ ] **AC 5.2** Button label respects current app language setting
- [ ] **AC 5.3** Message sent in user's current language (not OS language)

---

## Code Map

### Existing Reuse Points

| File | Anchor | Purpose | Notes |
|------|--------|---------|-------|
| `app.js` | Line 1: `const STORAGE_KEY = "sofrim-yamim.events.v1"` | Storage pattern | Will create `sofrim_referral_code` key similarly |
| `app.js` | Line 34: `dispatchEventAdded()` | Event dispatch pattern | Can reuse for custom events if needed |
| `i18n.js` | Full file | Localization | Add `referral.shareText` translations here |
| `index.html` | Line 45: `<button id="settingsBtn">` | Header button pattern | Model Share button after this |
| `analytics.js` (if exists) | — | GA4 integration | Hook `referral_share_initiated` + `referral_link_opened` events |

### New Files / Modifications

| Path | Type | What | Notes |
|------|------|------|-------|
| `index.html` | Edit | Add Share button to header | After Settings button, before Add button |
| `app.js` | Edit | Add Share button click handler + referral code init | ~40 lines |
| `i18n.js` | Edit | Add `referral.shareText` translations | 4 lines (2 languages) |
| `app.js` | Edit | Add GA4 event logging on init & button click | ~10 lines, reuse existing gtag() |

### Firebase Dynamic Links Setup

- Firebase console: Create Dynamic Link domain (`sofrim.page.link` or existing)
- Backend endpoint: `POST /api/referral/generateLink?userCode=abc123` (separate from this spec; deferred)
- Frontend: Use hardcoded DL template for MVP, upgrade to backend later

---

## Implementation Sequence

1. **Referral Code Init** (`app.js`) — Run on app init, before render
   - Check localStorage for `sofrim_referral_code`
   - If missing: generate from current user ID, store
   - Expose globally (window.getOrCreateReferralCode())

2. **Share Button UI** (`index.html` + CSS) — Add to header
   - Place next to Settings button
   - Icon + label (i18n)
   - Wire click event

3. **Share Button Handler** (`app.js`) — On click
   - Get referral code
   - Build share URL: `https://sofrim.app/?ref=CODE`
   - Log GA4 "referral_share_initiated" event
   - Call `navigator.share({title, text, url})`

4. **Deep Link Handler** (`app.js`) — On app init
   - Parse URL query string for `?ref=`
   - If present: log GA4 "referral_link_opened" event
   - Continue normal app flow (no side effects)

5. **i18n Translations** (`i18n.js`)
   - Add `referral.shareText` keys
   - Hebrew + English versions

---

## Testing (Acceptance)

### Manual Test Plan

| Scenario | Steps | Expected |
|----------|-------|----------|
| **First-time user opens app** | 1. App loads 2. Check localStorage | Referral code generated and stored |
| **User taps Share button** | 1. Tap Share 2. System shows chooser 3. Pick WhatsApp 4. Verify message | Message includes "sofrim.app?ref=CODE" |
| **GA4 event on share** | 1. Check GA4 dashboard 2. Filter `referral_share_initiated` | Event logged with user_id + timestamp |
| **Friend clicks referral link** | 1. Receive message link 2. Open app via link | URL shows `?ref=CODE` in console; GA4 `referral_link_opened` logged |
| **Language switching** | 1. Change app language to English 2. Share | Message in English ("Check out Sofrim Yamim...") |
| **Repeat share (same user)** | 1. Tap Share again 2. Check localStorage | Same referral code (not regenerated) |

### Automated Testing (if QA framework exists)

- Unit: `getOrCreateReferralCode()` returns consistent code per user ID
- Integration: GA4 events fire correctly (if test GA4 property available)
- E2E: (Optional) Playwright/Cypress: navigate to app, tap share, verify URL in message

---

## Blockers / Open Questions

**None identified.** Spec is ready for implementation.

---

## Deferred

- **Backend Dynamic Link generation:** `POST /api/referral/generateLink` — deferred to v2 (MVP uses hardcoded DL template)
- **User dashboard** ("You helped X friends") — explicitly out-of-scope per PRD
- **Referral rewards** (incentives) — out-of-scope, future feature
- **Multi-device code sync** — deferred; MVP uses localStorage only

---

## Related Artifacts

- **PRD:** `REFERRAL_PRD.md`
- **Architecture Spine:** `ARCHITECTURE-SPINE.md`

---

**Ready for:** Implementation (Step 03)
