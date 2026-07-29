const STORAGE_KEY = "gym-tracker-v1";

const templates = [
  {
    id: "machine-a",
    name: "Machine Full Body A",
    focus: "Main machine workout",
    exercises: [
      exercise("seated-leg-press", "Seated Leg Press", "Machine-1", "3 x 10-12", [60, 75, 90], 12),
      exercise("machine-chest-press", "Machine Seated Parallel Grip Chest Press", "Machine-1", "3 x 8-12", [40, 55, 65], 12),
      exercise("supinated-row", "Machine Seated Supinated Grip Row", "Machine-1", "3 x 8-12", [30, 40, 45], 12),
      exercise("lat-pulldown", "Close Grip Strict Lat Pulldown", "Machine-1", "3 x 8-12", [50, 60, 70], 12),
      exercise("cable-crunch", "Cable Kneeling Crunch", "Machine-1", "3 x 10-12", [50, 50, 60], 12),
    ],
  },
  {
    id: "machine-b",
    name: "Machine Full Body B",
    focus: "Machine variation",
    exercises: [
      exercise("leg-extension", "Machine Seated Leg Extension", "Machine-2", "3 x 10-12", [40, 45, 55], 12),
      exercise("leg-curl", "Machine Seated Leg Curl", "Machine-2", "3 x 10-12", [45, 55, 60], 12),
      exercise("hammer-incline", "Hammer Strength Incline Press", "Machine-2", "3 x 8-12", [15, 25, 27.5], 12),
      exercise("hammer-high-row", "Hammer Strength High Row", "Machine-2", "3 x 8-12", [30, 35, 45], 12),
      exercise("machine-dip", "Machine Seated Dip", "Machine-2", "3 x 8-12", [20, 25, 30], 12),
      exercise("machine-bicep-curl", "Machine Bicep Curl", "Machine-1 / Machine-2", "3 x 10-12", [20, 25, 30], 12),
    ],
  },
  {
    id: "db-a",
    name: "Dumbbell Full Body A",
    focus: "Bench, row, arms",
    exercises: [
      exercise("db-squat", "Dumbbell Squat", "DB-1", "3 x 10", [10, 12.5, 15], 10),
      exercise("reverse-lunge", "Dumbbell Reverse Lunge", "DB-1", "3 x 8-10 each leg", [10, 12.5, 15], 10),
      exercise("db-bench", "Dumbbell Bench Press", "DB-1", "3 x 10-12", [10, 12.5, 15], 12),
      exercise("db-bent-row", "Dumbbell Bent Over Row", "DB-1", "3 x 10-12", [10, 12.5, 15], 12),
      exercise("db-shoulder-press", "Dumbbell Standing Shoulder Press", "DB-1", "3 x 8-10", [10, 12.5, 12.5], 10),
      exercise("hammer-curl", "Dumbbell Hammer Curl", "DB-1 / DB-2", "3 x 10-12", [10, 12.5, 15], 12),
      exercise("lying-tricep", "Dumbbell Lying Tricep Extension", "DB-1", "3 x 10-12", [10, 12.5, 15], 12),
    ],
  },
  {
    id: "db-b",
    name: "Dumbbell Full Body B",
    focus: "Goblet, incline, shoulders",
    exercises: [
      exercise("goblet-squat", "Kettlebell Goblet Squat", "DB-2", "3 x 10", [15, 15, 20], 10),
      exercise("forward-lunge", "Dumbbell Forward Lunge", "DB-2", "3 x 8-10 each leg", [15, 15, 15], 10),
      exercise("db-incline-press", "Dumbbell Incline Bench Press", "DB-2", "3 x 10", [12.5, 12.5, 12.5], 10),
      exercise("db-incline-row", "Dumbbell Incline Bench Row", "DB-2", "3 x 10", [12.5, 15, 15], 10),
      exercise("front-lateral-raise", "Dumbbell Front to Lateral Raise", "DB-2", "3 x 10", [7.5, 7.5], 10),
      exercise("db-bicep-curl", "Dumbbell Bicep Curl", "DB-2", "3 x 10-12", [10, 12.5], 12),
      exercise("overhead-tricep", "Dumbbell Seated Overhead Tricep Extension", "DB-2", "3 x 10-12", [10, 15, 15], 12),
    ],
  },
];

