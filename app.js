const STORAGE_KEY = "sofrim-yamim.events.v1";

const listEl = document.getElementById("eventList");
const emptyEl = document.getElementById("emptyState");
const heroEl = document.getElementById("heroCard");
const liveStatusEl = document.getElementById("liveStatus");

// Non-visual success confirmation: the bounce+confetti celebration is
// entirely visual and is itself skipped under prefers-reduced-motion, so
// this is the only save confirmation screen-reader/reduced-motion users
// get.
function announce(text) {
  // Clear first: some screen readers don't re-announce aria-live text
  // that's identical to what's already there (e.g. two saves in a row).
  // The delay also lets a just-issued focus-change announcement (from
  // celebrateNewEvent/focusEventRow, called right before this) finish
  // first, instead of the two competing.
  liveStatusEl.textContent = "";
  setTimeout(() => { liveStatusEl.textContent = text; }, 150);
}

// Story 1.5: focus restoration after render() rebuilds the list DOM.
function focusEventRow(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) el.focus();
}

const dialog = document.getElementById("eventDialog");
const form = document.getElementById("eventForm");
const dialogTitle = document.getElementById("dialogTitle");
const nameInput = document.getElementById("eventName");
const dateInput = document.getElementById("eventDate");
const emojiInput = document.getElementById("eventEmoji");
const deleteBtn = document.getElementById("deleteBtn");

const presetsDialog = document.getElementById("presetsDialog");
const presetsList = document.getElementById("presetsList");
const presetsEmptyEl = document.getElementById("presetsEmpty");

let editingId = null;

function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target - today) / 86400000);
}

function formatHebrewDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });
}

function countLabel(diff) {
  if (diff === 0) return { num: "היום", label: "🎉" };
  if (diff === 1) return { num: "מחר", label: "" };
  if (diff > 1) return { num: diff, label: "ימים" };
  if (diff === -1) return { num: "אתמול", label: "" };
  return { num: Math.abs(diff), label: "ימים עברו" };
}

// Speaks the exact same count text already shown on screen (countLabel's
// num/label), so screen-reader users hear what sighted users see -- rather
// than a separately-worded phrase that can drift out of sync. The bare
// celebratory emoji ("🎉") is dropped since screen readers mangle a
// standalone emoji with no text around it.
function ariaCountText(num, label) {
  if (!label || label === "🎉") return String(num);
  return `${num} ${label}`;
}

function renderHero(ev) {
  if (!ev) {
    heroEl.hidden = true;
    heroEl.innerHTML = "";
    heroEl.onclick = null;
    heroEl.onkeydown = null;
    heroEl.removeAttribute("aria-label");
    delete heroEl.dataset.id;
    return;
  }

  const diff = daysUntil(ev.date);
  const { num, label } = countLabel(diff);

  heroEl.hidden = false;
  heroEl.innerHTML = `
    <div class="hero-emoji">${ev.emoji}</div>
    <div class="hero-info">
      <div class="hero-name">${escapeHtml(ev.name)}</div>
      <div class="hero-date">${formatHebrewDate(ev.date)}</div>
    </div>
    <div class="hero-count">
      <span class="num">${num}</span>
      <span class="label">${label}</span>
    </div>
  `;
  heroEl.dataset.id = ev.id;
  heroEl.setAttribute("role", "button");
  heroEl.setAttribute("tabindex", "0");
  heroEl.setAttribute("aria-label", `אירוע קרוב ביותר: ${ev.name}, ${ariaCountText(num, label)}`);
  heroEl.onclick = () => openEditDialog(ev);
  heroEl.onkeydown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEditDialog(ev);
    }
  };
}

