---
title: 'Story 1.6: השלמת FR-5 — דילוג שקט על חג ללא תאריך מוגדר'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `holidays.js` דורש עדכון ידני שנתי (ר' ה-TODO בקובץ). חג ללא `date`, עם תאריך שגוי, או עם תאריך שכבר חלף בלי עדכון — כרגע היה מרונדר כ"Invalid Date" שבורה בתוך דיאלוג "חגים ומועדים", או גרוע יותר.

**Approach:** פונקציית ולידציה (`isValidHolidayDate`) שבודקת נוכחות + תקינות מבנית + שהתאריך לא כבר עבר, ומדלגת בשקט על כל רשומה שנכשלת — בלי שורה שבורה, בלי הודעת שגיאה. עם fallback ל-state ריק אם כל הרשימה הפכה מיושנת.

</frozen-after-approval>

## Suggested Review Order

**הליבה: ולידציה + סינון**

- `isValidHolidayDate` — נוכחות + regex מבני + **round-trip** של הרכיבים המנותחים מול המחרוזת המקורית (לא רק `isNaN`, כי `new Date` מגלגל תאריכים לא-תקינים כמו `02-30` בשקט ל-1 במרץ במקום לדחות אותם) + לא-כבר-עבר
  [`app.js:316`](../../app.js#L316)

- `getValidHolidayPresets` — נקודת-גישה יחידה, כדי שכל תכונה עתידית שקוראת מ-`HOLIDAY_PRESETS` תקבל את הסינון בחינם במקום לסכן את אותו כשל-"Invalid Date" מחדש; `console.warn` כשמשהו נופל, כאות-אזהרה למפתח שהקובץ דורש עדכון
  [`app.js:333`](../../app.js#L333)

- נקודת השימוש בדיאלוג — state ריק (`presetsEmpty`) אם כל הרשימה הפכה בלתי-תקפה
  [`app.js:343`](../../app.js#L343)

**תיעוד**

- ה-TODO הקיים ב-`holidays.js` עודכן עם החוזה החדש (מותר להיות מיושן, לא קורס)
  [`holidays.js:1`](../../holidays.js#L1)

## Design Notes

**באג שנתפס ותוקן לפני commit:** גרסה ראשונה של `isValidHolidayDate` פירקה `match.slice(1).map(Number)` עם תבנית `[, y, m, d]` — סקיפ כפול בטעות (גם `slice(1)` וגם הפסיק המוביל), מה שגרם ל-`d` תמיד `undefined` ול-*כל* תאריך, כולל תקפים, להיכשל בבדיקת ה-round-trip. נתפס כי אימות Playwright (לא רק סקירת קוד) ציפה לראות את "ראש השנה" ברשימה המסוננת ולא ראה כלום. תוקן ל-`match.map(Number)` (התאמה מלאה כולל ה-full-match באינדקס 0, שממילא מדולג ע"י הפסיק המוביל).

**נדחה, לא תוקן (סקירת blind-hunter):** אין מיון כרונולוגי מפורש של הרשימה המסוננת — תלוי בכך ש-`holidays.js` נשמר בסדר-תאריכים ידני. זו התנהגות קיימת מלפני הסטורי הזה (לא הוחמרה על ידו), ומחוץ להיקף FR-5 (שעוסק בדילוג-שקט, לא במיון).

## Verification

**בוצע בפועל (Playwright, `page.route` להזרקת fixtures ל-`holidays.js`):**
- Fixture עם חג-בלי-תאריך + תאריך-לא-תקין + תאריך-משנה-שעברה + 2 תקפים → רק ה-2 התקפים מוצגים, 0 שגיאות קונסולה
- Fixture עם `2027-02-30` (rollover) → נדחה נכון (לא הופך בשקט ל-2 במרץ), עם `console.warn` אחד
- Fixture שכולו לא-תקף → `presetsList` ריק, הודעת `presetsEmpty` מוצגת, הדיאלוג עדיין נפתח תקין
- `holidays.js` האמיתי (14 החגים) ללא שינוי → כל ה-14 עדיין מוצגים, 0 רגרסיה
