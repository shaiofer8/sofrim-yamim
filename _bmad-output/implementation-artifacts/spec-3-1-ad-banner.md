---
title: 'Story 3.1: באנר פרסומת (Ad Banner)'
type: 'feature'
created: '2026-08-18'
status: 'done'
route: 'one-shot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** אין עדיין שום דבר במסך הראשי שממש את FR-8 (באנר פרסומת שקט) — וגם אין קובץ `billing.js` (Epic 3, AD-1) בכלל, שדרוש כתשתית ל-Story 3.2/3.3 הבאות.

**Approach:** אלמנט `#ad-banner` סטטי ב-`index.html` (AD-9), עם תג AdSense (AD-5, web בלבד). `billing.js` חדש עם `hasRemovedAds()`/`refreshAdBanner()` — הבעלים הבלעדי של החלטת-התצוגה. **חסימה חשובה:** אין לי עדיין publisher ID אמיתי של AdSense (שי נרשם במקביל) — כל הערכים הם placeholder מסומן בבירור, לא ID מזוייף-נראה-אמיתי.

</frozen-after-approval>

## Suggested Review Order

**באגים אמיתיים שנתפסו ותוקנו בסקירה**

- **ה-id לא תאם את המפרט המאושר.** epics.md ו-AD-9 נועלים במפורש `id="ad-banner"` (kebab-case) — הגרסה הראשונה שלי כתבה `id="adBanner"` (camelCase). תוקן בכל שלושת הקבצים (`index.html`, `billing.js`, ה-selector ב-CSS כבר היה נכון כי הוא היה מבוסס-class לא id)

- **בקשת-פרסומת לא הייתה מותנית ברכישה.** `(adsbygoogle = window.adsbygoogle || []).push({})` היה inline script סטטי ב-HTML, יורה בכל טעינה ללא תלות ב-`hasRemovedAds()` — כלומר גם משתמש-ששילם היה "משלם" מחדש עלות-רשת/סוללה עבור בקשת-פרסומת מיותרת (רק התוצאה הוויזואלית הייתה מוסתרת). הועבר ל-`refreshAdBanner()` ב-`billing.js`, רץ רק כשהבאנר לא-מוסתר
  [`billing.js:35`](../../billing.js#L35)

- **ה-Service Worker יירט גם בקשות cross-origin.** ה-`fetch` handler הקיים (מ-Story 1.1!) לא סינן לפי origin — כל בקשה, כולל Google Fonts וכעת גם סקריפט/פיקסלים/iframes של AdSense, עברה דרך לוגיקת cache-then-network. תוקן עם בדיקת origin מפורשת — תיקון רוחבי, לא רק ל-Epic 3
  [`service-worker.js:31`](../../service-worker.js#L31)

**הליבה**

- `hasRemovedAds` — נקודת-הגישה היחידה למצב-רכישה (AD-4); ברירת-מחדל בטוחה (מציג פרסומות) אם המצב פגום
  [`billing.js:16`](../../billing.js#L16)

## Design Notes

**נבדק ונמצא לא-סתירה אמיתית:** DESIGN.md אומר שהבאנר "נעלם לצמיתות (לא רק מוסתר)" בעוד AD-9 בחר `hidden` toggle ולא מחיקת-DOM. אלה לא סותרים בפועל — "לצמיתות" מתאר את **חוויית-המשתמש** (הבאנר לא חוזר לעולם אחרי רכישה, כי `hasRemovedAds()` נשאר `true` לצמיתות ב-`localStorage`), לא דרישה טכנית-DOM ספציפית. AD-9 בחר את המנגנון הספציפי הזה בכוונה (`billing.js` אף פעם לא נוגע במבנה ה-DOM), וזה משיג את אותה תוצאה נתפסת.

**נדחה ל-`deferred-work.md`:** יחידת AdSense "responsive" גנרית בתוך `min-height:48px` לא מבטיחה גובה מדויק — פורמט "Anchor ad" הייעודי של גוגל בדיוק לרצועה-קבועה-בתחתית הוא הפתרון הנכון לטווח-ארוך, אבל דורש הגדרה בדשבורד AdSense אמיתי שעדיין לא קיים.

**חדש שנוצר:** `ads.txt` בשורש הפרויקט — נדרש ע"י AdSense למילוי-פרסומות תקין (חסר לגמרי קודם), עם placeholder מסומן.

## Verification

**בוצע בפועל (Playwright):** באנר מוצג כברירת-מחדל; מוסתר כשמצב-רכישה מדומה נשמר; מצב-רכישה פגום נופל בחזרה לברירת-מחדל בטוחה (מוצג) בלי קריסה; אין חפיפה בין הבאנר לכרטיס האחרון ברשימה; הבאנר אינו בתוך אף `<dialog>`; **`adsbygoogle.push()` מאומת ישירות שהוא נקרא כשלא-נרכש ולא נקרא כשנרכש** (spy על ה-push); Google Fonts עדיין נטענים תקין אחרי תיקון ה-origin-scoping. שגיאות 400 מ-Google (מצופה עם placeholder ID, מתועד) — לא משפיעות על שום בדיקה פונקציונלית.
