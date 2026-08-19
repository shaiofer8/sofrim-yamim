# Story 4.4 — מדריך: רישום האפליקציה ב-Play Console + טופס Data Safety

<!-- מדריך ידני לשי — לא קוד. מוכן לפי ה-AC של Story 4.4 ב-epics.md ולפי המדיניות הקיימת ב-privacy-policy.html. -->

זה מדריך "מלא-אחריי" — כל תשובה שאתה צריך לתת כבר כתובה כאן, מבוססת על מה שבפועל בנוי באפליקציה. הדבר היחיד שנדרש ממך זה ללחוץ ולהעתיק.

## שלב 1: יצירת רשומת האפליקציה

1. היכנס ל-[Play Console](https://play.google.com/console)
2. **All apps** → **Create app**
3. מלא:
   - **App name:** סופרים ימים
   - **Default language:** עברית - Hebrew
   - **App or game:** App
   - **Free or paid:** Free (הרכישה של "הסרת פרסומות" היא in-app purchase, לא הופכת את האפליקציה עצמה לבתשלום)
   - סמן את שתי הצהרות המדיניות (Developer Program Policies + US export laws)
4. **Create app**

## שלב 2: טופס Data Safety

בתפריט השמאלי: **App content** → **Data safety** → **Start**.

### "Data collection and security"

| שאלה | תשובה |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** |
| Do you provide a way for users to request that their data is deleted? | **No** — אין חשבון משתמש ואין שרת; אין "בקשת מחיקה" כי אין מה למחוק בצד שלנו (הכל מקומי במכשיר) |

### סוגי נתונים — סמן **רק** את הבא:

**Device or other IDs**
- ✅ Collected
- Purpose: **Advertising or marketing**
- Is this data shared with third parties? **Yes** — עם Google AdSense
- Is this data processed ephemerally? No
- Is collection required or optional? **Required** (הפרסומת נטענת תמיד כברירת מחדל, לא ניתן להשבית — רק "הסרת פרסומות" בתשלום מפסיקה זאת)

**את כל שאר הקטגוריות (Location, Personal info, Financial info, Health & fitness, Messages, Photos/Videos, Audio, Files/docs, Calendar, Contacts, App activity, App info & performance, Web browsing) — השאר "Not collected".**

**למה זה נכון:** אין שרת backend כלל (`AD-2` בארכיטקטורה) — כל האירועים שהמשתמש מזין (שם/תאריך אירוע) נשארים ב-`localStorage`/`IndexedDB` על המכשיר בלבד, לעולם לא נשלחים החוצה. אין חשבון משתמש, אין login, אין אנליטיקס SDK. הרכישה היחידה (הסרת פרסומות) עוברת דרך Google Play Billing — גוגל מטפלים בפרטי התשלום, האפליקציה לא רואה/שומרת אותם בכלל.

### Privacy policy URL
```
https://sofrimyamim.com/privacy-policy.html
```
(ברגע שהדומיין עולה — עדכן אותי ואוודא שהעמוד נגיש)

## שלב 3: שאר "App content" (נדרש לפני פרסום)

- **App access:** All functionality available without special access (אין login)
- **Ads:** Yes, app contains ads
- **Content rating:** מלא שאלון (בסבירות גבוהה תקבל דירוג "Everyone"/"General" — אין תוכן אלים/מיני/הימורים)
- **Target audience:** בחר קבוצת גילאים כללית (לא מיועד לילדים ספציפית — לא Google Play for Families)
- **News app:** No
- **COVID-19:** No (לא רלוונטי)

## שלב 4: Store listing (בסיסי, אפשר לשפר אחר כך)

- **Short description** (עד 80 תווים): `ספירה לאחור לחגים ומועדים אישיים — עברית מלאה`
- **Full description**: אפשר להשתמש בתיאור מה-`README.md`/PRD כבסיס, אני יכול לנסח גרסה שיווקית אם תרצה
- **Icons/screenshots:** `icons/` בריפו כבר קיימים לאייקון; screenshots צריך לצלם מהאפליקציה בפועל (לא בוצע עדיין)

## מה עוד חסום עד שיש build אמיתי (Story 4.3)

- **Testers** (סעיף 2 שכבר דיברנו עליו) — מסלול הבדיקה הסגורה עצמו לא נוצר עד שיש `.aab` להעלות
- Production release

---

**כשתסיים כל שלב — תגיד לי, ואני אעדכן את הסטטוס ואמשיך לתאם עם שאר הסטוריז.**
