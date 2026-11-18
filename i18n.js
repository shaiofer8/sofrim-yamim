// i18n.js — Translations for Sofrim Yamim (Hebrew + English)
// Usage: t('key') returns the string for the current language; t('key', {n: 3})
// fills {n}-style placeholders. Static markup is translated declaratively via
// data-i18n / data-i18n-placeholder / data-i18n-aria / data-i18n-title (see
// applyTranslations()). Hebrew values are copied verbatim from the original
// markup/code, so applying them leaves the Hebrew UI exactly as it was.

const i18nData = {
  he: {
    // App
    "app.title": "סופרים ימים",
    "app.description": "ספירה לאחור לאירועים, חגים ומועדים — בעברית מלאה",
    "app.heading": "🗓️ סופרים ימים",
    "app.shareText": "סופרים ימים — ספירה לאחור לאירועים, חגים ומועדים",

    // Header
    "header.settings": "הגדרות",
    "header.settingsLabel": "הגדרות",
    "header.share": "שתף",
    "header.shareTitle": "שתף עם חברים",
    "header.shareLabel": "שיתוף",
    "header.holidays": "חגים ומועדים",
    "header.holidaysLabel": "חגים",
    "header.add": "הוספת אירוע",

    // Main
    "main.empty": "אין עדיין אירועים. הוסיפו את הראשון.",
    "main.heroAria": "אירוע קרוב ביותר: {name}, {count}",
    "main.favorite": "מועדף",
    "main.ad": "פרסומת",

    // Event dialog
    "dialog.newEvent": "אירוע חדש",
    "dialog.editEvent": "עריכת אירוע",
    "dialog.eventName": "שם האירוע",
    "dialog.eventNamePlaceholder": "לדוגמה: יום הולדת לאמא",
    "dialog.dateType": "סוג תאריך",
    "dialog.gregorian": "לועזי",
    "dialog.hebrew": "עברי",
    "dialog.date": "תאריך",
    "dialog.hebrewDate": "תאריך עברי",
    "dialog.hebrewDay": "יום בחודש",
    "dialog.hebrewMonth": "חודש עברי",
    "dialog.hebrewYear": "שנה עברית",
    "dialog.gregorianPreview": "בלועזי: {date}",
    "dialog.icon": "אייקון",
    "dialog.favorite": "⭐ הצג כמועדף על סמל האפליקציה",
    "dialog.addToCalendar": "📅 הוסף ליומן",
    "dialog.nameRequired": "נא להזין שם אירוע",
    "dialog.unnamedEvent": "האירוע",
    "dialog.icsFallbackName": "אירוע",

    // Emoji / icon options
    "emoji.celebration": "🎉 חגיגה",
    "emoji.birthday": "🎂 יום הולדת",
    "emoji.wedding": "💍 חתונה",
    "emoji.bachelorette": "💃 מסיבת רווקות",
    "emoji.bachelor": "🍻 מסיבת רווקים",
    "emoji.mikveh": "💧 טבילה במקווה",
    "emoji.trip": "✈️ טיול",
    "emoji.backFromVacation": "🧳 חזרה מחופשה",
    "emoji.schoolStart": "🎒 תחילת לימודים",
    "emoji.holiday": "🕎 חג",
    "emoji.memorial": "🕯️ אזכרה",
    "emoji.graduation": "🎓 סיום לימודים",
    "emoji.work": "💼 עבודה / יעד",
    "emoji.other": "⭐ אחר",

    // Presets (holidays) dialog
    "presets.title": "הוספה מהירה — חגים ומועדים",
    "presets.hint": "בחרו אירוע כדי להוסיף אותו לרשימה שלכם.",
    "presets.empty": "רשימת החגים לא מעודכנת כרגע. תוכלו להוסיף אירוע ידנית.",

    // Delete confirmation
    "delete.title": "מחיקת אירוע",
    "delete.confirm": "למחוק את \"{name}\"?",

    // Announcements (screen-reader live region)
    "message.saveFailed": "השמירה נכשלה. נסו שוב.",
    "message.saved": "האירוע נשמר.",
    "message.deleted": "האירוע נמחק.",
    "message.icsDownloaded": "קובץ יומן הורד.",
    "message.linkCopied": "הקישור לאפליקציה הועתק",
    "message.copyLinkPrompt": "העתיקו את הקישור לאפליקציה:",

    // Count labels
    "time.today": "היום",
    "time.tomorrow": "מחר",
    "time.yesterday": "אתמול",
    "time.twoDays": "יומיים",
    "time.days": "ימים",
    "time.passed": "עברו",
    "time.daysPassed": "ימים עברו",

    // Buttons
    "button.save": "שמירה",
    "button.cancel": "ביטול",
    "button.delete": "מחיקה",
    "button.close": "סגירה",

    // Settings
    "settings.title": "הגדרות",
    "settings.notifications": "התראות",
    "settings.shareApp": "שיתוף האפליקציה",
    "settings.language": "שפה",
    "settings.hebrew": "עברית",
    "settings.english": "English",
    "settings.whatsapp": "יצירת קשר בוואטסאפ",

    // Notifications
    "notif.unsupported": "התראות אינן נתמכות בדפדפן הזה.",
    "notif.denied": "יש לאשר התראות בהגדרות הדפדפן או המכשיר.",
    "notif.granted": "התראות מאושרות. תזכורות מתוזמנות דורשות גם התקנת האפליקציה.",
    "notif.grantedAnnounce": "התראות אושרו.",

    // Billing
    "billing.removeAds": "הסרת פרסומות — $1.99",
    "billing.removeAdsPrice": "הסרת פרסומות — {price}",
    "billing.adsRemoved": "הפרסומות הוסרו.",
    "billing.failed": "הרכישה לא הושלמה. נסו שוב.",

    // Hebrew months (English spellings are used in the Hebrew date picker)
    "month.tishrei": "תשרי",
    "month.cheshvan": "חשוון",
    "month.kislev": "כסלו",
    "month.tevet": "טבת",
    "month.shevat": "שבט",
    "month.adar": "אדר",
    "month.adarI": "אדר א׳",
    "month.adarII": "אדר ב׳",
    "month.nisan": "ניסן",
    "month.iyar": "אייר",
    "month.sivan": "סיוון",
    "month.tammuz": "תמוז",
    "month.av": "אב",
    "month.elul": "אלול",

    // Holidays (Hebrew values match holidays.js exactly)
    "holiday.roshHashanah": "ראש השנה",
    "holiday.yomKippur": "יום כיפור",
    "holiday.sukkot": "סוכות",
    "holiday.simchatTorah": "שמחת תורה",
    "holiday.hanukkah": "חנוכה",
    "holiday.tuBishvat": "ט\"ו בשבט",
    "holiday.purim": "פורים",
    "holiday.passover": "פסח",
    "holiday.yomHashoah": "יום השואה",
    "holiday.yomHazikaron": "יום הזיכרון",
    "holiday.yomHaatzmaut": "יום העצמאות",
    "holiday.lagBaomer": "ל\"ג בעומר",
    "holiday.shavuot": "שבועות",
    "holiday.tishaBav": "תשעה באב",

    // Referral
    "referral.shareText": "סופרים את הימים לרגעים החשובים – עם סופרים ימים!",
  },
  en: {
    // App
    "app.title": "Sofrim Yamim",
    "app.description": "Countdown to events, holidays and special dates",
    "app.heading": "🗓️ Sofrim Yamim",
    "app.shareText": "Sofrim Yamim — a countdown to your events, holidays and special dates",

    // Header
    "header.settings": "Settings",
    "header.settingsLabel": "Settings",
    "header.share": "Share",
    "header.shareTitle": "Share with friends",
    "header.shareLabel": "Share",
    "header.holidays": "Holidays",
    "header.holidaysLabel": "Holidays",
    "header.add": "Add event",

    // Main
    "main.empty": "No events yet. Add your first one.",
    "main.heroAria": "Next event: {name}, {count}",
    "main.favorite": "Favorite",
    "main.ad": "Advertisement",

    // Event dialog
    "dialog.newEvent": "New event",
    "dialog.editEvent": "Edit event",
    "dialog.eventName": "Event name",
    "dialog.eventNamePlaceholder": "e.g. Mom's birthday",
    "dialog.dateType": "Date type",
    "dialog.gregorian": "Gregorian",
    "dialog.hebrew": "Hebrew",
    "dialog.date": "Date",
    "dialog.hebrewDate": "Hebrew date",
    "dialog.hebrewDay": "Day of month",
    "dialog.hebrewMonth": "Hebrew month",
    "dialog.hebrewYear": "Hebrew year",
    "dialog.gregorianPreview": "Gregorian date: {date}",
    "dialog.icon": "Icon",
    "dialog.favorite": "⭐ Show as favorite on the app icon",
    "dialog.addToCalendar": "📅 Add to calendar",
    "dialog.nameRequired": "Please enter an event name",
    "dialog.unnamedEvent": "Untitled event",
    "dialog.icsFallbackName": "Event",

    // Emoji / icon options
    "emoji.celebration": "🎉 Celebration",
    "emoji.birthday": "🎂 Birthday",
    "emoji.wedding": "💍 Wedding",
    "emoji.bachelorette": "💃 Bachelorette party",
    "emoji.bachelor": "🍻 Bachelor party",
    "emoji.mikveh": "💧 Mikveh immersion",
    "emoji.trip": "✈️ Trip",
    "emoji.backFromVacation": "🧳 Back from vacation",
    "emoji.schoolStart": "🎒 First day of school",
    "emoji.holiday": "🕎 Holiday",
    "emoji.memorial": "🕯️ Memorial",
    "emoji.graduation": "🎓 Graduation",
    "emoji.work": "💼 Work / goal",
    "emoji.other": "⭐ Other",

    // Presets (holidays) dialog
    "presets.title": "Quick add — Holidays",
    "presets.hint": "Tap a holiday to add it to your list.",
    "presets.empty": "The holiday list isn't up to date right now. You can still add an event yourself.",

    // Delete confirmation
    "delete.title": "Delete event",
    "delete.confirm": "Delete \"{name}\"?",

    // Announcements (screen-reader live region)
    "message.saveFailed": "Couldn't save. Please try again.",
    "message.saved": "Event saved.",
    "message.deleted": "Event deleted.",
    "message.icsDownloaded": "Calendar file downloaded.",
    "message.linkCopied": "App link copied",
    "message.copyLinkPrompt": "Copy the app link:",

    // Count labels
    "time.today": "Today",
    "time.tomorrow": "Tomorrow",
    "time.yesterday": "Yesterday",
    "time.day": "day",
    "time.days": "days",
    "time.dayAgo": "day ago",
    "time.daysAgo": "days ago",

    // Buttons
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.delete": "Delete",
    "button.close": "Close",

    // Settings
    "settings.title": "Settings",
    "settings.notifications": "Notifications",
    "settings.shareApp": "Share the app",
    "settings.language": "Language",
    "settings.hebrew": "Hebrew",
    "settings.english": "English",
    "settings.whatsapp": "Contact us on WhatsApp",

    // Notifications
    "notif.unsupported": "This browser doesn't support notifications.",
    "notif.denied": "Allow notifications in your browser or device settings.",
    "notif.granted": "Notifications are on. Scheduled reminders also require installing the app.",
    "notif.grantedAnnounce": "Notifications allowed.",

    // Billing
    "billing.removeAds": "Remove ads — $1.99",
    "billing.removeAdsPrice": "Remove ads — {price}",
    "billing.adsRemoved": "Ads removed.",
    "billing.failed": "The purchase didn't go through. Please try again.",

    // Hebrew months (transliterated)
    "month.tishrei": "Tishrei",
    "month.cheshvan": "Cheshvan",
    "month.kislev": "Kislev",
    "month.tevet": "Tevet",
    "month.shevat": "Shevat",
    "month.adar": "Adar",
    "month.adarI": "Adar I",
    "month.adarII": "Adar II",
    "month.nisan": "Nisan",
    "month.iyar": "Iyar",
    "month.sivan": "Sivan",
    "month.tammuz": "Tammuz",
    "month.av": "Av",
    "month.elul": "Elul",

    // Holidays
    "holiday.roshHashanah": "Rosh Hashanah",
    "holiday.yomKippur": "Yom Kippur",
    "holiday.sukkot": "Sukkot",
    "holiday.simchatTorah": "Simchat Torah",
    "holiday.hanukkah": "Hanukkah",
    "holiday.tuBishvat": "Tu BiShvat",
    "holiday.purim": "Purim",
    "holiday.passover": "Passover",
    "holiday.yomHashoah": "Yom HaShoah (Holocaust Remembrance Day)",
    "holiday.yomHazikaron": "Yom HaZikaron (Memorial Day)",
    "holiday.yomHaatzmaut": "Yom Ha'atzmaut (Independence Day)",
    "holiday.lagBaomer": "Lag BaOmer",
    "holiday.shavuot": "Shavuot",
    "holiday.tishaBav": "Tisha B'Av",

    // Referral
    "referral.shareText": "Count down to the days that matter with Sofrim Yamim!",
  }
};

