---
title: 'Story 1.2: רכיב Hero Card לאירוע הקרוב ביותר'
type: 'feature'
created: '2026-08-17'
status: 'done'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** כל האירועים מוצגים כיום באותו עיצוב שורה קומפקטית — המשתמש צריך לגלול/לסרוק כדי לזהות מה האירוע הקרוב ביותר, בניגוד ל-UJ-1.

**Approach:** להוסיף רכיב Hero Card חדש שמציג תמיד ורק את האירוע העתידי עם ה-`daysUntil` הקטן ביותר, מעל שאר הרשימה, בעיצוב זכוכית מוגבר עם הילת-גרדיאנט עדינה ומספר-ספירה גדול.

## Boundaries & Constraints

**Always:**
- Hero Card מוצג **רק** כשקיים לפחות אירוע עתידי אחד (`daysUntil >= 0`); אם אין כזה (ריק/רק-עבר) — הרכיב מוסתר (`hidden`), אין שינוי להתנהגות הרשימה הרגילה.
- האירוע שנבחר ל-Hero הוא תמיד הראשון במערך הממוין הקיים (`render()`), כאשר `daysUntil(events[0].date) >= 0`; שאר הרשימה (`eventList`) מציגה את כל היתר, כולל אירועי עבר, ללא שינוי לוגיקת המיון הקיימת.
- לחיצה על Hero Card פותחת את דיאלוג העריכה הקיים (`openEditDialog`) — אין דיאלוג/רכיב חדש.
- Hero Card נגיש: `role="button"`, `tabindex="0"`, `aria-label="אירוע קרוב ביותר: {שם}, {X} ימים"` (או "אירוע קרוב ביותר: {שם}, היום" כשה-diff הוא 0), מקלדת (Enter/Space) פותחת את הדיאלוג בדיוק כמו קליק. גובה מינימלי 48px (יעד-נגיעה 48dp). כל גודל טקסט ב-`rem`, כולל מספר הספירה.
- מספר-הספירה משתמש ב-`countLabel()` הקיימת (ללא שינוי) — "היום 🎉" ולא "0 ימים", ספרות טבלאיות (`font-variant-numeric: tabular-nums`, כבר מוגדר בטוקן הקיים).
- עיצוב: `border-radius: var(--radius-lg)`, `surface-glass` עם `backdrop-filter: blur` (חזק יותר מה-`dialog` הקיים), הילת-גרדיאנט עדינה (glow עדין, לא צל כבד), רוחב מלא.

**Ask First:** אין החלטות דורשות אישור אנושי בהיקף הזה.

**Never:** אין לשנות את `loadEvents`/`saveEvents`/`daysUntil`/`countLabel`/מיון האירועים. אין להוסיף פלטת קטגוריות צבעונית. אין ליצור קובץ JS חדש — כל הלוגיקה בתוך `app.js` הקיים. אין מיקרו-אינטראקציית קפיצה/קונפטי (Story 1.4).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| אירוע עתידי יחיד | אירוע אחד, `date` בעתיד | Hero Card מוצג עם שם/אמוג'י/ספירה שלו; `eventList` ריק | N/A |
| כמה אירועים עתידיים | 2+ אירועים עתידיים | Hero = בעל `daysUntil` הקטן ביותר בלבד; שאר האירועים (כולל עבר) ב-`eventList` | N/A |
| היום | אירוע עתידי הקרוב ביותר עם `daysUntil === 0` | Hero מציג "היום 🎉", לא "0 ימים" | N/A |
| רק אירועי עבר | כל האירועים `daysUntil < 0` | Hero Card מוסתר (`hidden`); כל האירועים מוצגים ב-`eventList` כרגיל (כולל שקיפות עבר) | N/A |
| רשימה ריקה | אין אירועים כלל | Hero Card מוסתר; מסך-ריק קיים מוצג ללא שינוי | N/A |
| תיקו בין אירועים עתידיים | 2 אירועים עם `daysUntil` שווה וקטן ביותר | Hero = הראשון במערך הממוין הקיים (דטרמיניסטי, לא קורס) | N/A |

</frozen-after-approval>

## Code Map

- `app.js:51` (`render()`) -- לפצל את מערך `events` הממוין לאירוע Hero (הראשון, אם `daysUntil >= 0`) ולשאר; לרנדר את ה-Hero לתוך `heroEl` חדש ולהמשיך לרנדר את השאר ל-`listEl` הקיים כפי שהוא היום
- `app.js:101` (`openEditDialog`) -- לשימוש חוזר ללא שינוי, גם מקליק על Hero וגם מקליק/מקלדת על שורה קומפקטית
- `app.js:43` (`countLabel`) -- לשימוש חוזר ללא שינוי עבור מספר הספירה ב-Hero
- `index.html:29` -- להוסיף `<div id="heroCard" class="hero-card" hidden></div>` מעל `<main id="eventList">`
- `style.css:101` -- הערת ה-backdrop-filter הקיימת ב-`.event-card` מפנה במפורש ל-Story 1.2 עבור ה-Hero; להוסיף כלל `.hero-card` חדש (glass מוגבר + halo), לא לגעת ב-`.event-card`
- `service-worker.js:1` -- `CACHE_NAME` הוגדל בשני צעדים, v3→v4 ואז v4→v5 (תיקון ה-hidden שנתפס באימות) בעקבות שינויים לנכסים cached (AD-8)

