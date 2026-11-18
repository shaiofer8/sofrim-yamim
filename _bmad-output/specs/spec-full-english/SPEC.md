---
id: SPEC-full-english
companions: []
sources:
  - i18n.js
  - index.html
  - app.js
  - holidays.js
  - hebrew-date.js
  - notifications.js
  - billing.js
---

> **Canonical contract.** This SPEC is the complete contract for the full English version of Sofrim Yamim. Source files listed in frontmatter are what the work touches; they are not extra requirements.

# Full English UI

## Why

**An opportunity to capture, plus a defect to close.** Branch `lang-follows-device` already picks the language from the device (or a saved manual choice) and flips `<html lang/dir>`, but almost every visible string is hard-coded Hebrew in `index.html`, `app.js`, `holidays.js`, `notifications.js`, `billing.js` and the Hebrew date picker. An English-speaking user who installs the app from Google Play today gets a Hebrew interface laid out left-to-right, which reads as broken. The owner approved a complete, natural English version so the app can be offered to non-Hebrew speakers without hurting the existing Hebrew experience.

## Capabilities

- **CAP-1**
  - **intent:** Every user-visible string (text, placeholders, `aria-label`, `title`, option labels, toasts/live-region announcements, validation messages, dialogs, settings, share texts, purchase UI, notification titles/bodies) comes from the `i18n.js` dictionaries.
  - **success:** With English active, `document.body.innerText` plus every `placeholder`/`aria-label`/`title` attribute on the main screen, holidays dialog, add-event dialog (Gregorian and Hebrew modes), settings dialog and an event card contains no character in `[֐-׿]`.
- **CAP-2**
  - **intent:** Static markup is translated declaratively (`data-i18n`, `data-i18n-placeholder`, `data-i18n-aria`, `data-i18n-title`) by one function, `applyTranslations()`, that runs on load and on every language change.
  - **success:** Switching language in Settings updates every open and closed screen without a reload, including the event list and the language toggle state.
- **CAP-3**
  - **intent:** Holidays show standard English transliterations (Rosh Hashanah, Yom Kippur, Sukkot, Simchat Torah, Hanukkah, Tu BiShvat, Purim, Passover, Yom HaShoah (Holocaust Remembrance Day), Yom HaZikaron (Memorial Day), Yom Ha'atzmaut (Independence Day), Lag BaOmer, Shavuot, Tisha B'Av). A holiday added from the list in English is saved under its English name.
  - **success:** The holidays dialog in English lists only English names; adding one creates an event card with the English name.
- **CAP-4**
  - **intent:** Dates display as `en-US` short style in English ("Sep 11, 2026") and exactly as today in Hebrew (`he-IL`, long month).
  - **success:** Event cards, hero card, holiday list and the Hebrew-picker preview use the active language's format.
- **CAP-5**
  - **intent:** The Hebrew-calendar picker in English shows transliterated month names (Tishrei, Cheshvan, Kislev, Tevet, Shevat, Adar, Adar I, Adar II, Nisan, Iyar, Sivan, Tammuz, Av, Elul) and Western digits for day and year; the stored value and lookup stay the Hebrew ICU month name.
  - **success:** In English, the day/month/year selects contain no Hebrew letters and choosing a date still fills `#eventDate` with the same ISO date as in Hebrew.
- **CAP-6**
  - **intent:** Count labels read naturally in English and mirror the Hebrew cases: Today / Tomorrow / N days / Yesterday / N days ago, with singular/plural handled.
  - **success:** Cards for today, tomorrow, +2, +N, -1, -2, -N render "Today", "Tomorrow", "2 days", "N days", "Yesterday", "2 days ago", "N days ago".
- **CAP-7**
  - **intent:** English renders left-to-right with no layout breakage at 360 px width, in dark and light themes.
  - **success:** Screenshots at 360x640 of every English screen show no clipped, overlapping or overflowing elements.

## Constraints

- Hebrew UI must look exactly as before: same copy, same markup output, same layout. Hebrew dictionary values are copied verbatim from the current markup and code.
- No change to behavior, storage keys, stored data shape, ads, billing logic, feature flags or the web manifest name.
- Vanilla JS, no build step, no new dependencies; every shipped file stays listed in the service worker `ASSETS`, and `CACHE_NAME` is bumped (v40).
- English layout fixes use logical CSS properties or rules scoped to `[lang="en"]`, never changes that move Hebrew pixels.
- Work stays on branch `lang-follows-device`; nothing is pushed or merged to `main`.

## Non-goals

- Translating event names users already saved (user data stays as entered).
- Translating `privacy-policy.html`, the Play Store listing, or the manifest.
- Adding languages beyond Hebrew and English.
- Localizing the native `<input type="date">` control (the browser renders it in the device locale).
- Rewording any Hebrew copy, including the existing Hebrew referral share text.

## Success signal

- On an English-language phone the whole app, from first launch through adding a holiday, adding a custom event in Hebrew-calendar mode, and opening Settings, shows no Hebrew character; on a Hebrew phone the app is indistinguishable from the previous release.

## Assumptions

- The service worker cannot read the saved manual language (it has no `localStorage`), so its scheduled reminder text follows the device language with the same rules as `i18n.js`. Reminders are disabled by `NOTIFICATIONS_ENABLED = false` today, so this has no user impact now.
- The English referral share text describes the app as a countdown app; the Hebrew text ("בואו לקרוא ספרים...") is kept unchanged per the "no Hebrew copy changes" constraint even though it mentions books.
- The header share fallback prompt ("Share this link:") is already English in both languages and stays as is.
