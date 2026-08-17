---
title: 'Story 1.9: תמיכה במצב בהיר וכהה לפי מערכת ההפעלה'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** DESIGN.md הניח בטעות "כהה-בלבד ב-v1" — שי תיקן זאת במפורש: האפליקציה צריכה לעקוב אחרי `prefers-color-scheme` של המכשיר, לא לכפות כהה תמיד.

**Approach:** להוסיף פלטת טוקנים בהירה מקבילה תחת `@media (prefers-color-scheme: light)` שמחליפה את אותם CSS custom properties שכבר קיימים, כולל טוקן ייעודי חדש (`--count-grad-1/2`) עבור מספר-הספירה (gradient-clip text) שדורש ניגודיות שונה מהגרדיאנט המותגי המקורי.

## Boundaries & Constraints

**Always:** הגרדיאנט המותגי (`--accent-violet`/`--accent-pink`) נשאר זהה בשני המצבים — משמש רק כמילוי-רקע מאחורי טקסט לבן-כפוי (כותרת, FAB, כפתור ראשי), לא כטקסט בעצמו. כל שאר הטוקנים (`bg-base`, `bg-elev`, `surface-glass`, `surface-glass-border`, `text-primary/secondary/disabled`, `danger`) מקבלים ערך בהיר חלופי בניגודיות WCAG AA (4.5:1+) שחושבה ואומתה (ר' Verification). `color-scheme` עובר ל-`light dark` כדי שבקרות טופס טבעיות (input/select/dialog) יתאימו אוטומטית.

**Never:** אין לשנות את הגרדיאנט המותגי עצמו, את כלל "טקסט לבן-מלא על הגרדיאנט" (Story 1.4), או כל רכיב HTML/JS — זהו שינוי טוקנים בלבד.

## Code Map

- `style.css:1` -- טוקני `:root` הקיימים + טוקן חדש `--count-grad-1/2` (ברירת מחדל = הגרדיאנט המותגי) + `color-scheme: light dark`
- `style.css:42` -- בלוק `@media (prefers-color-scheme: light)` חדש עם פלטה בהירה מלאה
- `style.css:77` (`.event-count .num`) -- עודכן להשתמש ב-`--count-grad-1/2` במקום `--accent-violet/--accent-pink` ישירות
- `index.html:8` -- שני תגי `theme-color` מותנים (`media="(prefers-color-scheme: dark/light)"`) במקום תג יחיד קבוע
- `service-worker.js:1` -- `CACHE_NAME` הוגדל (v2→v3) בעקבות שינוי לנכסים cached (AD-8)

## Tasks & Acceptance

**Execution:**
- [x] `style.css` -- הוספת טוקן `--count-grad-1/2` + בלוק פלטה בהירה + עדכון `.event-count .num`
- [x] `index.html` -- פיצול `theme-color` לשני תגים מותני-`prefers-color-scheme`
- [x] `service-worker.js` -- הגדלת `CACHE_NAME` ל-v3 -- AD-8, נכסים cached השתנו

**Acceptance Criteria:**
- Given מכשיר עם `prefers-color-scheme: light`, when האפליקציה נטענת, then מוצגת הפלטה הבהירה (רקע/זכוכית/טקסט) בניגודיות AA
- Given מכשיר עם `prefers-color-scheme: dark` או ללא תמיכה, when האפליקציה נטענת, then הפלטה הכהה הקיימת מוצגת ללא שינוי
- Given מספר-הספירה (gradient-clip text), when נבדק בשני המצבים, then הניגודיות תקנית בשניהם (טוקנים נפרדים לכל מצב)

## Verification

**Commands:**
- `node -e "..."` (WCAG relative-luminance contrast calculator, חד-פעמי) -- כל טוקני הטקסט הבהירים נבדקו מול `bg-base`/`bg-elev`: text-primary 14.5:1/16.3:1, text-secondary 7.8:1/8.8:1, text-disabled 5.1:1/5.8:1, danger 5.2:1/5.9:1, count-grad-1 (#6a3ff0) 5.2:1/5.9:1, count-grad-2 (#c91f66) 4.8:1/5.4:1 — כולם מעל 4.5:1

**Manual checks (if no CLI):**
- Chrome DevTools → Rendering → "Emulate CSS media feature prefers-color-scheme" → להחליף בין light/dark ולוודא חזותית שהפלטה מתחלפת בלי לשבור פריסה
- `surface-glass` הוא שקוף-חלקית בשני המצבים — ניגודיות טקסט-על-זכוכית בפועל תלויה ברקע המצטבר; מומלץ בדיקה ידנית נוספת (כמו בשאר האפיק) בזמן Story 1.5 (נגישות)
