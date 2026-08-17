---
title: 'Story 2.4: תזכורת מתוזמנת דרך Periodic Background Sync'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 2.1-2.3 בונות את התשתית (תמונת-IndexedDB, הרשאה) — אבל שום דבר לא באמת מעיר את ה-Service Worker כדי לבדוק אירועים ולהראות תזכורת, גם כשהאפליקציה סגורה לגמרי.

**Approach:** `periodicsync` handler ב-`service-worker.js` שקורא את תמונת ה-IndexedDB (AD-2, קריאה-בלבד), מוצא אירועים שתאריכם מחר בדיוק (השוואת מחרוזת-תאריך מקומית), ומראה התראה לכל אחד. רישום ה-periodicSync עצמו בצד-העמוד הוא best-effort לגמרי (AD-6) — כשל צפוי ושקט.

</frozen-after-approval>

## Suggested Review Order

**באג קריטי שנתפס ותוקן לפני commit**

- `openEventsDB` — קיבל `onupgradeneeded` זהה לזה שב-`notifications.js`; בלעדיו, אם ה-SW פותח את ה-DB **ראשון** (למשל periodicsync מתעורר לפני שהעמוד רץ בכלל), הוא היה יוצר DB בגרסה 1 **בלי** ה-store, ונועל את `notifications.js` מלהוסיף אותו לצמיתות (IndexedDB לא מפעיל `onupgradeneeded` שוב באותה גרסה) — `writeSnapshot()` היה נכשל בשקט מאותה נקודה ואילך, בלי שום דרך להתאושש חוץ מניקוי נתוני-אתר
  [`service-worker.js:62`](../../service-worker.js#L62)

**הליבה**

- `notifyForTomorrow` — כל הגוף בבלוק try/catch יחיד (לא רק שלב הקריאה), `console.debug` על הצלחה/כשל (פיצ'ר best-effort קשה-לאימות — שווה נראות למפתח, לא רק שקט מוחלט), `renotify: true` (כדי שניסיון-חוזר על אותו tag עדיין יתריע, לא רק יחליף בשקט)
  [`service-worker.js:113`](../../service-worker.js#L113)

- רישום ה-`periodicsync`/`notificationclick`
  [`service-worker.js:145`](../../service-worker.js#L145), [`service-worker.js:151`](../../service-worker.js#L151)

**צד-העמוד (best-effort, AD-6)**

- `registerPeriodicSync` — מנסה בכל טעינה + אחרי כל הענקת-הרשאה; כשל שקט לגמרי (עם `console.debug`, לא UI) הוא תוצאה **צפויה**, לא שגיאה
  [`notifications.js:209`](../../notifications.js#L209)

## Design Notes

**נבדק ונמצא בהיקף Story 2.5, לא פער כאן:** אין לוגיקת "פספסנו סנכרון" (אירוע שהתאריך-מחר שלו כבר עבר בלי שהתראה הוצגה) — זה בדיוק מה ש-Story 2.5 ("גיבוי — בדיקה בעת פתיחת אפליקציה") נועדה לפתור, לא כשל של הסטורי הזה.

**נדחה ל-`deferred-work.md`:** ריבוי-התראות בלי קיבוץ (כמה אירועים באותו יום = כמה התראות נפרדות); אייקון ה-`badge` משתמש בנכס מלא-צבע במקום נכס-מסכה ייעודי.

## Verification

**בוצע בפועל (Playwright):**
- Service Worker מותקן ומופעל בלי שגיאות עם ה-handlers החדשים
- `registerPeriodicSync()` לא זורק חריגה גם מול Chromium אמיתי (גם כש-`Notification.permission==="granted"`), נכשל בשקט כצפוי (Periodic Background Sync לא באמת ניתן להענקה בסביבת בדיקה headless)
- **הבאג הקריטי אומת ישירות:** פתיחת ה-DB בסדר "SW-קודם" (משחזר את התרחיש שהיה שובר), ואז וידוא ש-`writeSnapshot()` מהעמוד עדיין עובד נורמלית אחרי זה — עובד, האירוע נכתב בהצלחה
- לוגיקת ההתאמה (מציאת "מחר") נבדקה מול DB אמיתי עם 3 אירועים (היום/מחר/מחרתיים) — תואמת רק את אירוע-מחר
- בדיקת edge-cases לחישוב "מחר" (סוף חודש, סוף שנה, שנה מעוברת) — כולן תואמות ל-`daysUntil()` הקיים באפליקציה (=1 בדיוק)
- רגרסיה: סוויטות האימות של Stories 2.1-2.3 רצו מחדש ועברו ללא שינוי