let state = loadState();
let activeSession = null;

const els = {
  templateGrid: document.querySelector("#templateGrid"),
  activeWorkoutPanel: document.querySelector("#activeWorkoutPanel"),
  activeWorkoutName: document.querySelector("#activeWorkoutName"),
  increaseModeTitle: document.querySelector("#increaseModeTitle"),
  increaseModeText: document.querySelector("#increaseModeText"),
  toggleIncrease: document.querySelector("#toggleIncrease"),
  exerciseList: document.querySelector("#exerciseList"),
  finishWorkout: document.querySelector("#finishWorkout"),
  cancelWorkout: document.querySelector("#cancelWorkout"),
  workoutNotes: document.querySelector("#workoutNotes"),
  todayTitle: document.querySelector("#todayTitle"),
  todaySubtext: document.querySelector("#todaySubtext"),
  weekCount: document.querySelector("#weekCount"),
  readyCount: document.querySelector("#readyCount"),
  totalSessions: document.querySelector("#totalSessions"),
  exerciseSelect: document.querySelector("#exerciseSelect"),
  chartArea: document.querySelector("#chartArea"),
  exerciseSummary: document.querySelector("#exerciseSummary"),
  historyList: document.querySelector("#historyList"),
  backupButton: document.querySelector("#backupButton"),
  backupDialog: document.querySelector("#backupDialog"),
  exportDownload: document.querySelector("#exportDownload"),
  saveToFolder: document.querySelector("#saveToFolder"),
  importFile: document.querySelector("#importFile"),
  backupStatus: document.querySelector("#backupStatus"),
  clearData: document.querySelector("#clearData"),
};

function exercise(id, name, source, target, defaults, topReps) {
  return {
    id,
    name,
    source,
    target,
    defaults,
    topReps,
    sets: 3,
  };
}