## Tasks & Acceptance

**Execution:**
- [x] `index.html` -- הוספת `<div id="heroCard" class="hero-card" hidden>` מעל ה-`<main>` -- מיכל ה-Hero Card
- [x] `app.js` -- לוגיקת חילוץ אירוע Hero מתוך המערך הממוין הקיים, רינדור תוכן + attributes נגישות (`role`, `tabindex`, `aria-label`), מאזיני קליק ו-Enter/Space שקוראים ל-`openEditDialog` -- UX-DR3, Story 1.2 AC
- [x] `style.css` -- כלל `.hero-card` (glass מוגבר, `backdrop-filter`, `radius-lg`, הילת-גרדיאנט עדינה, רוחב מלא, מספר-ספירה `clamp` בין 56-72px ב-rem, `min-height` 48px) -- UX-DR3, DESIGN.md
- [x] `service-worker.js` -- הגדלת `CACHE_NAME` ל-v5 -- AD-8, נכסים cached השתנו

**Acceptance Criteria:**
- Given לפחות אירוע עתידי אחד ברשימה, when המסך הראשי נטען, then האירוע עם `daysUntil` הקטן ביותר מוצג ב-Hero Card נפרד ובולט מעל שאר הרשימה, עם מספר-ספירה בגודל 56-72px (ב-rem)
- Given אין אף אירוע עתידי (רק עבר/ריק), when המסך נטען, then אין Hero Card מוצג, ושאר הרשימה מוצגת כרגיל
- Given Hero Card מוצג, when בודקים עם קורא-מסך, then יש לו `aria-label` מוכרז בפורמט "אירוע קרוב ביותר: {שם}, {X} ימים" (או "...היום" כש-diff הוא 0)
- Given Hero Card מוצג, when לוחצים עליו (עכבר/מגע) או מפעילים Enter/Space כשהוא ב-focus, then נפתח דיאלוג העריכה עם פרטי אותו אירוע

## Design Notes

הילת-גרדיאנט: `box-shadow` עדין בגוון `accent-violet`/`accent-pink` בשקיפות נמוכה (למשל `0 0 40px rgba(124,92,255,0.25)`) — לא צל כהה/כבד, זה "glow" לא "shadow". ה-`backdrop-filter` על ה-Hero חזק יותר מזה של ה-`dialog` (16px) כדי להדגיש את ההיררכיה הוויזואלית.

**באג שנתפס באימות חזותי (Playwright, לא ידני):** `.hero-card { display: flex }` ו-`[hidden]` הם באותה רמת specificity ב-CSS; מכיוון שהכלל של המחלקה מופיע בגיליון-הסגנון של המחבר, הוא ניצח את ברירת המחדל של הדפדפן `[hidden]{display:none}` — כלומר `heroEl.hidden = true` לא הסתיר בפועל את הכרטיס (נשאר תיבת-זכוכית ריקה). תוקן עם כלל מפורש `.hero-card[hidden] { display: none; }`.

## Verification

**בוצע בפועל (Playwright headless, לא רק הצעה ידנית):** שרת סטטי מקומי + סקריפט Playwright שהזריק אירועים ל-`localStorage` וצילם מסך בכל אחד מ-5 המצבים (אירוע עתידי יחיד+נוספים, "היום", רק-עבר, ריק, מצב בהיר). תוצאות:
- כל 5 המצבים נראים נכון חזותית (Hero Card מופיע/נעלם כצפוי, גרדיאנט/glass/halo תקינים בשני מצבי הבהירות)
- `aria-label` בפועל: `"אירוע קרוב ביותר: ראש השנה, 3 ימים"` — תואם את הספק
- Enter על Hero Card ב-focus פתח את דיאלוג העריכה בהצלחה
- 0 שגיאות קונסולה בכל המצבים
- **נתפס ותוקן באימות עצמו:** הבאג שתועד ב-Design Notes (`[hidden]` לא עבד בפועל) — לא היה נתפס בסקירת קוד סטטית בלבד

**Manual checks (if no CLI):**
- DevTools → Accessibility tree: לוודא ש-Hero Card חשוף כ-button עם השם הנגיש הנכון (אומת פרוגרמטית לעיל, כדאי גם עיון חזותי בעץ עצמו)
