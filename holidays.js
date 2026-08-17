// Presets: Israeli & Jewish holidays / national days.
// Dates verified via hebcal.com for the 5787 Hebrew year (Aug 2026–Dec 2027).
// TODO: extend with future years or compute dynamically via a hebrew-calendar lib.
const HOLIDAY_PRESETS = [
  { name: "ראש השנה",        date: "2026-09-11", emoji: "🍎" },
  { name: "יום כיפור",        date: "2026-09-20", emoji: "🕊️" },
  { name: "סוכות",            date: "2026-09-25", emoji: "🌿" },
  { name: "שמחת תורה",        date: "2026-10-02", emoji: "📜" },
  { name: "חנוכה",            date: "2026-12-04", emoji: "🕎" },
  { name: "ט\"ו בשבט",        date: "2027-01-22", emoji: "🌳" },
  { name: "פורים",            date: "2027-03-22", emoji: "🎭" },
  { name: "פסח",              date: "2027-04-21", emoji: "🍷" },
  { name: "יום השואה",        date: "2027-05-03", emoji: "🕯️" },
  { name: "יום הזיכרון",      date: "2027-05-10", emoji: "🇮🇱" },
  { name: "יום העצמאות",      date: "2027-05-11", emoji: "🎆" },
  { name: "ל\"ג בעומר",       date: "2027-05-24", emoji: "🔥" },
  { name: "שבועות",           date: "2027-06-10", emoji: "🌾" },
  { name: "תשעה באב",         date: "2027-08-11", emoji: "🕯️" },
];
