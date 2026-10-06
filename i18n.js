// i18n.js — Translations for Sofrim Yamim (Hebrew + English)
// Usage: t('key') returns translated string for current language

const i18nData = {
  he: {
    // App strings
    "app.title": "סופרים ימים",
    "app.description": "ספירה לאחור לאירועים, חגים ומועדים",

    // Header
    "header.settings": "הגדרות",
    "header.holidays": "חגים ומועדים",
    "header.add": "הוספת אירוע",

    // Main
    "main.empty": "אין עדיין אירועים. הוסיפו את הראשון.",

    // Dialog - Add Event
    "dialog.newEvent": "אירוע חדש",
    "dialog.editEvent": "עריכת אירוע",
    "dialog.eventName": "שם האירוע",
    "dialog.eventNamePlaceholder": "לדוגמה: יום הולדת לאמא",
    "dialog.dateType": "סוג תאריך",
    "dialog.gregorian": "לועזי",
    "dialog.hebrew": "עברי",

    // Messages
    "message.saveFailed": "השמירה נכשלה. נסו שוב.",
    "message.unsaved": "יש שינויים שלא נשמרו.",
    "message.deleteConfirm": "האם בטוחים שברצונכם למחוק אירוע זה?",

    // Time units
    "time.today": "היום",
    "time.tomorrow": "מחר",
    "time.in2days": "בעוד יומיים",
    "time.yesterday": "אתמול",
    "time.days": "ימים",
    "time.day": "יום",
    "time.inAWeek": "בעוד שבוע",
    "time.inAMonth": "בעוד חודש",

    // Buttons
    "button.save": "שמור",
    "button.cancel": "ביטול",
    "button.delete": "מחוק",
    "button.edit": "עריכה",
    "button.ok": "אישור",
    "button.close": "סגור",

    // Settings
    "settings.language": "שפה",
    "settings.hebrew": "עברית",
    "settings.english": "English",
    "settings.about": "אודות",
    "settings.help": "עזרה",

    // Hebrew Months
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

    // Holidays
    "holiday.roshHashanah": "ראש השנה",
    "holiday.yomKippur": "יום הכיפורים",
    "holiday.sukkot": "סוכות",
    "holiday.simchatTorah": "שמחת תורה",
    "holiday.hanukkah": "חנוכה",
    "holiday.tuBShevat": "טו בשבט",
    "holiday.purim": "פורים",
    "holiday.passover": "פסח",
    "holiday.shavuot": "שבועות",
    "holiday.tishaBav": "תשעה באב",
  },
  en: {
    // App strings
    "app.title": "Sofrim Yamim",
    "app.description": "Countdown to events, holidays, and special dates",

    // Header
    "header.settings": "Settings",
    "header.holidays": "Holidays",
    "header.add": "Add Event",

    // Main
    "main.empty": "No events yet. Add the first one.",

    // Dialog - Add Event
    "dialog.newEvent": "New Event",
    "dialog.editEvent": "Edit Event",
    "dialog.eventName": "Event Name",
    "dialog.eventNamePlaceholder": "For example: Mom's Birthday",
    "dialog.dateType": "Date Type",
    "dialog.gregorian": "Gregorian",
    "dialog.hebrew": "Hebrew",

    // Messages
    "message.saveFailed": "Save failed. Please try again.",
    "message.unsaved": "You have unsaved changes.",
    "message.deleteConfirm": "Are you sure you want to delete this event?",

    // Time units
    "time.today": "Today",
    "time.tomorrow": "Tomorrow",
    "time.in2days": "In 2 days",
    "time.yesterday": "Yesterday",
    "time.days": "days",
    "time.day": "day",
    "time.inAWeek": "In a week",
    "time.inAMonth": "In a month",

    // Buttons
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.delete": "Delete",
    "button.edit": "Edit",
    "button.ok": "OK",
    "button.close": "Close",

    // Settings
    "settings.language": "Language",
    "settings.hebrew": "Hebrew",
    "settings.english": "English",
    "settings.about": "About",
    "settings.help": "Help",

    // Hebrew Months (English names)
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
    "holiday.tuBShevat": "Tu B'Shevat",
    "holiday.purim": "Purim",
    "holiday.passover": "Passover",
    "holiday.shavuot": "Shavuot",
    "holiday.tishaBav": "Tisha B'Av",
  }
};

// Current language (default: Hebrew)
let currentLanguage = localStorage.getItem('sofrim-lang') || 'he';

// Getter function
function t(key) {
  return i18nData[currentLanguage]?.[key] || i18nData['he']?.[key] || key;
}

// Setter function
function setLanguage(lang) {
  if (i18nData[lang]) {
    currentLanguage = lang;
    localStorage.setItem('sofrim-lang', lang);
    updatePageLanguage();
  }
}

// Get current language
function getLanguage() {
  return currentLanguage;
}

// Update page language (RTL/LTR + all strings)
function updatePageLanguage() {
  const isHebrew = currentLanguage === 'he';
  const html = document.documentElement;

  html.lang = isHebrew ? 'he' : 'en';
  html.dir = isHebrew ? 'rtl' : 'ltr';
  document.title = t('app.title');

  // Dispatch custom event so app.js knows to re-render
  document.dispatchEvent(new CustomEvent('sofrim:language-changed', {
    detail: { language: currentLanguage }
  }));
}

// Make functions available globally
window.t = t;
window.setLanguage = setLanguage;
window.getLanguage = getLanguage;
window.updatePageLanguage = updatePageLanguage;