function loadState() {
  const fallback = { sessions: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && Array.isArray(saved.sessions) ? saved : fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  renderTemplates();
  renderDashboard();
  renderProgressOptions();
  renderChart();
  renderHistory();
}

function renderTemplates() {
  els.templateGrid.innerHTML = templates
    .map(
      (template) => `
      <button class="template-card" type="button" data-template-id="${template.id}">
        <strong>${template.name}</strong>
        <span>${template.focus}</span><br />
        <span>${template.exercises.length} exercises</span>
      </button>
    `,
    )
    .join("");
}

function renderDashboard() {
  const weekStart = startOfWeek(new Date());
  const weekSessions = state.sessions.filter((session) => new Date(session.date) >= weekStart);
  const ready = getAllExercises().filter((item) => getSuggestion(item).status === "increase");
  const last = state.sessions[0];

  els.weekCount.textContent = weekSessions.length;
  els.readyCount.textContent = ready.length;
  els.totalSessions.textContent = state.sessions.length;

  if (activeSession) {
    els.todayTitle.textContent = activeSession.templateName;
    els.todaySubtext.textContent = "Log each set as you complete it.";
  } else if (last) {
    els.todayTitle.textContent = "Next session";
    els.todaySubtext.textContent = `Last workout: ${last.templateName} on ${formatDate(last.date)}.`;
  } else {
    els.todayTitle.textContent = "Choose a workout";
    els.todaySubtext.textContent = "Pick one of your four full-body templates.";
  }
}

function startWorkout(templateId) {
  const template = templates.find((item) => item.id === templateId);
  activeSession = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    templateId: template.id,
    templateName: template.name,
    useSuggestedIncreases: false,
    notes: "",
    exercises: template.exercises.map((item) => buildActiveExercise(item, false)),
  };

  els.activeWorkoutName.textContent = template.name;
  els.activeWorkoutPanel.classList.remove("hidden");
  renderIncreaseControl();
  renderActiveWorkout();
  renderDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildActiveExercise(item, useSuggestedIncreases) {
  const last = getLastExerciseEntry(item.id);
  const suggestion = getSuggestion(item);
  const shouldIncrease = useSuggestedIncreases && suggestion.status === "increase";
  const weights = shouldIncrease
    ? suggestion.nextWeights
    : last?.sets.map((set) => set.weight) || item.defaults;

  return {
    exerciseId: item.id,
    name: item.name,
    source: item.source,
    target: item.target,
    topReps: item.topReps,
    sets: Array.from({ length: item.sets }, (_, index) => {
      const hasWeight = weights[index] !== undefined && weights[index] !== "";
      return {
        weight: hasWeight ? weights[index] : "",
        reps: hasWeight ? item.topReps : "",
        done: false,
      };
    }),
  };
}

function setIncreaseMode(useSuggestedIncreases) {
  if (!activeSession) return;
  const template = templates.find((item) => item.id === activeSession.templateId);
  activeSession.useSuggestedIncreases = useSuggestedIncreases;
  activeSession.exercises = template.exercises.map((item) => buildActiveExercise(item, useSuggestedIncreases));
  renderIncreaseControl();
  renderActiveWorkout();
}

function renderIncreaseControl() {
  if (!activeSession) return;
  const count = activeSession.exercises.filter((item) => getSuggestionById(item.exerciseId).status === "increase").length;
  const control = document.querySelector(".increase-control");
  control.classList.toggle("active", activeSession.useSuggestedIncreases);

  if (activeSession.useSuggestedIncreases) {
    els.increaseModeTitle.textContent = "Using suggested increases";
    els.increaseModeText.textContent = `${count} exercise${count === 1 ? "" : "s"} will use higher suggested weights this workout.`;
    els.toggleIncrease.textContent = "Keep Same";
    return;
  }

  els.increaseModeTitle.textContent = "Keep same weights";
  els.increaseModeText.textContent = count
    ? `${count} exercise${count === 1 ? "" : "s"} are ready to increase when you choose.`
    : "No exercises are ready for a weight increase yet.";
  els.toggleIncrease.textContent = "Use Increases";
}

function renderActiveWorkout() {
  if (!activeSession) return;
  els.exerciseList.innerHTML = activeSession.exercises
    .map((item, exerciseIndex) => {
      const suggestion = getSuggestionById(item.exerciseId);
      return `
        <article class="exercise-card">
          <div class="exercise-top">
            <div>
              <h3>${item.name}</h3>
              <p class="source">(${item.source}) · ${item.target}</p>
            </div>
          </div>
          <div class="suggestion">${suggestion.label}</div>
          <div class="set-grid">
            ${item.sets
              .map(
                (set, setIndex) => `
              <div class="set-row">
                <strong>Set ${setIndex + 1}</strong>
                <div>
                  <label for="w-${exerciseIndex}-${setIndex}">lbs</label>
                  <input id="w-${exerciseIndex}-${setIndex}" inputmode="decimal" type="number" step="0.5"
                    value="${set.weight}" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" data-field="weight" />
                </div>
                <div>
                  <label for="r-${exerciseIndex}-${setIndex}">reps</label>
                  <input id="r-${exerciseIndex}-${setIndex}" inputmode="numeric" type="number" step="1"
                    value="${set.reps}" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" data-field="reps" />
                </div>
                <label class="done-toggle">
                  Done
                  <input aria-label="Set ${setIndex + 1} complete" type="checkbox"
                    ${set.done ? "checked" : ""}
                    data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" data-field="done" />
                </label>
              </div>
            `,
              )
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function finishWorkout() {
  if (!activeSession) return;
  activeSession.notes = els.workoutNotes.value.trim();
  state.sessions.unshift(activeSession);
  saveState();
  activeSession = null;
  els.workoutNotes.value = "";
  els.activeWorkoutPanel.classList.add("hidden");
  render();
}

function getAllExercises() {
  const map = new Map();
  templates.forEach((template) => {
    template.exercises.forEach((item) => map.set(item.id, item));
  });
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function getLastExerciseEntry(exerciseId) {
  for (const session of state.sessions) {
    const entry = session.exercises.find((item) => item.exerciseId === exerciseId);
    if (entry) return entry;
  }
  return null;
}

function getExerciseHistory(exerciseId) {
  return state.sessions
    .flatMap((session) =>
      session.exercises
        .filter((item) => item.exerciseId === exerciseId)
        .map((item) => ({ ...item, date: session.date, templateName: session.templateName })),
    )
    .reverse();
}

function getSuggestion(templateExercise) {
  return getSuggestionById(templateExercise.id, templateExercise);
}

function getSuggestionById(exerciseId, templateExercise = null) {
  const templateItem = templateExercise || getAllExercises().find((item) => item.id === exerciseId);
  const last = getLastExerciseEntry(exerciseId);
  if (!last) {
    return {
      status: "start",
      label: `Start with ${templateItem.defaults.join(" / ")} lbs.`,
      nextWeights: templateItem.defaults,
    };
  }

  const completed = last.sets.filter((set) => set.done !== false);
  const allTop = completed.length === last.sets.length && completed.every((set) => Number(set.reps) >= last.topReps);
  const missedHard = completed.some((set) => Number(set.reps) <= Math.max(5, last.topReps - 4));
  const weights = last.sets.map((set) => Number(set.weight) || 0);

  if (allTop) {
    const increment = isDumbbellExercise(last.name) ? 2.5 : 5;
    return {
      status: "increase",
      label: `Ready: you can increase by ${increment} lbs when you choose.`,
      nextWeights: weights.map((weight) => weight + increment),
    };
  }

  if (missedHard) {
    return {
      status: "reduce",
      label: "Next time: keep or reduce slightly. Prioritize clean reps.",
      nextWeights: weights,
    };
  }

  return {
    status: "hold",
    label: "Next time: keep the same weight and complete the target reps.",
    nextWeights: weights,
  };
}

function isDumbbellExercise(name) {
  return /dumbbell|kettlebell/i.test(name);
}

function renderProgressOptions() {
  const current = els.exerciseSelect.value;
  els.exerciseSelect.innerHTML = getAllExercises()
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  if (current) els.exerciseSelect.value = current;
}

function renderChart() {
  const exerciseId = els.exerciseSelect.value || getAllExercises()[0]?.id;
  if (!exerciseId) return;
  const history = getExerciseHistory(exerciseId);
  const bestWeights = history.map((entry) => Math.max(...entry.sets.map((set) => Number(set.weight) || 0)));
  const volumes = history.map((entry) =>
    entry.sets.reduce((sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0),
  );

  if (!history.length) {
    els.chartArea.innerHTML = `<div class="chart-empty">No logged sets yet for this exercise.</div>`;
    els.exerciseSummary.innerHTML = "";
    return;
  }

  els.chartArea.innerHTML = makeLineChart(bestWeights, history.map((item) => formatShortDate(item.date)));

  const bestWeight = Math.max(...bestWeights);
  const bestVolume = Math.max(...volumes);
  const latest = history.at(-1);
  els.exerciseSummary.innerHTML = `
    <div class="summary-card"><strong>${bestWeight}</strong><span>best weight</span></div>
    <div class="summary-card"><strong>${Math.round(bestVolume)}</strong><span>best volume</span></div>
    <div class="summary-card"><strong>${formatShortDate(latest.date)}</strong><span>last logged</span></div>
  `;
}

function makeLineChart(values, labels) {
  const width = 640;
  const height = 260;
  const pad = 34;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : pad + (index * (width - pad * 2)) / (values.length - 1);
    const y = height - pad - ((value - min) * (height - pad * 2)) / range;
    return [x, y];
  });
  const path = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const lastLabel = labels.at(-1);

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Exercise progress chart">
      <rect width="${width}" height="${height}" fill="#ffffff"></rect>
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="#dde3ea"></line>
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="#dde3ea"></line>
      <path d="${path}" fill="none" stroke="#1456d9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
      ${points
        .map(
          ([x, y], index) => `
          <circle cx="${x}" cy="${y}" r="5" fill="#1456d9"></circle>
          <text x="${x}" y="${y - 12}" text-anchor="middle" font-size="13" fill="#15191f">${values[index]}</text>
        `,
        )
        .join("")}
      <text x="${pad}" y="22" font-size="13" fill="#637083">Best weight per session</text>
      <text x="${width - pad}" y="${height - 10}" text-anchor="end" font-size="13" fill="#637083">${lastLabel}</text>
    </svg>
  `;
}

function renderHistory() {
  if (!state.sessions.length) {
    els.historyList.innerHTML = `<p class="muted">No workouts logged yet.</p>`;
    return;
  }

  els.historyList.innerHTML = state.sessions
    .map((session) => {
      const completed = session.exercises.reduce(
        (sum, item) => sum + item.sets.filter((set) => set.done !== false).length,
        0,
      );
      const total = session.exercises.reduce((sum, item) => sum + item.sets.length, 0);
      return `
        <article class="history-item">
          <div class="history-top">
            <strong>${session.templateName}</strong>
            <span>${formatDate(session.date)}</span>
          </div>
          <p class="history-meta">${completed}/${total} sets logged · ${session.exercises.length} exercises</p>
          ${session.notes ? `<p class="history-meta">${escapeHtml(session.notes)}</p>` : ""}
        </article>
      `;
    })
    .join("");
}

function exportPayload() {
  return {
    app: "gym-tracker",
    version: 1,
    exportedAt: new Date().toISOString(),
    state,
  };
}

function downloadBackup() {
  const blob = new Blob([JSON.stringify(exportPayload(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gym-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  setBackupStatus("Backup downloaded.");
}

async function saveBackupToFolder() {
  if (!window.showDirectoryPicker) {
    setBackupStatus("Folder save is not supported in this browser. Use Export Backup.");
    return;
  }

  try {
    const directory = await window.showDirectoryPicker();
    const fileHandle = await directory.getFileHandle(
      `gym-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`,
      { create: true },
    );
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(exportPayload(), null, 2));
    await writable.close();
    setBackupStatus("Backup saved to selected folder.");
  } catch (error) {
    if (error.name !== "AbortError") setBackupStatus("Folder save failed. Use Export Backup.");
  }
}

async function importBackup(file) {
  if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    const importedState = payload.state || payload;
    if (!importedState || !Array.isArray(importedState.sessions)) {
      throw new Error("Invalid backup");
    }
    state = importedState;
    saveState();
    render();
    setBackupStatus("Backup imported.");
  } catch {
    setBackupStatus("Import failed. Select a valid Gym Tracker JSON backup.");
  } finally {
    els.importFile.value = "";
  }
}

function setBackupStatus(message) {
  els.backupStatus.textContent = message;
}

function startOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", (event) => {
  const templateButton = event.target.closest("[data-template-id]");
  if (templateButton) startWorkout(templateButton.dataset.templateId);
});

document.addEventListener("input", (event) => {
  if (!activeSession || !event.target.matches("[data-field]")) return;
  const { exerciseIndex, setIndex, field } = event.target.dataset;
  const set = activeSession.exercises[exerciseIndex].sets[setIndex];
  set[field] = field === "done" ? event.target.checked : Number(event.target.value);
});

els.finishWorkout.addEventListener("click", finishWorkout);
els.toggleIncrease.addEventListener("click", () => {
  setIncreaseMode(!activeSession.useSuggestedIncreases);
});

els.cancelWorkout.addEventListener("click", () => {
  activeSession = null;
  els.workoutNotes.value = "";
  els.activeWorkoutPanel.classList.add("hidden");
  renderDashboard();
});

els.exerciseSelect.addEventListener("change", renderChart);

els.backupButton.addEventListener("click", () => {
  setBackupStatus("");
  els.backupDialog.showModal();
});

els.exportDownload.addEventListener("click", downloadBackup);
els.saveToFolder.addEventListener("click", saveBackupToFolder);
els.importFile.addEventListener("change", (event) => importBackup(event.target.files[0]));

els.clearData.addEventListener("click", () => {
  const confirmed = confirm("Clear all saved workouts from this browser?");
  if (!confirmed) return;
  state = { sessions: [] };
  saveState();
  render();
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".view").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelector(`#${button.dataset.view}`).classList.add("active");
  });
});

render();