// Current language: a saved manual choice wins; otherwise follow the device.
// Hebrew phones (he / legacy iw) get Hebrew, English phones get English, and any
// other device language gets Hebrew inside Israel and English everywhere else.
function detectLanguage() {
  try {
    const tags = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
    for (const tag of tags) {
      const code = String(tag || '').toLowerCase().split(/[-_]/)[0];
      if (code === 'he' || code === 'iw') return 'he';
      if (code === 'en') return 'en';
    }
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Jerusalem') return 'he';
  } catch (e) {}
  return 'en';
}

function savedLanguage() {
  try {
    const v = localStorage.getItem('sofrim-lang');
    return v === 'he' || v === 'en' ? v : null;
  } catch (e) { return null; }
}

let currentLanguage = savedLanguage() || detectLanguage();

// Getter: t('key') or t('key', { name: 'x' }) for "{name}" placeholders.
function t(key, vars) {
  let s = i18nData[currentLanguage]?.[key] ?? i18nData['he']?.[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  return s;
}

// Date shown on cards/lists: Hebrew keeps its original he-IL long format,
// English uses en-US short style ("Sep 11, 2026").
function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  if (currentLanguage === 'en') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Translate every element marked with data-i18n* inside `root`.
function applyTranslations(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = t(el.dataset.i18n);
    if (el.textContent !== v) el.textContent = v;
  });
  const attrs = [['i18nPlaceholder', 'placeholder'], ['i18nAria', 'aria-label'], ['i18nTitle', 'title']];
  for (const [dataKey, attr] of attrs) {
    const sel = '[data-' + dataKey.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) + ']';
    scope.querySelectorAll(sel).forEach((el) => {
      el.setAttribute(attr, t(el.dataset[dataKey]));
    });
  }
  if (!root) {
    document.title = t('app.title');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('app.description'));
    const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (appleTitle) appleTitle.setAttribute('content', t('app.title'));
  }
}

// Setter function
function setLanguage(lang) {
  if (i18nData[lang]) {
    currentLanguage = lang;
    try { localStorage.setItem('sofrim-lang', lang); } catch (e) {}
    updatePageLanguage();
  }
}

// Get current language
function getLanguage() {
  return currentLanguage;
}

// Update page language (RTL/LTR + all strings), then let app.js and the
// other scripts re-render whatever they build in code.
function updatePageLanguage() {
  const isHebrew = currentLanguage === 'he';
  const html = document.documentElement;

  html.lang = isHebrew ? 'he' : 'en';
  html.dir = isHebrew ? 'rtl' : 'ltr';
  applyTranslations();

  document.dispatchEvent(new CustomEvent('sofrim:language-changed', {
    detail: { language: currentLanguage }
  }));
}

// Apply direction and lang before first paint (index.html ships he/rtl)
document.documentElement.lang = currentLanguage;
document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';
document.addEventListener('DOMContentLoaded', () => applyTranslations());

// Make functions available globally
window.t = t;
window.setLanguage = setLanguage;
window.getLanguage = getLanguage;
window.updatePageLanguage = updatePageLanguage;
window.applyTranslations = applyTranslations;
window.formatDisplayDate = formatDisplayDate;
