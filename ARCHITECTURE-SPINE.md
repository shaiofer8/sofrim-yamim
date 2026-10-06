---
title: Referral System Architecture Spine
status: draft
created: 2026-10-06
updated: 2026-10-06
altitude: Feature
---

# Referral System — Architecture Spine

## Paradigm

**Event-driven, stateless share flow** with a minimal backend tracking layer. Share initiates a **native system action** (not app-managed); backend is analytics-only. The spine mirrors the user journey: tap → share → deep link → analytics log.

---

## Decisions

### AD-1: Share via Native System

**Rule:** Share button invokes `navigator.share()` (or platform-equivalent fallback). App does **not** manage the share UI; the OS handles it.

**Binds:** Share sheet, available channels, message formatting — inherited from system defaults, not reimplemented in app.

**Prevents:** Custom share UI, channel prioritization, share failure handling (system owns that).

**Implementation:**
```javascript
// index.html / app.js
function shareApp() {
  const referralCode = getUserReferralCode(); // e.g., "user_12345"
  navigator.share({
    title: "סופרים ימים",
    text: i18n.t("referral.shareText"), // "בואו לקרוא ספרים..."
    url: `https://sofrim.app/?ref=${referralCode}`
  }).catch(err => console.log("Share cancelled"));
}
```

**[ASSUMPTION]:** `getUserReferralCode()` returns a deterministic, 1:1 code per user (e.g., hash of user ID). On app first-run, generate and store in localStorage.

---

### AD-2: Deep Link Resolution (Firebase Dynamic Links)

**Rule:** Referral URLs are **Firebase Dynamic Links** (free tier). Format:
```
https://sofrim.page.link/?link=https%3A%2F%2Fsofrim.app%2F%3Fref%3DUSER_CODE&apn=com.sofrimyamim.app&isi=IPHONE_APP_ID
```

**Binds:**
- Android: Routes to Google Play listing with `ref=` param preserved
- iOS: Routes to App Store with `ref=` param preserved
- Web fallback: Landing page with "Download" CTA

**Prevents:** Custom redirect logic, URL shortening service dependency, manual platform routing.

**Implementation:**
- Firebase Console: Create Dynamic Link domain (`sofrim.page.link` or similar)
- Backend generates FDL on-demand: `POST /api/referral/generateLink?userCode=abc123` returns full FDL
- Frontend embeds FDL in share message

**[ASSUMPTION]:** Firebase console is configured; `sofrim.page.link` domain is active.

---

### AD-3: Analytics Events (Google Analytics 4)

**Rule:** Two GA4 events track the referral funnel; no other backend state is mutated.

**Events:**
1. **`referral_share_initiated`**
   - Fired: User taps Share button
   - Params: `user_id`, `timestamp`
   - No user-facing side effects

2. **`referral_link_opened`**
   - Fired: App starts with `?ref=` in URL
   - Params: `referrer_user_id`, `referee_user_id` (or referrer only if new user)
   - Logged via Firebase SDK on app init

**Binds:** Event names, parameter shape, emission point in code.

**Prevents:** Custom logging service, database mutations on referral, user-facing dashboard.

**Implementation:**
```javascript
// app.js — on app init
function initReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get("ref");
  
  if (refCode) {
    // Log analytics
    gtag("event", "referral_link_opened", {
      referrer_user_id: refCode,
      timestamp: new Date().toISOString()
    });
  }
  
  // Share button
  document.getElementById("shareBtn").addEventListener("click", () => {
    gtag("event", "referral_share_initiated", {
      user_id: getCurrentUserId(),
      timestamp: new Date().toISOString()
    });
    shareApp();
  });
}
```

**[ASSUMPTION]:** GA4 is already integrated (it is); event names don't collide with existing events.

---

### AD-4: Localization (Hebrew + English)

**Rule:** Share message respects app's current language setting (`i18n.getLanguage()`).

**Binds:** Message template in `i18n.js`:
- `referral.shareText.he` = "בואו לקרוא ספרים בסופרים ימים! [link]"
- `referral.shareText.en` = "Check out Sofrim Yamim for awesome books! [link]"

**Prevents:** Hard-coded English-only share message.

**Implementation:** Use existing i18n infrastructure (`t()` function already in place from Sofrim's i18n.js).

---

### AD-5: User Referral Code Generation

**Rule:** On app first-run, generate and persist a **unique user referral code**. Code is deterministic (same user = same code, across sessions/devices where login syncs).

**Code format:** `ref_${base64(user_id)}` (e.g., `ref_dXNlcl8xMjM0NQ==`)

**Storage:** localStorage key `sofrim_referral_code`

**Binds:** Code determinism (same user can't have multiple codes), uniqueness per user.

**Prevents:** Collision, re-generation on each share.

**Implementation:**
```javascript
function getOrCreateReferralCode() {
  let code = localStorage.getItem("sofrim_referral_code");
  if (!code) {
    const userId = getCurrentUserId(); // assume already available
    code = `ref_${btoa(userId)}`; // base64
    localStorage.setItem("sofrim_referral_code", code);
  }
  return code;
}
```

**[ASSUMPTION]:** `getCurrentUserId()` is available (existing auth system). If user signs out/in across devices, code should sync with profile (defer this; for MVP, localStorage is enough).

---

## Boundaries

| Component | Owns | Does NOT Own |
|-----------|------|--------------|
| **Frontend (app.js)** | Share button UI, event emission, i18n lookup | Share sheet UI, channel routing, message formatting (system owns) |
| **Backend (Node.js, if needed)** | Referral code → user ID mapping (optional), GA4 relay (optional) | Analytics storage, user dashboard |
| **Firebase Dynamic Links** | URL redirection, platform routing | — |
| **Google Analytics 4** | Event ingestion, funnel reporting | — |

---

## State & Mutation

**State lived in app:**
- `localStorage.sofrim_referral_code` — user's referral code (write-once, never updated)
- GA4 events — sent to Google, no local persistence

**No database mutations** on referral (no "referrer → referee" row written). Backend is read-only from referral's perspective; if in future you want to surface "you helped X friends," that's a new feature (blocked by AD-3).

---

## Data Ownership

| Data | Owner | Lifecycle |
|------|-------|-----------|
| User referral code | Frontend (localStorage) | Generated on first run, never changes |
| GA4 events | Google Analytics | Sent on-demand, owned by GA |
| User ID (in event param) | Firebase Auth | From existing auth system |

---

## Diagrams

### User Flow

```
┌─────────────┐
│ User opens  │
│  app + home │
└──────┬──────┘
       │
       ├─→ [If ?ref= in URL]
       │   ├─ Log "referral_link_opened" event (GA4)
       │   └─ Continue normally
       │
       └─→ [If no ?ref=]
           └─ Continue normally
               │
               ├─→ [User taps Share btn]
               │   ├─ Log "referral_share_initiated" (GA4)
               │   ├─ Get user's referral code (localStorage)
               │   ├─ Build URL: sofrim.app?ref=CODE
               │   ├─ Call navigator.share({title, text, url})
               │   └─ System opens share sheet
               │
               └─→ [User picks WhatsApp/Telegram/SMS/Email]
                   └─ Send message with URL
                       │
                       └─→ [Friend receives]
                           └─ Clicks URL
                               └─ Firebase Dynamic Link resolves
                                   ├─ Android → Google Play listing
                                   ├─ iOS → App Store listing
                                   └─ Web → Landing + download CTA
