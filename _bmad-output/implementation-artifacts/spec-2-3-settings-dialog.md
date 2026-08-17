---
title: 'Story 2.3: דיאלוג הגדרות עם מתג התראות'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 2.2 מבקשת הרשאה פעם אחת בלבד — אם המשתמש דחה בטעות, אין נתיב חזרה. וגם: אין שום מקום באפליקציה לראות מה מצב ההרשאה בפועל.

**Approach:** דיאלוג הגדרות חדש (אייקון ⚙️) עם Settings Row שמשקף (לא קובע) את `Notification.permission`. לחיצה על המתג מנסה `requestPermission()` תמיד — כשההרשאה `"default"` זו הזדמנות-שנייה אמיתית (פרומפט אמיתי); כשהיא כבר `"denied"`, הדפדפן פותר את זה מיידית בלי פרומפט (התנהגות דפדפן מכוונת נגד ספאם, לא באג) — המתג פשוט קופץ בחזרה עם טקסט-הסבר.

</frozen-after-approval>

## Suggested Review Order

**בעלות על הדיאלוג (תוקן תוך-כדי סקירה)**

- `app.js` הוא הבעלים היחיד של פתיחה/סגירה + פוקוס-בטוח בפתיחה (לא המתג עצמו — כדי שלא יופעל בטעות ע"י Enter רפלקסיבי) ומשדר event, לא קורא ל-`notifications.js` בשם
  [`app.js:553`](../../app.js#L553)

- `notifications.js` מאזין לאירוע, לא בעל הדיאלוג עצמו — רק לתוכן הספציפי-להתראות
  [`notifications.js:164`](../../notifications.js#L164)

**הליבה**

- `refreshSettingsDialog` — טקסט-הסבר לכל מצב חוץ מ-"default" (לא רק "denied" כמו בגרסה הראשונה — "granted" ו-"unsupported" קיבלו הסבר גם הם אחרי הסקירה)
  [`notifications.js:141`](../../notifications.js#L141)

- מאזין ה-`change` על המתג — `announce()` (מ-`app.js`, גלובל מותר-הפניה לפי AD-1) בהצלחה
  [`notifications.js:166`](../../notifications.js#L166)

## Design Notes

**למה זה חצה חזרה לתיקון ארכיטקטוני:** הגרסה הראשונה שלי שמה את כל בעלות-הדיאלוג (פתיחה/סגירה) ב-`notifications.js`, בטענה ש"כל התוכן שלו הוא נגישות-להתראות ממילא." סקירת blind-hunter הצביעה נכון: Story 3.2 (`billing.js`, עתידי) אמורה **להוסיף** כפתור-רכישה לאותו דיאלוג הגדרות עצמו — בעלות לא-אחידה על אותו דיאלוג הייתה יוצרת קונפליקט. עברתי לדפוס העקבי עם שאר הדיאלוגים: `app.js` בעלים, קבצים חדשים נרשמים כ-listeners.

**נבדק ונמצא לא-בעיה בפועל:** צפיפות בכותרת עם 3 כפתורי-אייקון + FAB בטלפון צר (320px) — נבדק חזותית וב-`scrollWidth`, אין overflow, אין חפיפה.

## Verification

**בוצע בפועל (Playwright, עם spy על `Notification.requestPermission`):**
- `permission="default"`: מתג כבוי, בלי רמז, לחיצה מפעילה בקשה אמיתית (1 קריאה) ומשקפת "granted" אחרי
- `permission="granted"`: מתג דלוק, לחיצה **לא** משנה כלום ולא קוראת ל-`requestPermission` שוב
- `permission="denied"`: מתג כבוי + רמז מוצג *לפני* לחיצה; לחיצה קוראת ל-API (no-op אמיתי) ונשאר כבוי + רמז
- פוקוס בפתיחת הדיאלוג נוחת על "סגירה", **לא** על המתג עצמו
- `aria-live` מכריז "התראות אושרו." בהענקה מוצלחת
- ניגודיות מסלול-המתג במצב בהיר — `rgba(128,128,128,0.4)`, נראה בבירור מול רקע הדיאלוג הבהיר (אומת חזותית)
- 0 שגיאות קונסולה בכל התרחישים
