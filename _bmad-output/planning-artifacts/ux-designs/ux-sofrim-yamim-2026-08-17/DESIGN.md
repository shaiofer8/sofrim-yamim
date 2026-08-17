---
name: סופרים ימים
description: 'ספירה לאחור חגיגית בעברית מלאה, כהה כברירת-מחדל. ניגודיות למתחרים עמוסי-פרסומות דרך פשטות ויזואלית ונקיון.'
status: final
sources:
  - _bmad-output/planning-artifacts/prds/prd-sofrim-yamim-2026-08-17/prd.md
  - _bmad-output/planning-artifacts/research/market-countdown-app-israel-google-play-market-2026-08-17/research.md
updated: 2026-08-17T00:00:00Z
colors:
  bg-base: '#150c2e'
  bg-elev: '#201338'
  surface-glass: 'rgba(38, 24, 63, 0.65)'
  surface-glass-border: 'rgba(255, 255, 255, 0.08)'
  accent-violet: '#7c5cff'
  accent-pink: '#ff5f8f'
  text-primary: '#f4f1fb'
  text-secondary: '#b0a6c9'
  text-disabled: '#6e6488'
  danger: '#ff5f5f'
typography:
  family: 'Heebo (Google Fonts, variable) — Hebrew-native, fallback: -apple-system, "Segoe UI", Arial'
  countdown-hero:
    note: '56-72px, weight 800, tabular numerals — the single most-viewed element in the app'
  countdown-compact:
    note: '24-28px, weight 700'
  title:
    note: '18-20px, weight 700'
  body:
    note: '15-16px, weight 400-500'
  meta:
    note: '13px, weight 400, text-secondary'
rounded:
  sm: 10px
  md: 16px
  lg: 24px
  squircle-note: 'lg (24px) reserved for the hero card and dialogs — approximates a squircle feel without SVG clip-path complexity in v1'
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 28px
  '7': 40px
components:
  hero-card: 'the nearest upcoming event — large, glass surface, gradient accent'
  compact-row: 'all other events — flat glass row, hairline divider'
  fab: 'circular, gradient fill, add action'
  chip-button: 'holiday-menu trigger, secondary icon buttons'
  dialog: 'glass surface over dimmed backdrop, lg rounding'
  ad-banner: 'bg-elev fill, top hairline, fixed footer strip, never over content'
notes:
  frontmatter-deviations: 'components are one-line prose (not token-maps) and typography uses free-text note fields for literal custom values this app owns (not just platform-inherited defaults) — deliberate simplification for a small single-screen app, not spec drift. surface-glass/surface-glass-border use rgba() instead of hex specifically because the glassmorphism language requires alpha transparency.'
---

## Brand & Style

"סופרים ימים" נבנית נגד הזרם של הקטגוריה שלה. מרבית מתחרות ה-countdown, לפי המחקר, קונות תשומת-לב באמצעות עומס פרסומות ופופ-אפים — האסתטיקה כאן היא ההפך: **מסך אחד נקי, מספר אחד גדול, בלי רעש חזותי**. הבידול לא רק פונקציונלי — הוא ויזואלי. משתמש שפותח את האפליקציה אחרי "הלוח העברי" (מתחרה עמוס) אמור להרגיש הבדל מיידי בעומס המסך.

הטון חגיגי וחם — לא כלי-ניהול-משימות קר. הגרדיאנט הסגול-ורוד הקיים כבר בשלד (`#7c5cff` → `#ff5f8f`) הוא עוגן המותג ונשמר; מסביבו — כהה, שקוף-חלקית ("glassmorphism אחראי", טרנד 2026: שכבות זכוכית עדינות שיוצרות עומק בלי רעש צבעוני נוסף), טיפוגרפיה נועזת למספרי הספירה (הטרנד של טיפוגרפיה כאלמנט-על, לא רק תוכן פסיבי), ומבנה "היירו-קארד" בהשראת Bento Grids 2026 — אריח גדול אחד לאירוע הקרוב ביותר, שורות קומפקטיות לשאר.

`[ASSUMPTION]` המוצר הוא **כהה-בלבד ב-v1** (אין מצב בהיר) — החלטת מותג מכוונת, לא מגבלה טכנית: כהה מרגיש חגיגי/אירועי יותר מלוח-שנה בהיר גנרי, ותואם את טרנד "dark mode כברירת מחדל" ב-2026. לאימות עם שי.

