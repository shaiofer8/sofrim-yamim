# סופרים ימים — Countdown PWA

אפליקציית ספירה לאחור בעברית מלאה (RTL), עם חגים ומועדים ישראליים טעונים מראש.
נבנתה כ-PWA, מיועדת לעטיפה כ-TWA ופרסום ב-Google Play.

## מבנה הפרויקט
- `index.html` / `style.css` / `app.js` — האפליקציה עצמה
- `holidays.js` — רשימת חגים ישראליים/יהודיים מוכנה מראש (הזווית הייחודית)
- `notifications.js` — תזכורות (Epic 2): נטען אחרי `app.js`, שומר תמונת-קריאה ל-IndexedDB עבור ה-Service Worker
- `manifest.json` + `service-worker.js` — הופכים את זה ל-PWA אמיתי (התקנה, עבודה אופליין)
- `icons/` — אייקוני האפליקציה (נוצרו ע"י `gen_icons.py`)
- `privacy-policy.html` — מדיניות פרטיות (נדרש ל-Google Play)

## הרצה מקומית
פותחים `index.html` בדפדפן, או מריצים שרת סטטי:
```
npx serve .
```

## פריסה (GitHub Pages)
האתר החי: https://shaiofer8.github.io/sofrim-yamim/ (רפו: `shaiofer8/sofrim-yamim`, branch `main`, GitHub Pages מופעל על השורש). כל `git push` ל-`main` מפרסם אוטומטית תוך דקה-שתיים. `netlify.toml` נשאר בריפו כשריד מהתכנון המקורי (הארכיטקטורה הניחה Netlify) אך לא בשימוש בפועל.

**חשוב לארכיטקטורת TWA (Story 4.2):** האתר יושב תחת subpath (`/sofrim-yamim/`), לא בשורש הדומיין. Digital Asset Links (`assetlinks.json`) **חייב** לשבת בשורש הדומיין (`https://shaiofer8.github.io/.well-known/assetlinks.json`) — וזה שייך לרפו-משתמש נפרד (`shaiofer8.github.io`), לא לרפו הזה. לפני Story 4.2 צריך להחליט: (א) לעבור לדומיין קסטום דרך GitHub Pages (פותר את זה לגמרי, גם ה-`host` ב-`twa-manifest.json` ישתנה בהתאם), או (ב) להעביר את הפריסה לרפו `shaiofer8.github.io` (תופס את כל השורש של החשבון לפרויקט הזה). לא הוכרע עדיין.

## מצב TWA (Bubblewrap)
- ✅ **Story 4.1 בוצע** (2026-08-18): `twa-manifest.json` נוצר (`packageId`: `com.sofrimyamim.app`, כולל פיצ'ר `playBilling` — נדרש ל-Digital Goods API הקיים ב-`billing.js`), פרויקט Android/Gradle מלא נוצר (`app/`, `build.gradle`, `gradle/` וכו'), ו-keystore חתימה נוצר ב-`android.keystore` (בשורש הריפו, **מוחרג מ-git** דרך `.gitignore`).
- **⚠️ גיבוי ה-keystore:** קובץ `android.keystore` + הסיסמה שלו (נמסרו בנפרד, לא כתובים בשום קובץ בריפו) הם נכס קריטי חד-פעמי — **בלעדיהם אי אפשר לעדכן את האפליקציה בחנות לעולם**. יש לגבות את `android.keystore` למקום בטוח מחוץ ל-git (Google Drive פרטי/מנהל סיסמאות) **לפני** שממשיכים הלאה.
- הבא בתור: Story 4.2 (`assetlinks.json` + החלטת דומיין למעלה), ואז Story 4.3 (`bubblewrap build` → `app-release-signed.aab`, דורש התקנת Android SDK שעדיין לא בוצעה — Story 4.1 הסתפקה ב-JDK בלבד לפי ה-AC שלה).
- **תזכורת (מ-PRD §9):** לפני גישת-ייצור ב-Play Console נדרש מסלול בדיקה סגורה עם **12+ בודקים ברציפות 14 יום** (Story 4.5) — מומלץ להתחיל לגייס כבר עכשיו, במקביל להמשך הפיתוח, לא לחכות לסיום.
