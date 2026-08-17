const STORAGE_KEY = "sofrim-yamim.events.v1";

const listEl = document.getElementById("eventList");
const emptyEl = document.getElementById("emptyState");
const heroEl = document.getElementById("heroCard");

const dialog = document.getElementById("eventDialog");
const form = document.getElementById("eventForm");
const dialogTitle = document.getElementById("dialogTitle");
const nameInput = document.getElementById("eventName");
const dateInput = document.getElementById("eventDate");
const emojiInput = document.getElementById("eventEmoji");
const deleteBtn = document.getElementById("deleteBtn");

const presetsDialog = document.getElementById("presetsDialog");
const presetsList = document.getElementById("presetsList");

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
  if (editingId) {
    const idx = events.findIndex((ev) => ev.id === editingId);
    if (idx !== -1) {
      events[idx] = { ...events[idx], name: nameInput.value.trim(), date: dateInput.value, emoji: emojiInput.value };
    }
  } else {
    events.push({
      id: crypto.randomUUID(),
      name: nameInput.value.trim(),
      date: dateInput.value,
      emoji: emojiInput.value,
    });
  }
  saveEvents(events);
  dialog.close();
  render();
});

deleteBtn.addEventListener("click", () => {
  if (!editingId) return;
  const events = loadEvents().filter((ev) => ev.id !== editingId);
  saveEvents(events);
  dialog.close();
  render();
});

// Presets (holidays) dialog
document.getElementById("presetsBtn").addEventListener("click", () => {
  presetsList.innerHTML = "";
  for (const h of HOLIDAY_PRESETS) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${h.emoji}</span><span class="p-name">${h.name}</span><span class="p-date">${formatHebrewDate(h.date)}</span>`;
    li.addEventListener("click", () => {
      const events = loadEvents();
      events.push({ id: crypto.randomUUID(), name: h.name, date: h.date, emoji: h.emoji });
      saveEvents(events);
      presetsDialog.close();
      render();
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
