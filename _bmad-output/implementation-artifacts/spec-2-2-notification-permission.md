---
title: 'Story 2.2: בקשת הרשאת התראות אחרי האירוע הראשון'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** FR-6 דורש בקשת הרשאת Notification בעיתוי לא-פולשני — רק אחרי שמירת האירוע הראשון-אי-פעם, לא ב-onboarding — פעם אחת בלבד, בלי לחסום שום פעולה אם נדחית.

**Approach:** דגל `localStorage` ("כבר ניסינו לבקש") + בדיקת `Notification.permission === "default"` לפני הבקשה. `app.js` **לא** קורא ישירות לפונקציה ב-`notifications.js` (בניגוד לתבנית שהתחלתי איתה ב-Story 2.1) — במקום זאת משדר `CustomEvent` שכל מאזין (או אף אחד) יכול להגיב אליו, תואם את כלל הספיין הארכיטקטוני "app.js לא תלוי בקבצים חדשים ישירות; הם נרשמים כ-event listeners."

</frozen-after-approval>

## Suggested Review Order

**תיקון ארכיטקטוני (חל גם רטרואקטיבית על הדפוס מ-Story 2.1)**

- `dispatchEventAdded` — `app.js` משדר, לא קורא בשם-פונקציה; לעולם לא יודע/אכפת לו מי מאזין
  [`app.js:33`](../../app.js#L33)

- שתי נקודות-הקריאה (הוספה ידנית + חג-מהיר) — רק בנתיב אירוע-חדש, לעולם לא בעריכה
  [`app.js:423`](../../app.js#L423), [`app.js:527`](../../app.js#L527)

**הליבה**

- `maybeRequestNotificationPermission` — הדגל נכתב **לפני** הבקשה (כך שגם זריקה סינכרונית עדיין נחשבת "ניסינו"), עטוף try/catch כפול (גם ה-Promise rejection וגם זריקה סינכרונית אפשרית)
  [`notifications.js:104`](../../notifications.js#L104)

- רישום המאזין — הקישור היחיד בין השידור לקוד בפועל
  [`notifications.js:131`](../../notifications.js#L131)

## Design Notes

**למה השינוי הארכיטקטוני חל רק על הקצה הזה, לא על Story 2.1:** ARCHITECTURE-SPINE.md אומר שני דברים שנראים כסותרים — "app.js לא תלוי בקבצים חדשים ישירות... נרשמים כ-event listeners" **אבל גם** "app.js... בעל הבעלות היחיד על הכתיבה לשני מאגרי האחסון (localStorage דרך saveEvents(), ומראה ל-IndexedDB **כתוצר-לוואי של אותה קריאה**)". הפירוש שהתקבל: מראה-האחסון (Story 2.1) היא באופן מפורש "תוצר-לוואי" של `saveEvents()` עצמה — נשארת קריאה ישירה-אך-מוגנת בתוך `saveEvents()`. בקשת-ההרשאה (Story 2.2) היא תגובה-לפעולת-משתמש ברמת-פיצ'ר, לא כתיבת-אחסון — מתאימה לדפוס ה-event-listener הכללי.

**נבדק ונמצא לא-רלוונטי לקוד:** בקשת `Notification.requestPermission()` בתוך TWA תלויה בהצהרת `POST_NOTIFICATIONS` באפליקציית האנדרואיד העוטפת (Android 13+) — קוד ה-web לא יכול לזהות/לעקוף חוסר כזה. נדחה ל-`deferred-work.md`, מתויג ל-Story 4.1 (הקמת TWA).

## Verification

**בוצע בפועל (Playwright, עם spy על `Notification.requestPermission`):**
- אירוע-חדש ראשון-אי-פעם → הבקשה מופעלת **פעם אחת** בדיוק, הדגל נשמר
- אירוע-חדש שני → **לא** מופעלת שוב
- עריכת אירוע קיים → **לא** מופעלת בכלל
- `requestPermission()` נדחית (Promise reject) → הדגל עדיין נשמר (לא ניסיון-חוזר), הדיאלוג נסגר כרגיל, 0 שגיאות קונסולה
- `Notification.permission` כבר `"denied"` מראש (לא `"default"`) → הבקשה לא מופעלת בכלל
- רגרסיה: מלוא סוויטת האימות של Story 2.1 (סנכרון IndexedDB) רצה מחדש אחרי הריפקטור הארכיטקטוני ועברה ללא שינוי