function render() {
  // Upcoming events first (soonest first), past events after (most recent first).
  const events = loadEvents().sort((a, b) => {
    const da = daysUntil(a.date);
    const db = daysUntil(b.date);
    const rankA = da >= 0 ? da : 100000 - da;
    const rankB = db >= 0 ? db : 100000 - db;
    return rankA - rankB;
  });

  emptyEl.hidden = events.length > 0;

  // Hero Card: only ever the single nearest *future* (or today) event.
  const heroEvent = events.length && daysUntil(events[0].date) >= 0 ? events[0] : null;
  const restEvents = heroEvent ? events.slice(1) : events;
  renderHero(heroEvent);

  listEl.innerHTML = "";

  for (const ev of restEvents) {
    const diff = daysUntil(ev.date);
    const { num, label } = countLabel(diff);

    const card = document.createElement("div");
    card.className = "event-card" + (diff < 0 ? " past" : "");
    card.dataset.id = ev.id;
    card.innerHTML = `
      <div class="event-emoji">${ev.emoji}</div>
      <div class="event-info">
        <div class="event-name">${escapeHtml(ev.name)}</div>
        <div class="event-date">${formatHebrewDate(ev.date)}</div>
      </div>
      <div class="event-count">
        <span class="num">${num}</span>
        <span class="label">${label}</span>
      </div>
    `;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    // Unlike the Hero Card's aria-label (fixed format, Story 1.2), rows
    // also speak the date: with several rows in a list, the relative day
    // count alone isn't enough to tell them apart by ear.
    card.setAttribute("aria-label", `${ev.name}, ${formatHebrewDate(ev.date)}, ${ariaCountText(num, label)}`);
    card.addEventListener("click", () => openEditDialog(ev));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEditDialog(ev);
      }
    });
    listEl.appendChild(card);
  }
}

// Story 1.4/1.5: bring a newly-saved event into view and focus it (always
// -- this is focus restoration after render() rebuilt the DOM, same as
// the edit/delete paths, not an animation), then play the bounce+confetti
// celebration on top -- that part alone is skipped under
// prefers-reduced-motion, per epic-1-context: the result must just show
// immediately with no special-cased fallback markup.
function celebrateNewEvent(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (!el) {
    console.warn("celebrateNewEvent: no card found for id", id);
    return;
  }

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sorted soonest-first, a new event with a far-future date can land
  // below the fold -- bring it into view and focus it so a keyboard user
  // doesn't lose their place, regardless of motion preference.
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  el.focus();

  if (reduceMotion) return;

  el.classList.add("just-saved");
  const clearBounce = () => el.classList.remove("just-saved");
  el.addEventListener("animationend", clearBounce, { once: true });
  setTimeout(clearBounce, 500); // fallback: guarantees cleanup even if animationend never fires

  spawnConfetti(el);
}

function spawnConfetti(anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  // text-primary (not a hardcoded #fff) so the third color stays visible
  // against the light-mode background too (Story 1.9).
  const colors = ["var(--accent-violet)", "var(--accent-pink)", "var(--text-primary)"];

  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 36 + Math.random() * 36;
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    document.body.appendChild(piece);
    const removePiece = () => piece.remove();
    piece.addEventListener("animationend", removePiece, { once: true });
    setTimeout(removePiece, 800); // fallback: guarantees cleanup even if animationend never fires
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function openAddDialog() {
  editingId = null;
  dialogTitle.textContent = "אירוע חדש";
  form.reset();
  emojiInput.value = "🎉";
  deleteBtn.hidden = true;
  dialog.showModal();
}

function openEditDialog(ev) {
  editingId = ev.id;
  dialogTitle.textContent = "עריכת אירוע";
  nameInput.value = ev.name;
  dateInput.value = ev.date;
  emojiInput.value = ev.emoji;
  deleteBtn.hidden = false;
  dialog.showModal();
}

document.getElementById("addBtn").addEventListener("click", openAddDialog);
document.getElementById("cancelBtn").addEventListener("click", () => dialog.close());

document.getElementById("saveBtn").addEventListener("click", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const events = loadEvents();
  let newEventId = null;
  const editedId = editingId;
  if (editingId) {
    const idx = events.findIndex((ev) => ev.id === editingId);
    if (idx !== -1) {
      events[idx] = { ...events[idx], name: nameInput.value.trim(), date: dateInput.value, emoji: emojiInput.value };
    }
  } else {
    newEventId = crypto.randomUUID();
    events.push({
      id: newEventId,
      name: nameInput.value.trim(),
      date: dateInput.value,
      emoji: emojiInput.value,
    });
  }
  saveEvents(events);
  dialog.close();
  render();
  if (newEventId) {
    celebrateNewEvent(newEventId);
  } else if (editedId) {
    // Story 1.5: render() rebuilt the whole list, dropping focus to
    // <body> -- a keyboard user who opened this row via Enter shouldn't
    // lose their place after saving an edit.
    focusEventRow(editedId);
  }
  announce("האירוע נשמר.");
});

