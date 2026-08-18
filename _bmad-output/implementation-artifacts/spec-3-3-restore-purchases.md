---
title: 'Story 3.3: שחזור רכישה אוטומטי'
type: 'feature'
created: '2026-08-18'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `sofrim-yamim.purchase.v1` הוא cache מקומי בלבד — מכשיר/התקנה חדשה מתחילים עם cache ריק, גם אם למשתמש יש רכישה תקפה בחשבון ה-Google שלו. גם: Story 3.2 דחתה במפורש את בעיית "כבר-נרכש" (retry שלעולם לא יצליח) לסטורי הזה.

**Approach:** `restorePurchases()` קורא ל-`service.listPurchases()` בכל עלייה-קרה **וגם** בכל חזרה-לחזית — לא נסמך על ה-cache המקומי בלבד. **מגבלה זהה ל-3.1/3.2:** ה-API לא קיים מחוץ ל-TWA מותקן אמיתי, לא מאומת קצה-לקצה.

</frozen-after-approval>

## Suggested Review Order

**סטייה-מהארכיטקטורה שנתפסה ותוקנה לפני commit (הממצא המשמעותי ביותר)**

- **הגרסה הראשונה שלי הפעילה `restorePurchases()` *אחרי* ש-`refreshAdBanner()` כבר רץ** (הצדקתי את זה כ"trade-off סביר" בקומנט) — אבל `epic-3-context.md` ו-AC של Story 3.3 ב-`epics.md` דורשים **במפורש** שהשחזור ירוץ *לפני* שהחלטת-הבאנר מתקבעת, בדיוק כדי למנוע את ההבהוב שקרה בפועל (אומת: 2 שגיאות-קונסולה מבקשת-פרסומת-מיותרת נעלמו אחרי התיקון). סקירת blind-hunter תפסה את הסטייה מהמסמכים המאושרים. תוקן: `await restorePurchases()` **לפני** הקריאה הראשונה ל-`refreshAdBanner()` — זול כמעט לגמרי לרוב המשתמשים (`digitalGoodsServiceAvailable()` נבדק סינכרונית), רק משתמשי-TWA-אמיתיים (בדיוק מי שזה בשבילם) ממתינים בפועל
  [`billing.js:280`](../../billing.js#L280)

**הוספות מהסקירה**

- בדיקה חוזרת ב-`visibilitychange`→visible (רכישה יכולה להסתיים ברקע), עם guard נגד ריצה-כפולה (`restoreCheckInFlight`) ותיאום עם רכישה-פעילה (`purchaseInProgress`) כדי שלא "יגנוב" את מצב-ה-UI מתחת לרכישה שבתהליך
  [`billing.js:248`](../../billing.js#L248)

- שער-פיצ'ר נכון יותר — `digitalGoodsServiceAvailable()` (בלי דרישת `PaymentRequest`) לבדיקת שחזור בלבד, נפרד מ-`digitalGoodsAvailable()` (עם `PaymentRequest`) לזרימת-רכישה בפועל

## Design Notes

**נדחה, לא שכחה:** שחזור הוא חד-כיווני — רכישה שהוחזרה/בוטלה לא "מוסרת" את ההסרה. זו החלטת-UX אמיתית (איך/מתי להודיע למשתמש שפיצ'ר-בתשלום נלקח ממנו) שה-AC לא דרש, ורכישה חד-פעמית ב-$1.99 נדירה מספיק שסביר לדחות.

## Verification

**בוצע בפועל (Playwright, עם mock ל-`listPurchases()`):**
- מכשיר חדש עם רכישה תקפה → שוחזר עם **אפס אינטראקציה**, הבאנר מוסתר, **0 שגיאות קונסולה** (מאשר ישירות שהתיקון-הקריטי מונע את בקשת-הפרסומת המיותרת שקרתה לפני התיקון)
- אין רכישה ב-Play → כלום לא משתנה, הבאנר נשאר גלוי
- אין Digital Goods API בכלל → אין קריסה
- דיאלוג הגדרות פתוח בזמן שהשחזור מסתיים → גם כפתור-הרכישה מתעדכן
- **רכישה שהושלמה ברקע, מתגלה רק ב-`visibilitychange`** → נבדק ישירות, מאומת
- **תיאום עם רכישה-פעילה:** `visibilitychange` באמצע רכישה-בתהליך (spinner) → מצב ה-UI **לא** נפגע
- רגרסיה: Stories 3.1/3.2 (כולל כל תרחישי הכשל/ביטול/`complete()`-נכשל) רצו מחדש ועברו ללא שינוי
