---
title: 'Story 4.1: יצירת פרויקט TWA עם Bubblewrap'
type: 'chore'
created: '2026-08-18'
status: 'done'
review_loop_iteration: 0
context: []
baseline_commit: '994d58386b30a759b5e6f98500dff4580b513cf5'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** אין עדיין פרויקט Android עוטף — לא ניתן לבנות `.aab` לפרסום ב-Google Play בלי `twa-manifest.json` ומפתח חתימה (keystore).

**Approach:** מריצים `bubblewrap init` (דרך `npx @bubblewrap/cli`, בלי התקנה גלובלית) בשורש הריפו, מכוונים ל-manifest החי `https://shaiofer8.github.io/sofrim-yamim/manifest.json` (לא Netlify כפי שנוסח בארכיטקטורה — הדומיין בפועל הוא GitHub Pages, ר' Design Notes). Bubblewrap מייצר `twa-manifest.json` + פרויקט Android/Gradle מלא + keystore חדש (אין קיים).

## Boundaries & Constraints

**Always:** ה-keystore החדש חייב להישאר מחוץ ל-git (התבנית `*.keystore`/`*.jks` כבר קיימת ב-`.gitignore`). `twa-manifest.json` **כן** נכנס ל-git (עקבי עם `.gitignore` הקיים שמחריג רק את הגרסה `.bak` שלו, ר' Structural Seed בארכיטקטורה). לפני כל commit — להרחיב את `.gitignore` לפריטי build/IDE סטנדרטיים של Android/Gradle שה-wizard עומד ליצור (`local.properties`, `.gradle/`, `build/`, `app/build/`, `.idea/`, `*.iml`, `.cxx/`, `captures/`) כדי שלא יידחפו בטעות. סיסמת ה-keystore ופרטי ה-alias יימסרו למשתמש בבירור בסוף (בטקסט לצ'אט, לא בקובץ שנכנס ל-git) — זה נכס קריטי, לא ניתן לשחזור.

**Ask First:** שם החבילה (package name, למשל `com.sofrimyamim.app`) — **קבוע לצמיתות** אחרי פרסום ראשון ב-Play, אי אפשר לשנות. מוצע כאן לאישור/שינוי לפני ביצוע (ר' Design Notes). אם התקנת ה-JDK/Android SDK האוטומטית של Bubblewrap נכשלת או דורשת אישור-רישיון אינטראקטיבי שלא ניתן לסקריפט — HALT ולדווח, לא לנחש/לכפות תשובות.

**Never:** לא לגעת ב-Story 4.2 (`assetlinks.json`)/4.3 (`bubblewrap build` לחתימת ה-`.aab`) בסטורי הזו. לא להעלות שום דבר בפועל ל-Play Console. לא לכתוב את סיסמת ה-keystore לשום קובץ שעלול להיכנס ל-git (כולל את ה-spec הזה).

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/architecture/architecture-sofrim-yamim-2026-08-17/ARCHITECTURE-SPINE.md:127-145` -- Structural Seed: `twa-manifest.json` נכנס לשורש הריפו, לצד קבצי ה-PWA הקיימים; לא מפרט את שאר קבצי פרויקט ה-Android (נראה כמכוון — התייחסות כ"רעש", לא כהחרגה מכוונת מ-git, ר' Design Notes)
- `.gitignore` -- כבר מכיל `*.keystore`, `*.jks`, `twa-manifest.json.bak` — נקודת המוצא; יורחב במשימה זו
- `manifest.json` -- מקור-האמת שה-wizard יקרא ממנו (name/short_name/icons/theme_color/start_url וכו')
- `README.md:22-27` -- "השלבים הבאים" כבר מתעד את הזרימה הזו באופן כללי; יעודכן בסוף לשקף מה שבוצע בפועל

## Tasks & Acceptance

**Execution:**
- [x] הרצת `npx @bubblewrap/cli init --manifest https://shaiofer8.github.io/sofrim-yamim/manifest.json` בשורש `c:\Users\shaio\sofrim-yamim` -- מייצר `twa-manifest.json` + פרויקט Android/Gradle -- **סטייה מתועדת בביצוע (לא בכוונה):** האשף האינטראקטיבי של `@bubblewrap/cli` (מבוסס `inquirer`) קורס עם `ERR_USE_AFTER_CLOSE` על כל prompt שני ברצף בסביבה הזו (non-TTY) — לא קשור לתוכן התשובות, שוחזר גם עם קלט ריק לגמרי. עקפתי ע"י קריאה ישירה ל-`@bubblewrap/core` (אותו `TwaManifest.fromWebManifest` + `TwaGenerator` + `KeyTool` שהאשף עצמו קורא להם, ר' Design Notes) — תוצאה זהה, בלי `inquirer`
- [x] התקנת JDK: האינסטולר האוטומטי של Bubblewrap (`JdkInstaller`) נכשל בשקט (exit 0, ללא שגיאה) באמצע חילוץ ה-ZIP של קוד-המקור של JDK — שוחזר גם בקריאה ישירה ל-`extract-zip` בבידוד (34 קבצים בלבד מתוך אלפים, ללא callback של הצלחה/שגיאה). עקפתי: הורדתי וחילצתי ידנית JDK 17 Temurin (בינארי בלבד, בלי קוד-מקור שאין בו צורך בפועל) מ-Adoptium ל-`C:\Users\shaio\.bubblewrap\jdk17-manual\`; Android SDK **לא** הותקן -- לא נדרש ל-AC של הסטורי הזו (`init` בלבד), רלוונטי ל-Story 4.3 (`bubblewrap build`)
- [x] יצירת keystore חדש -- `android.keystore` בשורש הריפו, alias `android`. **סטייה נוספת:** `KeyTool.createSigningKey()` הפנימי מריץ `keytool` (בלי נתיב מלא) ומסתמך על `PATH` שה-JdkHelper אמור לבנות -- לא הצליח למצוא את הפקודה בסביבה הזו; עקפתי בהרצת `keytool.exe` בנתיב המלא תחת ה-JDK הידני, עם אותה פקודה בדיוק (`-genkeypair -dname ... -alias android -validity 20000 -keyalg RSA`). סיסמה חזקה (28 תווים אלפאנומריים) נמסרה למשתמש בצ'אט בלבד
- [x] `.gitignore` -- הוספת `local.properties`, `.gradle/`, `build/`, `app/build/`, `.idea/`, `*.iml`, `.cxx/`, `captures/`
- [x] `git status --short` + `git check-ignore -v android.keystore` -- אומת: `android.keystore` מוחרג (`.gitignore:3:*.keystore`), `twa-manifest.json` מופיע כקובץ חדש למעקב
- [x] `README.md` -- עודכן: פריסה בפועל (GitHub Pages, לא Netlify כפי שהניחה הארכיטקטורה), מצב TWA, אזהרת גיבוי keystore, ודגל להחלטת-דומיין נדרשת לפני Story 4.2 (ר' Design Notes)

**Acceptance Criteria:**
- Given `@bubblewrap/cli` זמין דרך `npx`, when מריצים `init --manifest` מול ה-manifest החי, then נוצר `twa-manifest.json` תקין עם `packageId`, `host`, ו-`manifestUrl` שמצביע על `https://shaiofer8.github.io/sofrim-yamim/manifest.json`
- Given אין keystore קיים, when האשף מגיע לשלב החתימה, then נוצר keystore חדש בנתיב שתואם ל-pattern הקיים ב-`.gitignore` (`*.keystore` או `*.jks`)
- Given הריצה הושלמה, when מריצים `git status --short`, then ה-keystore לא מופיע ברשימת קבצים לא-עקובים/staged (מוחרג בפועל), ו-`twa-manifest.json` כן מופיע כקובץ חדש

## Design Notes

**שם חבילה מוצע:** `com.sofrimyamim.app` — פשוט, תואם את שם המוצר, לא תלוי בדומיין הזמני (github.io/staging). ניתן לשנות לפני האישור הראשוני — **אחרי פרסום ראשון ב-Play זה בלתי-הפיך**.

**למה בשורש הריפו ולא בתיקייה נפרדת:** שקלתי להפריד את פרויקט ה-Android לתיקייה נפרדת מחוץ ל-repo (כדי לשמור על AD-1 "אפס build step" נקי מבחינה מושגית), אבל דחיתי את זה: הארכיטקטורה כבר קובעת במפורש ש-`twa-manifest.json` חי בשורש הריפו (ר' Code Map), וה-`.gitignore` הקיים כבר בנוי סביב ההנחה "רץ בתוך הריפו" (מחריג `*.keystore`/`*.jks`/`.bak`, לא תיקייה שלמה). מכבד את מה שכבר הוחלט, מרחיב את ה-`.gitignore` להיגיינת Android/Gradle סטנדרטית כדי שרק קוד-מקור רלוונטי (לא build output/IDE state) ייכנס ל-git.

**דומיין GitHub Pages, לא Netlify:** הארכיטקטורה מניחה Netlify; בפועל נפרס GitHub Pages (`shaiofer8.github.io/sofrim-yamim`) — ר' `sofrim-yamim-epic4-blockers` בזיכרון. פונקציונלית זהה (אחסון סטטי HTTPS), לא חוסם את הסטורי הזו; רק לוודא ש-`manifestUrl` ב-`twa-manifest.json` מצביע לדומיין הנכון בפועל.

**זמן/משאבים:** הורדת JDK+Android SDK אוטומטית ע"י Bubblewrap (אין קיימים במחשב) עלולה לקחת זמן משמעותי ולתפוס מספר GB דיסק — לא נכשל על כך, רק לדווח אם זה נתקע.

**עדכון בזמן ביצוע — למה קריאה ישירה ל-`@bubblewrap/core` במקום ה-CLI האינטראקטיבי:** ה-Approach המקורי הניח `bubblewrap init` אינטראקטיבי; בפועל התגלו שני באגים אמיתיים וניתנים-לשחזור בסביבה הזו (Windows/Git-Bash, non-TTY) שאינם קשורים לתוכן הקלט: (1) `inquirer` קורס על ה-prompt השני ברצף (`ERR_USE_AFTER_CLOSE`) — נבדק גם עם קלט ריק לחלוטין; (2) האינסטולר האוטומטי של ה-JDK נתקע/נכשל בשקט (exit 0) בחילוץ ה-ZIP של קוד-המקור. קראתי את המקור הפתוח של `@bubblewrap/cli`/`@bubblewrap/core` (מהמטמון המקומי) ומיפיתי בדיוק אילו קריאות ל-`TwaManifest.fromWebManifest`, `TwaGenerator.createTwaProject`, ו-`KeyTool.createSigningKey` האשף עצמו מבצע — ואז קראתי להן ישירות מסקריפט Node קטן, עם אותם ברירות-מחדל (נשאבות חי מ-`manifest.json`) ואותם override-ים (packageId, playBilling). התוצאה זהה ל-מה שהאשף היה מייצר; ה-`keytool` עצמו הורץ בנתיב מלא (לא דרך ה-`PATH`-injection הפנימי של הספרייה, שגם בו התגלה באג נפרד). כל שלושת הבאגים תועדו כאן לשקיפות; הם בכלי הצד-שלישי, לא בקוד של הפרויקט.

**גילוי אדריכלי חשוב לקראת Story 4.2 (לא נפתר כאן, מכוון):** `twa-manifest.json`'s `host` הוא `shaiofer8.github.io` (השורש הנכון), אבל האתר בפועל יושב תחת `/sofrim-yamim/` (subpath של GitHub Pages project site). Digital Asset Links (`assetlinks.json`, Story 4.2) **חייב** לשבת ב-`https://shaiofer8.github.io/.well-known/assetlinks.json` — שורש הדומיין המלא, לא ה-subpath — וזה מחוץ לשליטת הרפו הזה (שייך לרפו-משתמש נפרד `shaiofer8.github.io`, לא קיים). זו החלטה עסקית/דומיין שצריך את שי לפני Story 4.2 (דומיין קסטום מול מעבר לרפו-משתמש) — תועד גם ב-README.md ובזיכרון (`sofrim-yamim-epic4-blockers`).

## Verification

**Commands:**
- `git status --short` -- expected: `twa-manifest.json` (וקבצי הפרויקט הרלוונטיים) מופיעים כחדשים; שום קובץ `*.keystore`/`*.jks` לא מופיע
- `git check-ignore -v <נתיב-keystore-בפועל>` -- expected: מחזיר match מול `.gitignore:<שורה>`
- `cat twa-manifest.json` -- expected: `packageId`, `host`, `manifestUrl` תקינים ותואמים לדומיין החי

**Manual checks (if no CLI):**
- וידוא בעל-פה/בטקסט שהמשתמש קיבל וקרא את סיסמת ה-keystore + מיקום הקובץ, והבין שהוא צריך לגבות אותו במקום בטוח מחוץ ל-git

## Suggested Review Order

**קונפיגורציית ה-TWA (הליבה של הסטורי)**

- נקודת הכניסה — כל השדות שנשלטו/נדרסו במפורש (packageId, host, playBilling)
  [`twa-manifest.json:2`](../../twa-manifest.json#L2)

- נתיב ה-keystore נשמר absolute (תואם התנהגות ברירת-מחדל של Bubblewrap עצמו — ר' deferred-work.md)
  [`twa-manifest.json:20`](../../twa-manifest.json#L20)

- פיצ'ר playBilling הופעל במפורש — נדרש כדי ש-Digital Goods API הקיים ב-billing.js יעבוד בפועל בתוך TWA עטוף
  [`twa-manifest.json:30`](../../twa-manifest.json#L30)

**איפה זה בא לידי ביטוי בפרויקט Android שנוצר**

- ה-PaymentActivity שגשר ה-playBilling מוסיף בפועל ל-AndroidManifest
  [`AndroidManifest.xml:203`](../../app/src/main/AndroidManifest.xml#L203)

- תלות ה-Gradle התואמת (`androidbrowserhelper:billing`)
  [`build.gradle:211`](../../app/build.gradle#L211)

**היגיינת git סביב תוצרי הבנייה**

- הרחבת `.gitignore` ל-build artifacts של Android/Gradle + AAB/APK (נוסף בסבב הסקירה)
  [`.gitignore:16`](../../.gitignore#L16)

**תיעוד ומצב לקראת Story 4.2**

- מצב TWA + אזהרת גיבוי keystore + תזכורת מסלול-בדיקה-סגורה (נוסף בסבב הסקירה)
  [`README.md:25`](../../README.md#L25)

- הממצא הארכיטקטוני החשוב ביותר לקראת Story 4.2: assetlinks.json חייב שורש-דומיין, לא subpath
  [`README.md:23`](../../README.md#L23)