deleteBtn.addEventListener("click", () => {
  if (!editingId) return;
  const events = loadEvents().filter((ev) => ev.id !== editingId);
  saveEvents(events);
  dialog.close();
  render();
  // The deleted row no longer exists to refocus -- land on a stable,
  // always-present anchor instead of dropping focus to <body>.
  document.getElementById("addBtn").focus();
  announce("האירוע נמחק.");
});

// Story 1.6 / FR-5: holidays.js needs manual yearly upkeep (see its own
// TODO comment). A holiday missing its `date`, or one nobody updated past
// its own date, must not break the list -- it's a silent gap in content,
// not a bug. "Valid" means present, a real parseable ISO date, and not
// already in the past (mirrors daysUntil()'s own >= 0 "current/upcoming"
// semantics used everywhere else in this file).
function isValidHolidayDate(dateStr) {
  const match = typeof dateStr === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const parsed = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(parsed.getTime())) return false;
  // JS's Date constructor silently *rolls over* out-of-range values
  // instead of rejecting them (e.g. "2026-02-30" quietly becomes March 2)
  // -- round-trip the parsed components back against the original string
  // so a typo renders as "missing" rather than as a wrong-but-plausible date.
  if (parsed.getFullYear() !== y || parsed.getMonth() + 1 !== m || parsed.getDate() !== d) return false;
  return daysUntil(dateStr) >= 0;
}

// Single accessor so any future feature reading HOLIDAY_PRESETS (search,
// a "today's holiday" banner, etc.) gets the same filtering for free
// instead of needing to remember to reapply isValidHolidayDate itself.
function getValidHolidayPresets() {
  const valid = HOLIDAY_PRESETS.filter((h) => isValidHolidayDate(h.date));
  const skipped = HOLIDAY_PRESETS.length - valid.length;
  if (skipped > 0) {
    console.warn(`holidays.js: ${skipped} holiday(s) skipped (missing/invalid/past date) -- may need a yearly update`);
  }
  return valid;
}

// Presets (holidays) dialog
document.getElementById("presetsBtn").addEventListener("click", () => {
  presetsList.innerHTML = "";
  const validPresets = getValidHolidayPresets();
  presetsEmptyEl.hidden = validPresets.length > 0;
  for (const h of validPresets) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${h.emoji}</span><span class="p-name">${h.name}</span><span class="p-date">${formatHebrewDate(h.date)}</span>`;
    // No role="button" here (unlike Hero/Compact Row, which are plain
    // divs with no prior semantics to lose): this is a real <li> in a
    // <ul>, and keeping the implicit listitem role lets a screen reader
    // announce position/count ("3 of 14") while still staying keyboard-
    // operable via tabindex + the keydown handler below.
    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-label", `${h.name}, ${formatHebrewDate(h.date)}`);
    const addPreset = () => {
      const events = loadEvents();
      const id = crypto.randomUUID();
      events.push({ id, name: h.name, date: h.date, emoji: h.emoji });
      saveEvents(events);
      presetsDialog.close();
      render();
      celebrateNewEvent(id);
      announce("האירוע נשמר.");
    };
    li.addEventListener("click", addPreset);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        addPreset();
      }
    });
    presetsList.appendChild(li);
  }
  presetsDialog.showModal();
});
document.getElementById("closePresetsBtn").addEventListener("click", () => presetsDialog.close());

render();

// PWA: register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