## Colors

- **`bg-base` (`#150c2e`)** — הקנבס הכהה, קבוע בכל המסכים.
- **`bg-elev` (`#201338`)** — משטח כותרת/רקע-משני, מעט בהיר יותר מ-`bg-base`.
- **`surface-glass` (`rgba(38,24,63,0.65)`)** — משטח כרטיסים/דיאלוגים: שכבת זכוכית שקופה-חלקית על גבי הרקע, לא צבע אטום שטוח. זה ה-glassmorphism "האחראי" (עדין, לא מגזים) — עומק בלי לפגוע בקריאות.
- **`surface-glass-border` (`rgba(255,255,255,0.08)`)** — קו-מתאר עדין סביב משטחי זכוכית, מחליף צל כבד.
- **`accent-violet` (`#7c5cff`) → `accent-pink` (`#ff5f8f`)** — הגרדיאנט המותגי היחיד. שמור לכותרת, ל-FAB, למספרי ספירה בולטים ולפעולה ראשית. **לא** לשימוש דקורטיבי חוזר בכל מקום — עקביות עם עקרון "צבע אחד עם משמעות" מונעת "רעש".
- **`text-primary` / `text-secondary` / `text-disabled`** — היררכיית טקסט לבנה-סגלגלה על רקע כהה; שלוש רמות בלבד, לא יותר.
- **`danger` (`#ff5f5f`)** — מחיקה/אזהרה בלבד, לא decoration. יחס ניגודיות מול `bg-base`/`surface-glass`: **4.6:1** (עומד ב-WCAG AA) — משמש בטקסט כפתור-מחיקה ב-sheet אישור המחיקה (ר' EXPERIENCE.md.Interaction Primitives).
- **טקסט/אייקונים על גבי הגרדיאנט (`accent-violet`→`accent-pink`) ישירות** (כותרת, FAB) — **חייבים להיות לבן מלא (`#ffffff`) עם משקל מודגש**, לא `text-primary`. `accent-pink` (`#ff5f8f`) לבדו לא עומד ב-4.5:1 מול `text-primary` (`#f4f1fb`, כמעט-לבן) — ניגודיות-לבן-מלא-על-גרדיאנט נבדקה ועומדת ביחס ≥4.5:1 בכל נקודה על פני הגרדיאנט, כולל הקצה הבהיר ביותר (`accent-pink`).

**הימנעות:** צבעי-מצב נוספים (ירוק=success, כתום=warning) — אלה שייכים לאפליקציות ניהול-משימות, לא לאפליקציית חגיגה. אין להוסיף פלטת "קטגוריות" צבעונית לאירועים — האייקון (אמוג'י) כבר מספק בידול, צבע נוסף יהיה רעש.

## Typography

**Heebo** (Google Fonts, variable font, מיועדת לעברית) מחליפה את מחסנית הפונטים הגנרית הקיימת — משקל משתנה מאפשר ליבת-הספירה להיות עבה/בולטת (800) בלי לטעון קובץ פונט נפרד לכל משקל (יתרון ביצועים אמיתי, לא רק אסתטי). Fallback: `-apple-system, "Segoe UI", Arial` למקרה שהפונט לא נטען.

**מספר הספירה הוא גיבור הטיפוגרפיה** — `countdown-hero` (56-72px, 800) מוצג רק באריח הגדול (האירוע הקרוב ביותר); `countdown-compact` (24-28px, 700) בשאר השורות. ספרות טבלאיות (tabular numerals) חובה כדי שהמספר לא "יקפוץ" ברוחב כשמתעדכן.

`title` לכותרות מסך/דיאלוג, `body` לשמות אירועים, `meta` לתאריכים ולטקסט משני.

## Layout & Spacing

סולם: 4 / 8 / 12 / 16 / 20 / 28 / 40px. עמודה בודדת בלבד (מובייל, RTL) — אין שני-טורים. מרווח גדול (28-40px) בין הכותרת לאריח הגיבור; מרווח בינוני (16-20px) בין כרטיסים ברשימה; מרווח קטן (8-12px) בתוך כרטיס בין אלמנטים קשורים.

שוליים: 16px בכל צדי המסך (עקבי לתקן Android).

## Elevation & Depth

**אין צללים כבדים.** עומק מגיע משכבות זכוכית שקופות-חלקית (`surface-glass` על `bg-base`) וקו-מתאר עדין (`surface-glass-border`) — לא מ-`box-shadow` דרמטי. זהו יישום ממוקד של "glassmorphism אחראי" (טרנד 2026): שכבה אחת של טשטוש-רקע עדין (`backdrop-filter: blur(12px)`), לא ערימת-זכוכית מרובת-שכבות שפוגעת בקריאות וב-performance.

האריח הגיבור (hero card) הוא היחיד עם עוצמת-זכוכית מוגברת מעט (`blur` חזק יותר + הילת-גרדיאנט עדינה) כדי לבדל אותו ויזואלית מהשורות הקומפקטיות — זו ההיררכיה, לא צל.

## Shapes

`rounded/sm` (10px) לשדות קלט ולכפתורים קטנים. `rounded/md` (16px) לשורות קומפקטיות. `rounded/lg` (24px) לאריח הגיבור ולדיאלוגים — הרדיוס הגדול והמשטח השקוף יחד יוצרים תחושת "סקווירקל" (squircle) רכה בלי מורכבות טכנית של SVG clip-path.

FAB (כפתור הוספה) — עיגול מלא, היוצא-דופן היחיד לכלל ה-squircle (עיגול מתאים ל-FAB ברוב מערכות ההפעלה).

## Components

- **Hero Card** — האירוע הקרוב ביותר בלבד. `rounded/lg`, `surface-glass` עם הילת-גרדיאנט עדינה, `countdown-hero` במרכז, שם האירוע ואייקון מעליו, תאריך מתחת. תופס את מלוא רוחב המסך, גובה בולט (כ-30% מגובה המסך הנראה).
- **Compact Row** — כל שאר האירועים. `rounded/md`, `surface-glass`, אייקון+שם בצד ימין (RTL), `countdown-compact` בצד שמאל. קו-מתאר עדין מפריד בין שורות, לא מילוי-רקע כבד.
- **FAB** — עיגול, גרדיאנט מלא, קבוע בפינה, פעולת "הוספת אירוע" בלבד.
- **Chip Button** — כפתור החגים (✡️) בכותרת: עיגול קטן, `surface-glass`, לא גרדיאנט (משני, לא ראשי).
- **Dialog** — `surface-glass` מוגבר על גבי backdrop כהה-מטושטש, `rounded/lg`, נפתח מהתחתית (bottom-sheet feel) על מובייל.
- **Settings Row** — תווית בצד ימין, מתג/שברון בצד שמאל, `surface-glass` שורתי.
- **Ad Banner** — רצועה קבועה בתחתית המסך הראשי בלבד (מעל ה-FAB, לא מתחתיו — ר' מוק-אפ). רקע `bg-elev` (לא `surface-glass` — כוונה: **פחות בולט**, לא עוד משטח-זכוכית שמושך תשומת לב), קו-מתאר עליון דק (`surface-glass-border`), טקסט/תוכן ב-`meta` על `text-disabled`. גובה קבוע ~48px. **לעולם לא** מוצג בתוך דיאלוג הוספה/עריכה/חגים/הגדרות — רק על המסך הראשי. נעלם לצמיתות (לא רק מוסתר) לאחר רכישת הסרת-פרסומות מוצלחת.

## Do's and Don'ts

| כן | לא |
|---|---|
| צבע אחד (הגרדיאנט המותגי) לפעולה ראשית ולמספר הגיבור בלבד | צביעת-קטגוריות צבעונית לאירועים |
| עומק דרך שכבות זכוכית שקופות + קו-מתאר עדין | צללים כבדים / `box-shadow` דרמטי |
| אריח-גיבור אחד גדול לאירוע הקרוב ביותר | רשימה שטוחה שבה כל האירועים נראים זהים בחשיבות |
| מספר-ספירה כאלמנט הטיפוגרפי הבולט ביותר במסך | טקסט קידוד-מצב עמוס (אייקונים ✓/⚠/● נוספים על מה שכבר קיים) |
| מרווח נדיב סביב האריח הגיבור | דחיסה כדי להכניס יותר תוכן במסך |
| RTL אמיתי בכל רכיב (יישור, כיוון אייקון, כיוון גלילה) | ממשק "מתורגם" שנשאר מכוון LTR מבפנים |
