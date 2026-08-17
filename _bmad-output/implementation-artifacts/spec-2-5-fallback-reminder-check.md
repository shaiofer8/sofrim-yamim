---
title: 'Story 2.5: גיבוי — בדיקה בעת פתיחת אפליקציה'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Periodic Background Sync (Story 2.4) הוא best-effort לחלוטין — עלול פשוט לא לרוץ (AD-6). בלי גיבוי, אירוע יכול להיות מפוספס לגמרי.

**Approach:** בדיקה שרצה בכל פתיחה/חזרה-מרקע (`visibilitychange`→visible), ישירות מול `localStorage` (לא IndexedDB — זה קוד-עמוד, יש לו גישה מלאה). אירוע היום-או-מחר שטרם קיבל התראה **היום** מקבל אחת מיידית. תלות **רק** בהרשאת Notification הרגילה — לא ב-Periodic Background Sync בכלל.

</frozen-after-approval>

## Suggested Review Order

**באג שנתפס ותוקן פעמיים לפני commit**

1. **פרונינג רץ רק כשהיה משהו-חדש-להתריע** — נתפס בבדיקה עצמית (לפני אפילו הגעה לסקירה): מחיקת אירוע שכבר קיבל התראה השאירה אותו תקוע ב-map לצמיתות, כי השמירה-עם-פרונינג הייתה מקוננת בתוך ה-branch של "יש מה להתריע עליו". תוקן ל-שמירה ללא-תנאי בסוף כל בדיקה.
2. **תלות סמויה ב-Service Worker פעיל** — סקירת blind-hunter תפסה שהתיעוד הבטיח "תלות רק בהרשאת Notification" אבל הקוד גם דרש `serviceWorker.ready` לפתור, בלי timeout (יכול לתקוע את כל הבדיקה לנצח אם ה-SW אף פעם לא מופעל). תוקן עם מנגנון דו-שכבתי
   [`notifications.js:279`](../../notifications.js#L279)

**הליבה (אחרי התיקונים)**

- `showFallbackNotification` — מנסה SW עם race מול timeout של 3 שניות; נופל בחזרה ל-`new Notification()` הגולמי אם ה-SW לא זמין/תקוע — כך התלות היא **רק** בהרשאה, כמו שהוצהר
  [`notifications.js:279`](../../notifications.js#L279)

- `checkFallbackReminders` — guard נגד ריצה-כפולה-בו-זמנית (`fallbackCheckInFlight`), כל הגוף בבלוק try/catch יחיד
  [`notifications.js:321`](../../notifications.js#L321)

- `pruneNotifiedMap`
  [`notifications.js:266`](../../notifications.js#L266)

## Design Notes

**עקביות בין-מנגנונית:** ה-`tag` של ההתראה זהה בכוונה לזה של Story 2.4 (`sofrim-yamim-reminder-{id}`, לא `sofrim-yamim-fallback-{id}` כמו בטיוטה הראשונה) — אם שני המנגנונים (periodicsync + הבדיקה-בפתיחה) יורים על אותו אירוע, הדפדפן מקפל אותם להתראה אחת במקום שתיים נפרדות.

**נדחה, מכוסה כבר:** ריבוי-התראות-בלי-קיבוץ כשכמה אירועים חלים באותו יום — אותו פריט שכבר נדחה ב-Story 1.4 (`deferred-work.md`), לא כפול חדש.

**נדחה ל-`deferred-work.md`:** אפליקציה שנשארת פתוחה-בחזית ברצף מעבר לחצות (בלי מעבר-לרקע, בלי רענון) לא תבדוק שוב — תואם את ה-AC המילולי ("האפליקציה נפתחת"), לא כשל.

## Verification

**בוצע בפועל (Playwright):**
- פתיחה קרה עם אירועים היום/מחר/רחוק/עבר → רק היום+מחר מקבלים התראה, בדיוק
- פתיחה שנייה **באותו יום** → 0 התראות (דה-דופ עובד)
- הרשאה לא ניתנה → 0 קריאות בכלל
- מחיקת אירוע שכבר קיבל התראה → הרשומה שלו נעלמת מה-map (הפרונינג עובד אחרי התיקון)
- **מסלול-הגיבוי הגולמי אומת ישירות:** `serviceWorker.ready` שנתקע-לנצח (Promise שלעולם לא resolves) → אחרי 3 שניות נופל בחזרה ל-`new Notification()` הגולמי בהצלחה, לא נתקע
- רגרסיה: סוויטות האימות של Stories 2.1-2.4 רצו מחדש ועברו ללא שינוי
