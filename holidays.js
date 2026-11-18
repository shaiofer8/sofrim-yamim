// Presets: Israeli & Jewish holidays / national days.
// Dates verified via hebcal.com for the 5787 Hebrew year (Aug 2026–Dec 2027).
// TODO: extend with future years or compute dynamically via a hebrew-calendar lib.
// Contract (Story 1.6 / FR-5): an entry with a missing, malformed, or
// already-past `date` is silently skipped from the picker, not an error --
// see isValidHolidayDate()/getValidHolidayPresets() in app.js. Safe to
// leave this file stale for a while; entries just quietly stop appearing.
// `key` picks the display name from i18n.js (holiday.<key>); `name` is the
// Hebrew name and the fallback if a key is ever missing.
const HOLIDAY_PRESETS = [
  { key: "roshHashanah", name: "ראש השנה",        date: "2026-09-11", emoji: "🍎" },
  { key: "yomKippur", name: "יום כיפור",        date: "2026-09-20", emoji: "🕊️" },
  { key: "sukkot", name: "סוכות",            date: "2026-09-25", emoji: "🌿" },
  { key: "simchatTorah", name: "שמחת תורה",        date: "2026-10-02", emoji: "📜" },
  { key: "hanukkah", name: "חנוכה",            date: "2026-12-04", emoji: "🕎" },
  { key: "tuBishvat", name: "ט\"ו בשבט",        date: "2027-01-22", emoji: "🌳" },
  { key: "purim", name: "פורים",            date: "2027-03-22", emoji: "🎭" },
  { key: "passover", name: "פסח",              date: "2027-04-21", emoji: "🍷" },
  { key: "yomHashoah", name: "יום השואה",        date: "2027-05-03", emoji: "🕯️" },
  { key: "yomHazikaron", name: "יום הזיכרון",      date: "2027-05-10", emoji: "🇮🇱" },
  { key: "yomHaatzmaut", name: "יום העצמאות",      date: "2027-05-11", emoji: "🎆" },
  { key: "lagBaomer", name: "ל\"ג בעומר",       date: "2027-05-24", emoji: "🔥" },
  { key: "shavuot", name: "שבועות",           date: "2027-06-10", emoji: "🌾" },
  { key: "tishaBav", name: "תשעה באב",         date: "2027-08-11", emoji: "🕯️" },
];
