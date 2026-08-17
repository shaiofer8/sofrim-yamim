---
title: 'Story 1.4: ניגודיות נכונה על הגרדיאנט + מיקרו-אינטראקציה בהוספה'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** כותרת המסך משתמשת בטקסט לבן-מלא ישירות על הגרדיאנט המותגי, אבל DESIGN.md טעה: לבן-מלא **לא** עומד ב-4.5:1 מול `accent-pink` הטהור (~2.9:1 בפועל, נכשל אפילו בסף המקל של טקסט-גדול). בנוסף, הוספת אירוע חדש לא נותנת שום משוב חגיגי.

**Approach:** שכבת-הצללה שחורה עדינה (30% אלפא) ב-`.app-header` בלבד — לא שינוי לטוקני הגרדיאנט המשותפים — מביאה את הלבן ל-5.38:1+ בכל נקודה (נמדד). מיקרו-אינטראקציית קפיצה+קונפטי מתווספת רק בשמירת אירוע **חדש** (לא עריכה), מדולגת לגמרי תחת `prefers-reduced-motion`, עם הודעת `aria-live` כתחליף-משוב לא-חזותי בכל שמירה (חדש ועריכה כאחד).

</frozen-after-approval>

## Suggested Review Order

**ניגודיות הכותרת (התיקון המרכזי)**

- הצללה עדינה מעל הגרדיאנט, לא שינוי לטוקנים המשותפים עצמם — עם חישוב הניגודיות שהוביל לבחירת 30%
  [`style.css:84`](../../style.css#L84)

- `color: #fff` מפורש במקום ירושה מ-`text-primary` (ששבר בפועל במצב בהיר אחרי Story 1.9)
  [`style.css:106`](../../style.css#L106)

- תיקון תואם ב-DESIGN.md: הטענה המקורית ("לבן עומד ב-4.5:1 בכל נקודה") הייתה שגויה — מתועד עכשיו עם המספרים האמיתיים
  [`DESIGN.md:73`](../../_bmad-output/planning-artifacts/ux-designs/ux-sofrim-yamim-2026-08-17/DESIGN.md#L73)

**מיקרו-אינטראקציה (קפיצה + קונפטי, רק על שמירת אירוע חדש)**

- `celebrateNewEvent` — reduced-motion נבדק לפני הכל; `scrollIntoView` כדי שהחגיגה לא תיפתח מחוץ למסך; ניקוי כפול (`animationend` + `setTimeout` גיבוי) כדי שלא יישארו elements/classes תקועים אם ה-CSS fallback (`animation:none`) ימנע את אירוע ה-animationend
  [`app.js:167`](../../app.js#L167)

- `spawnConfetti` — צבע שלישי `var(--text-primary)` (לא `#fff` קשיח) כדי שיישאר נראה גם במצב בהיר (Story 1.9)
  [`app.js:189`](../../app.js#L189)

- CSS ה-keyframes + ה-fallback הזהה תחת reduced-motion
  [`style.css:437`](../../style.css#L437)

**משוב לא-חזותי (aria-live, מקביל לחגיגה)**

- `announce()` + אזור `aria-live="polite"` חדש — היחיד שמשתמשי reduced-motion/קורא-מסך מקבלים על שמירה מוצלחת
  [`app.js:12`](../../app.js#L12)

**תשתית**

- `CACHE_NAME` הוגדל (v7→v9) בעקבות שינויים לנכסים cached (AD-8)
  [`service-worker.js:1`](../../service-worker.js#L1)
