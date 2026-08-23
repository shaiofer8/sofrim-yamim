// hebrew-date.js -- 2026-08-23: Hebrew<->Gregorian date conversion for the
// event dialog's Hebrew date picker, self-contained (no external library,
// no network fetch -- consistent with this app's offline-first promise).
//
// Design: the JS engine's own Intl.DateTimeFormat with calendar:'hebrew'
// gives Gregorian->Hebrew for free (full ICU Hebrew-calendar data ships
// inside Chrome, incl. the Android/TWA build this app runs as). There is
// no built-in reverse direction, so it's derived here by *scanning* with
// that same primitive rather than reimplementing Hebrew calendar
// arithmetic by hand -- this guarantees the two directions can never
// drift out of sync with each other (a hand-written algorithm could
// disagree with ICU on an edge case; a scan built entirely from ICU's own
// answers cannot). A Hebrew year is at most 385 days, so the scan is
// bounded and fast (a few hundred Intl calls, well under a millisecond
// each) -- only run when a user actually opens the Hebrew year select in
// app.js, not on every keystroke, and cached per year after that.

const HE_CAL_FORMATTER = new Intl.DateTimeFormat("he-u-ca-hebrew", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// ISO-string builder matching this app's existing convention exactly
// (app.js/holidays.js always parse/compare "YYYY-MM-DD" via
// `new Date(str + "T00:00:00")`, i.e. LOCAL midnight) -- never
// toISOString(), which is UTC-based and would silently shift by a day
// around the Asia/Jerusalem offset (verified against this exact bug while
// building this file).
function toIsoLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Gregorian Date -> {year, month, day} in the Hebrew calendar. `month` is
// the actual Hebrew text ("תשרי", "אדר א׳", "אדר ב׳", ...) straight from
// ICU, not a hand-typed table -- guaranteed to match whatever spelling
// this same engine uses anywhere else it renders a Hebrew month name.
function gregorianToHebrewYMD(date) {
  const parts = HE_CAL_FORMATTER.formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;
  return {
    year: Number(get("year")),
    month: get("month"),
    day: Number(get("day")),
  };
}

const yearTableCache = new Map();

// Finds 1 Tishrei of `hebrewYear` (its first Gregorian day), then walks
// forward one Gregorian day at a time recording every (month, day) it
// passes until the Hebrew year rolls to `hebrewYear + 1` -- building a
// complete, guaranteed-self-consistent map from every valid Hebrew date in
// that year straight to its Gregorian equivalent, correctly handling both
// leap years (13 months, אדר א׳/אדר ב׳) and regular years (12 months, one
// אדר) since it never assumes a fixed month count/order -- it only
// records whatever ICU actually reports.
function buildHebrewYearTable(hebrewYear) {
  if (yearTableCache.has(hebrewYear)) return yearTableCache.get(hebrewYear);

  // 1 Tishrei of Hebrew year Y falls in Gregorian year (Y - 3761), between
  // roughly early September and early October -- start the search a
  // comfortable month before the earliest that can ever happen.
  const cursor = new Date(hebrewYear - 3761, 7, 15); // Aug 15
  while (gregorianToHebrewYMD(cursor).year < hebrewYear) {
    cursor.setDate(cursor.getDate() + 1);
  }
  // cursor is now the first Gregorian day whose Hebrew year is
  // hebrewYear -- since Hebrew days/years only ever increase together as
  // Gregorian days do, this is exactly 1 Tishrei, with no risk of having
  // skipped past it.

  const months = []; // [{ name, days, firstIso }], in real calendar order
  let currentMonth = null;
  const byMonthDay = new Map(); // "month|day" -> iso

  for (;;) {
    const ymd = gregorianToHebrewYMD(cursor);
    if (ymd.year !== hebrewYear) break; // rolled to the next Hebrew year -- done
    const iso = toIsoLocal(cursor);
    byMonthDay.set(`${ymd.month}|${ymd.day}`, iso);
    if (!currentMonth || currentMonth.name !== ymd.month) {
      currentMonth = { name: ymd.month, days: 0, firstIso: iso };
      months.push(currentMonth);
    }
    currentMonth.days += 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  const table = { months, byMonthDay };
  yearTableCache.set(hebrewYear, table);
  return table;
}

// Direct lookup -- buildHebrewYearTable() already computed the exact
// Gregorian date for every valid (month, day) in the year while scanning,
// so this never needs a search of its own.
function hebrewToGregorianISO(hebrewYear, monthName, day) {
  const table = buildHebrewYearTable(hebrewYear);
  return table.byMonthDay.get(`${monthName}|${day}`) || null;
}

// Standard Hebrew numeral (gematria) formatting for display only (day-of-
// month, and the last 3 digits of the year -- e.g. 5786 is shown the way
// every Israeli calendar shows it, as "תשפ״ו", the millennium digit
// omitted) -- storage/lookup above always uses plain numbers, never this.
// Applies the universal ט״ו/ט״ז substitution for any ...15/...16 (avoids
// spelling the Tetragrammaton's first two letters, י-ה / י-ו -- every
// Hebrew calendar, siddur, and calendar app follows this convention).
function toHebrewNumeral(num) {
  if (!Number.isInteger(num) || num <= 0 || num >= 1000) return String(num);
  const HUNDREDS = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];
  const TENS = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const ONES = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];

  const hundreds = Math.floor(num / 100);
  const tensOnes = num % 100;
  const low = tensOnes === 15 ? "טו" : tensOnes === 16 ? "טז" : TENS[Math.floor(tensOnes / 10)] + ONES[tensOnes % 10];
  const letters = HUNDREDS[hundreds] + low;

  if (!letters) return "";
  if (letters.length === 1) return letters + "׳"; // geresh -- single letter
  return letters.slice(0, -1) + "״" + letters.slice(-1); // gershayim before the last letter
}

window.HebrewDate = {
  gregorianToHebrewYMD,
  buildHebrewYearTable,
  hebrewToGregorianISO,
  toHebrewNumeral,
};
