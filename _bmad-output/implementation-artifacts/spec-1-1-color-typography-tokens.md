---
title: 'Story 1.1: טוקני צבע וטיפוגרפיה חדשים'
type: 'feature'
created: '2026-08-17'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** האפליקציה משתמשת בצבעים מקודדים-קשיח ובפונט גנרי, בלי הזהות הוויזואלית החדשה (glassmorphism כהה) שהוגדרה ב-DESIGN.md.

**Approach:** להטמיע את טוקני הצבע/עיגול/מרווח של DESIGN.md כ-CSS custom properties, להחליף את כל השימושים הקיימים בטוקני הצבע הישנים, ולטעון את פונט Heebo עם fallback קיים.

## Suggested Review Order

**טוקני עיצוב**

- נקודת הכניסה — כל טוקני הצבע/עיגול/מרווח החדשים של DESIGN.md מוגדרים כאן, כולל תיקון ניגודיות ל-`--text-disabled` (4.9:1 במקום 3.4:1 המקורי מהאפיון)
  [`style.css:1`](../../style.css#L1)

- טעינת פונט Heebo עם fallback לשרשרת הקיימת
  [`style.css:38`](../../style.css#L38)

- תג הפונט ב-head — Google Fonts CDN, ראו הערת deferred-work לגבי caching אופליין
  [`index.html:14`](../../index.html#L14)

**רינדור כרטיסים ודיאלוגים**

- `.event-card` — הוחלף לטוקנים החדשים; backdrop-filter הוסר בכוונה (שמור ל-Hero Card ב-Story 1.2, נמנע מ-blur מוערם על שורות מרובות)
  [`style.css:101`](../../style.css#L101)

- `dialog` — משטח זכוכית עם blur מוגבר, טוקנים חדשים
  [`style.css:177`](../../style.css#L177)

**תשתית**

- `CACHE_NAME` הוגדל בעקבות שינוי לנכסים cached (AD-8)
  [`service-worker.js:1`](../../service-worker.js#L1)

</frozen-after-approval>

## Code Map

- `style.css` -- הגדרת טוקנים + עדכון כל הרכיבים הקיימים לשימוש בהם
- `index.html` -- הוספת תג פונט Heebo
- `service-worker.js` -- הגדלת גרסת cache

## Tasks & Acceptance

**Execution:**
- [x] `style.css` -- הגדרת CSS custom properties חדשים (צבע/עיגול/מרווח) + עדכון כל הסלקטורים הקיימים -- מימוש טוקני DESIGN.md
- [x] `index.html` -- הוספת קישור לפונט Heebo (Google Fonts) עם preconnect -- UX-DR2
- [x] `service-worker.js` -- הגדלת CACHE_NAME ל-v2 -- AD-8, נכסים cached השתנו

**Acceptance Criteria:**
- Given `style.css` הנוכחי, when מטמיעים את טוקני `DESIGN.md.colors`, then כל הכרטיסים/דיאלוגים הקיימים משתמשים בטוקנים החדשים במקום צבעים מקודדים-קשיח — מאומת (אין `var(--bg)`/`var(--card)`/`var(--accent)`/`var(--accent2)`/`var(--text)`/`var(--text-dim)`/`var(--radius)` נותרים בקובץ)
- Given פונט Heebo, when האפליקציה נטענת, then הפונט מוחל עם fallback לשרשרת הקיימת אם הטעינה נכשלת — מאומת (font-family כולל את שני החוליות)

## Design Notes

הוחלט לא ליישם self-hosting לפונט Heebo במסגרת הסטורי הזה — הניסיון לחלץ אוטומטית קבצי woff2 נפרדים לכל משקל נכשל (Google Fonts החזירה את אותה כתובת URL לכל המשקלים תחת ה-User-Agent הגנרי ששימש לבדיקה, סימן לכך שנדרש אימות ידני בדפדפן אמיתי לפני שילוב בטוח). הפער (אין caching אופליין לפונט) תועד ב-`deferred-work.md` והוערך כלא-חוסם: קריטריון הקבלה של FR-11 (עבודה אופליין) נוגע לנתוני אירועים, לא לפונט — נפילה חזרה לגופן המערכת היא הדרדרות מכובדת, לא כשל.

backdrop-filter הוסר מ-`.event-card` (אחרי המלצת reviewer) כדי למנוע blur מוערם על פני רשימה גוללת עם מספר כרטיסים בו-זמנית — הבידול הוויזואלי המלא (blur חזק להירו, ללא blur לשורות רגילות) יושלם ב-Story 1.2.

## Verification

**Manual checks (if no CLI):**
- לפתוח את `index.html` בדפדפן ולוודא חזותית: רקע כהה, גרדיאנט סגול-ורוד בכותרת, כרטיסים בגוון-זכוכית שקוף-חלקית, פונט Heebo נטען (ניתן לוודא ב-DevTools → Network → Font)
- לחפש `grep -n "var(--bg)\|var(--card)\|var(--accent2\?)\b\|var(--text)\b\|var(--text-dim)\|var(--radius)\b" style.css` ולוודא שאין תוצאות (אומת ידנית בזמן המימוש)
