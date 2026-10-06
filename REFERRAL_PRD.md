---
title: Referral System for Sofrim Yamim
status: final
created: 2026-10-06
updated: 2026-10-06
owner: Shai Ofer
---

# Referral System for Sofrim Yamim

## Overview

Add a **Share button** to Sofrim Yamim that allows users to send app referral links via WhatsApp, Telegram, SMS, and Email. No incentives, no tracking UI — pure viral organic growth through word-of-mouth.

**Goal:** Increase app downloads organically by making sharing frictionless.

---

## Vision

A user reading a book in Sofrim Yamim wants to tell a friend about the app. They click **"📤 Share"** → system opens native share sheet → they pick WhatsApp/Telegram/SMS/Email → send. Friend clicks link → installs app → opens. **Done.**

**No rewards. No "you helped X friends" counter. No friction.**

The app grows because people love it and sharing is one tap away.

---

## Scope

### Features

**FR-1: Share Button**
- Location: Header (top-right, next to Settings ⚙️)
- Icon: 📤 or ↗️
- Placement: Visible on every main screen (home, book detail, search results)
- Language: "שתף" (Hebrew) / "Share" (English) — auto-detect from app lang setting

**FR-2: Native Share Sheet**
- Tap button → system opens native share chooser (Android: share chooser, iOS: UIActivityViewController)
- Available channels: WhatsApp, Telegram, SMS, Email, + system defaults
- Message template (auto-generated):
  - Hebrew: "בואו לקרוא ספרים בסופרים ימים! [link]"
  - English: "Check out Sofrim Yamim — awesome books! [link]"

**FR-3: Deep Link**
- Format: `https://sofrim.app/?ref=USER_REF_CODE`
- Resolves to: Google Play Store listing (Android) / App Store listing (iOS)
- Tracking: Backend logs referrer → referee (analytics only, no user-facing counter)

**FR-4: Analytics Event**
- Event: "referral_share_initiated" — logged when user taps Share
- Event: "referral_link_opened" — logged when someone opens ref link (backend, not required in v1)
- No UI display needed

### Non-Scope

- Incentive system (no rewards)
- User-facing referral dashboard ("you helped X friends")
- Leaderboards, badges, achievements
- Custom short URLs (use Firebase Dynamic Links)
- Email tracking, UTM parameters beyond `ref=`

---

## Technical Architecture

### Frontend (Client)

```
Share Button Click
    ↓
Call navigator.share() with:
  {
    title: "סופרים ימים",
    text: "בואו לקרוא ספרים!",
    url: "https://sofrim.app/?ref={USER_UNIQUE_CODE}"
  }
    ↓
System opens native share sheet
    ↓
User selects WhatsApp/Telegram/SMS/etc
    ↓
Message sent with deep link
```

**Implementation:** 10 lines of JavaScript in `index.html` + CSS for button styling.

### Backend

**Deep Link Resolution:**
- Firebase Dynamic Links (FREE tier, unlimited redirects)
  - Setup: Create dynamic link `https://sofrim.page.link/?link=https://sofrim.app/?ref=ABC123&apn=com.sofrimyamim.app&isi=...`
  - Automatically routes: Android → Google Play, iOS → App Store
  - Fallback: Web landing page with "Download" CTA

**Analytics Logging:**
- Event: `referral_share_initiated` → Google Analytics 4
- Event: `referral_link_opened` → logged via Firebase SDK when app opens with `?ref=` param
- No user PII, no tracking beyond "referrer ID → referee ID"

### Localization (Hebrew + English)

- Button label: "שתף" (HE) / "Share" (EN) — respects app language setting
- Share message: Template in 2 languages, sent in user's current app language
- Deep link: Works globally, language-agnostic

---

## Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Share button usage rate | 2-5% of daily active users | Week 2-4 |
| Referral-sourced installs | 5-10% of new installs | Month 1-2 |
| Referral link CTR | 15-25% (friends who receive → click) | Month 1 |

---

## Rollout Plan

**Phase 1 (Day 1-2):** Frontend + Analytics wiring  
**Phase 2 (Day 3):** Firebase Dynamic Links setup  
**Phase 3 (Day 4):** QA + Hebrew/English testing  
**Phase 4 (Day 5):** Push to production

---

## Dependencies

- Firebase Dynamic Links (free, requires project setup)
- Google Analytics 4 (already integrated in Sofrim)
- Native `navigator.share()` API support (all modern browsers + native WebView)

---

## Open Questions

None — ready to spec Architecture + start build.
