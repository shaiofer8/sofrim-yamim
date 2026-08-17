---
title: 'Story 2.1: תמונת-קריאה ל-IndexedDB עבור Service Worker'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** ה-Service Worker (שיטפל בתזכורות מתוזמנות ב-Story 2.4) אין לו גישה ל-`localStorage` בכלל (AD-2) — אין לו שום דרך לדעת אילו אירועים קיימים.

**Approach:** קובץ חדש `notifications.js` (סדר-טעינה אחרי `app.js`, AD-1) עם `syncIndexedDBSnapshot()` שנקראת מ-`saveEvents()` בכל שמירה, כותבת תמונה מינימלית (`id`/`name`/`date` בלבד) ל-IndexedDB. חד-כיוונית בלבד — קוד העמוד לעולם לא קורא בחזרה.

</frozen-after-approval>

## Suggested Review Order

- החוזה + הסיבה — עמודת-ה-comment חשובה כאן כי `service-worker.js` (Story 2.4, עתידי) יצטרך לשכפל את אותם קבועים בדיוק, ואין מנגנון shared-module בפרויקט ללא build-step
  [`notifications.js:15`](../../notifications.js#L15)

- תור-סדרתיות (`snapshotQueue`) — מונע race בין שתי קריאות מהירות ל-`saveEvents()`
  [`notifications.js:74`](../../notifications.js#L74)

- backfill בטעינה — משתמש קיים שלא נגע ברשימת האירועים שלו אחרי השדרוג עדיין מקבל תמונה מסונכרנת
  [`notifications.js:93`](../../notifications.js#L93)

- החיווט ב-`saveEvents()` — guard על קיום הפונקציה, לא תלות-קשיחה
  [`app.js:55`](../../app.js#L55)

## Design Notes

**נבדק ונשאר כמו שהוא (לא פערים):**
- **אין אינדקס משני על `date`** — הוחלט במכוון להשאיר להחלטת Story 2.4 (שתדע בפועל את דפוס-השאילתה שהיא צריכה); ניתן להוסיף אינדקס מאוחר יותר דרך העלאת `EVENTS_DB_VERSION` ו-`onupgradeneeded`, ללא breaking change.
- **אירועי-עבר נכתבים לתמונה בלי סינון** — תואם במדויק את הדרישה "תמונה... תואמת בדיוק את מצב localStorage הנוכחי"; סינון-לפי-רלוונטיות (איזה אירועים שווים תזכורת) הוא החלטה של הצרכן (Story 2.4), לא של שכבת-הכתיבה.

## Verification

**בוצע בפועל (Playwright, קריאה ישירה מ-IndexedDB דרך `getAll()`):**
- הוספה/עריכה/מחיקה (כולל דרך חג מהרשימה המהירה) — התמונה תואמת בדיוק את `localStorage` בכל שלב, עם `id`/`name`/`date` בלבד
- **Backfill:** נתונים שהוזרקו ישירות ל-`localStorage` (מדמה משתמש-קיים, בלי קריאה ל-`saveEvents()` כלל) מופיעים בתמונה מיד אחרי טעינת הדף
- **תחרות-כתיבה:** שתי קריאות `saveEvents()` רצופות ומהירות → התמונה הסופית תואמת את הקריאה השנייה (האחרונה), לא נשארת במצב-ביניים
- 0 שגיאות קונסולה בכל התרחישים