```

### Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Share Button + Event Emission (app.js)           │   │
│  │ - navigator.share()                              │   │
│  │ - GA4 events ("share_initiated", "link_opened")  │   │
│  │ - localStorage (referral code)                   │   │
│  │ - i18n lookup (share message)                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │
         │ (navigator.share())
         │
┌─────────────────────────────────────────────────────────┐
│                   OS Share Sheet                         │
│  (Android Chooser / iOS UIActivityViewController)       │
└─────────────────────────────────────────────────────────┘
         │
         ├─ WhatsApp
         ├─ Telegram
         ├─ SMS
         ├─ Email
         └─ [System defaults]
             │
             └─ Message sent: "sofrim.app?ref=CODE"
                 │
                 └─→ Firebase Dynamic Links (sofrim.page.link)
                     │
                     ├─ Android → Google Play + ?ref=CODE
                     ├─ iOS → App Store + ?ref=CODE
                     └─ Web → sofrim.app?ref=CODE
```

---

## Deferred (Not Decided Yet)

- **User dashboard:** "You helped X friends download" — requires DB mutation, deferred to future feature
- **Referral rewards/incentives:** Explicitly out-of-scope per PRD; if added later, it's a new feature
- **Deep link verification (user_id from token):** For MVP, `ref=CODE` is opaque to app; verification happens backend if/when you log referrer→referee pairs
- **Multi-device referral code sync:** If user signs out/in on different device, code reverts to localStorage default. Sync via Firebase Auth (user profile custom claims) deferred

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Frontend** | JavaScript + existing i18n.js | — | No new frameworks |
| **Share API** | `navigator.share()` | Web Standard | Fallback: copy to clipboard |
| **Analytics** | Google Analytics 4 | v4 | Already integrated in Sofrim |
| **Deep Links** | Firebase Dynamic Links | Free tier | Google configuration |
| **Storage** | localStorage | Web Standard | User referral code |
| **Localization** | Existing i18n.js (HE + EN) | — | No new translations needed |

---

## Implementation Checklist

- [ ] Add Share button to index.html (header, next to Settings)
- [ ] Implement `getOrCreateReferralCode()` in app.js
- [ ] Wire Share button click → `navigator.share()` + GA4 event
- [ ] Add GA4 events: "referral_share_initiated" + "referral_link_opened"
- [ ] Configure Firebase Dynamic Links (console setup, domain)
- [ ] Add share message to i18n.js (HE + EN)
- [ ] Test: Share → WhatsApp/Telegram/SMS → Click link → Verify GA4 events
- [ ] CSS for Share button (icon + styling)

---

## Open Questions / Risks

- **[ASSUMPTION]** Firebase console is configured; needs manual setup (not automated)
- **[ASSUMPTION]** `getCurrentUserId()` always returns a valid ID (auth system is working)
- **[ASSUMPTION]** localStorage is persistent (not cleared on app uninstall, but PWA lifecycle is uncertain)
- **[QUESTION]** Should we log referrer → referee mapping in a database? (Deferred; out-of-scope for v1)
- **[RISK]** iOS App Store listing must be published first (else Dynamic Link has no iOS target). Verify App Store upload before launch.

---

## Status

**Ready for:** Feature spec breakdown (`bmad-create-epics-and-stories`) or direct build (`bmad-build`).

**Next:** Validate against PRD, then build.
