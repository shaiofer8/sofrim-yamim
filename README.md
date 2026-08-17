# סופרים ימים — Countdown PWA

אפליקציית ספירה לאחור בעברית מלאה (RTL), עם חגים ומועדים ישראליים טעונים מראש.
נבנתה כ-PWA, מיועדת לעטיפה כ-TWA ופרסום ב-Google Play.

## מבנה הפרויקט
- `index.html` / `style.css` / `app.js` — האפליקציה עצמה
- `holidays.js` — רשימת חגים ישראליים/יהודיים מוכנה מראש (הזווית הייחודית)
- `manifest.json` + `service-worker.js` — הופכים את זה ל-PWA אמיתי (התקנה, עבודה אופליין)
- `icons/` — אייקוני האפליקציה (נוצרו ע"י `gen_icons.py`)
- `privacy-policy.html` — מדיניות פרטיות (נדרש ל-Google Play)

## הרצה מקומית
פותחים `index.html` בדפדפן, או מריצים שרת סטטי:
```
npx serve .
```

## פריסה (Netlify)
הפרויקט מוגדר עם `netlify.toml`. ברגע שיש חיבור ל-Netlify, כל push ל-main יעדכן את האתר החי.

## השלבים הבאים (TWA → Google Play)
1. לוודא שהאתר חי בכתובת HTTPS קבועה (Netlify)
2. להתקין Bubblewrap: `npm i -g @bubblewrap/cli`
3. `bubblewrap init --manifest https://<domain>/manifest.json`
4. `bubblewrap build` → מייצר `app-release-signed.aab`
5. **לשמור את קובץ ה-keystore שנוצר במקום בטוח מחוץ ל-git** — בלעדיו אי אפשר לעדכן את האפליקציה לעולם
6. העלאה ל-Google Play Console (עם 12+ בודקים לבדיקה סגורה של 14 יום)
