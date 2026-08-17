---
title: 'Story 1.3: עדכון Compact Row לטוקנים החדשים'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `.event-card` (Compact Row) כבר עבר ל-`surface-glass` ב-Story 1.1 אבל עם `--radius-lg` (24px) — טעות-עיגול ביחס ל-DESIGN.md, ששומר `lg` ל-Hero/דיאלוג בלבד ומייעד `md` (16px) ל-Compact Row. השורות גם לא היו נגישות במקלדת/קורא-מסך, בניגוד לכלל הרוחבי של האפיק ("role+label בעברית לכל אלמנט אינטראקטיבי... 48dp").

**Approach:** לתקן את ה-radius ל-`--radius-md`, ולהוסיף לכל שורה `role="button"`/`tabindex`/`aria-label`/מקלדת (Enter/Space) — תואם את הדפוס שכבר מומש ואומת ב-Hero Card (Story 1.2), עם `aria-label` שנגזר מאותו טקסט שכבר מוצג על המסך (לא ניסוח נפרד) כדי שלא יסטה ממנו עם הזמן.

</frozen-after-approval>

## Suggested Review Order

**תיקון טוקן**

- ה-radius שהיה שגוי מאז Story 1.1 (`--radius-lg` → `--radius-md`), עם הפניה מפורשת ל-Story 1.3 בהערה
  [`style.css:213`](../../style.css#L213)

**נגישות בשורה הקומפקטית (תואם את דפוס Hero Card מ-Story 1.2)**

- טקסט ה-aria נגזר מ-`countLabel()` שכבר מרונדר על המסך — לא ניסוח מקביל נפרד שעלול לסטות
  [`app.js:57`](../../app.js#L57)

- השורה עברה מ-`<article>` ל-`<div>`, עקבי עם `heroEl` — `role="button"` לא דורס סמנטיקת אלמנט אחר
  [`app.js:122`](../../app.js#L122)

- `aria-label` כולל גם תאריך (בניגוד ל-Hero Card הקפוא-לפי-מפרט) — עם כמה שורות ברשימה, מספר-ימים בלבד לא מספיק להבחנה
  [`app.js:140`](../../app.js#L140)

- `focus-visible` מאוחד עם הכלל הזהה של ה-Hero Card במקום כפילות
  [`style.css:151`](../../style.css#L151)

**תשתית**

- `CACHE_NAME` הוגדל (v5→v7) בעקבות שינויים לנכסים cached (AD-8)
  [`service-worker.js:1`](../../service-worker.js#L1)
