const STORAGE_KEY = "sofrim-yamim.events.v1";

const listEl = document.getElementById("eventList");
const emptyEl = document.getElementById("emptyState");

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

function render() {
  // Upcoming events first (soonest first), past events after (most recent first).
  const events = loadEvents().sort((a, b) => {
    const da = daysUntil(a.date);
    const db = daysUntil(b.date);
    const rankA = da >= 0 ? da : 100000 - da;
    const rankB = db >= 0 ? db : 100000 - db;
    return rankA - rankB;
  });

  listEl.innerHTML = "";
  emptyEl.hidden = events.length > 0;

  for (const ev of events) {
    const diff = daysUntil(ev.date);
    const { num, label } = countLabel(diff);

    const card = document.createElement("article");
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
    card.addEventListener("click", () => openEditDialog(ev));
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
