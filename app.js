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
      exercise("machine-shoulder-press", "Machine Shoulder Press", "Machine-1", "3 x 10", ["", "", ""], 10, {
        keepRepsWhenWeightBlank: true,
      }),
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

const cardioTemplates = [
  cardio("running", "Running", "Cardio", "Track level and minutes"),
  cardio("elliptical", "Elliptical", "Cardio", "Track level and minutes"),
  cardio("stair-climbing", "Stair climbing", "Cardio", "Track level and minutes"),
];

let state = loadState();
let activeSession = null;

const els = {
  templateGrid: document.querySelector("#templateGrid"),
  activeWorkoutPanel: document.querySelector("#activeWorkoutPanel"),
  activeWorkoutName: document.querySelector("#activeWorkoutName"),
  exerciseList: document.querySelector("#exerciseList"),
  finishWorkout: document.querySelector("#finishWorkout"),
  cancelWorkout: document.querySelector("#cancelWorkout"),
  workoutDate: document.querySelector("#workoutDate"),
  workoutNotes: document.querySelector("#workoutNotes"),
  todayDate: document.querySelector("#todayDate"),
  todayTitle: document.querySelector("#todayTitle"),
  todaySubtext: document.querySelector("#todaySubtext"),
  weekCount: document.querySelector("#weekCount"),
  readyCount: document.querySelector("#readyCount"),
  totalSessions: document.querySelector("#totalSessions"),
  progressModeButtons: document.querySelectorAll("[data-progress-mode]"),
  exerciseProgressPanel: document.querySelector("#exerciseProgressPanel"),
  workoutProgressPanel: document.querySelector("#workoutProgressPanel"),
  exerciseSelect: document.querySelector("#exerciseSelect"),
  workoutSelect: document.querySelector("#workoutSelect"),
  chartArea: document.querySelector("#chartArea"),
  exerciseSummary: document.querySelector("#exerciseSummary"),
  workoutChartArea: document.querySelector("#workoutChartArea"),
  workoutSummary: document.querySelector("#workoutSummary"),
  workoutMovementList: document.querySelector("#workoutMovementList"),
  historyList: document.querySelector("#historyList"),
  backupButton: document.querySelector("#backupButton"),
  backupDialog: document.querySelector("#backupDialog"),
  exportDownload: document.querySelector("#exportDownload"),
  saveToFolder: document.querySelector("#saveToFolder"),
  importFile: document.querySelector("#importFile"),
  backupStatus: document.querySelector("#backupStatus"),
  clearData: document.querySelector("#clearData"),
};

function exercise(id, name, source, target, defaults, topReps, options = {}) {
  return {
    id,
    name,
    source,
    target,
    defaults,
    topReps,
    sets: 3,
    keepRepsWhenWeightBlank: options.keepRepsWhenWeightBlank || false,
  };
}

function cardio(id, name, source, focus) {
  return {
    id,
    name,
    source,
    focus,
    type: "cardio",
  };
}

function loadState() {
  const fallback = { sessions: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved.sessions)) return fallback;
    saved.sessions = sortSessionList(saved.sessions);
    return saved;
  } catch {
    return fallback;
  }
}

function saveState() {
  sortSessions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  renderTemplates();
  renderDashboard();
  renderProgressOptions();
  renderWorkoutOptions();
  renderChart();
  renderWorkoutProgress();
  renderHistory();
}

function renderTemplates() {
  const allTemplates = [...templates, ...cardioTemplates];
  els.templateGrid.innerHTML = allTemplates
    .map(
      (template) => `
      <button class="template-card" type="button" data-template-id="${template.id}">
        <strong>${template.name}</strong>
        <span>${template.focus}</span><br />
        <span>${template.type === "cardio" ? "Cardio workout" : `${template.exercises.length} exercises`}</span>
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

  els.todayDate.textContent = formatFullDate(new Date());
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
  const template = [...templates, ...cardioTemplates].find((item) => item.id === templateId);
  if (template.type === "cardio") {
    startCardioWorkout(template);
    return;
  }

  activeSession = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: "strength",
    templateId: template.id,
    templateName: template.name,
    increasedExerciseIds: [],
    notes: "",
    exercises: template.exercises.map((item) => buildActiveExercise(item, false)),
  };

  els.activeWorkoutName.textContent = template.name;
  els.workoutDate.value = toDateInputValue(activeSession.date);
  els.activeWorkoutPanel.classList.remove("hidden");
  renderActiveWorkout();
  renderDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startCardioWorkout(template) {
  const last = getLastCardioEntry(template.id);
  activeSession = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: "cardio",
    templateId: template.id,
    templateName: template.name,
    cardio: {
      level: last?.level ?? "",
      minutes: last?.minutes ?? "",
    },
    notes: "",
    exercises: [],
  };

  els.activeWorkoutName.textContent = template.name;
  els.workoutDate.value = toDateInputValue(activeSession.date);
  els.activeWorkoutPanel.classList.remove("hidden");
  renderCardioWorkout();
  renderDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCardioWorkout() {
  if (!activeSession) return;
  els.exerciseList.innerHTML = `
    <article class="exercise-card">
      <div class="exercise-top">
        <div>
          <h3>${activeSession.templateName}</h3>
          <p class="source">(Cardio) · Level and minutes</p>
        </div>
      </div>
      <div class="cardio-form">
        <div class="cardio-grid">
          <div class="cardio-field">
            <label for="cardioLevel">Level</label>
            <input id="cardioLevel" inputmode="decimal" type="number" step="0.5" min="0"
              value="${activeSession.cardio.level}" data-cardio-field="level" />
          </div>
          <div class="cardio-field">
            <label for="cardioMinutes">Minutes</label>
            <input id="cardioMinutes" inputmode="numeric" type="number" step="1" min="0"
              value="${activeSession.cardio.minutes}" data-cardio-field="minutes" />
          </div>
        </div>
      </div>
    </article>
  `;
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
        reps: hasWeight || item.keepRepsWhenWeightBlank ? item.topReps : "",
        done: false,
      };
    }),
  };
}

function toggleExerciseIncrease(exerciseId) {
  if (!activeSession) return;
  const template = templates.find((item) => item.id === activeSession.templateId);
  const templateExercise = template.exercises.find((item) => item.id === exerciseId);
  const currentIndex = activeSession.increasedExerciseIds.indexOf(exerciseId);
  const shouldIncrease = currentIndex === -1;

  if (shouldIncrease) {
    activeSession.increasedExerciseIds.push(exerciseId);
  } else {
    activeSession.increasedExerciseIds.splice(currentIndex, 1);
  }

  const exerciseIndex = activeSession.exercises.findIndex((item) => item.exerciseId === exerciseId);
  activeSession.exercises[exerciseIndex] = buildActiveExercise(templateExercise, shouldIncrease);
  renderActiveWorkout();
}

function renderActiveWorkout() {
  if (!activeSession) return;
  els.exerciseList.innerHTML = activeSession.exercises
    .map((item, exerciseIndex) => {
      const suggestion = getSuggestionById(item.exerciseId);
      const isIncreased = activeSession.increasedExerciseIds.includes(item.exerciseId);
      const canIncrease = suggestion.status === "increase";
      return `
        <article class="exercise-card ${isIncreased ? "increase-active" : ""}">
          <div class="exercise-top">
            <div>
              <h3>${item.name}</h3>
              <p class="source">(${item.source}) · ${item.target}</p>
            </div>
            <div class="exercise-actions">
              ${
                canIncrease
                  ? `<button class="${isIncreased ? "primary" : "secondary"} small increase-button" type="button" data-increase-exercise-id="${item.exerciseId}">
                      ${isIncreased ? "Keep Same" : "Use Increase"}
                    </button>`
                  : `<button class="secondary small increase-button" type="button" disabled>No Increase Yet</button>`
              }
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
  activeSession.date = getSessionDateFromInput(els.workoutDate.value, activeSession.date);
  activeSession.notes = els.workoutNotes.value.trim();
  state.sessions.unshift(activeSession);
  saveState();
  activeSession = null;
  els.workoutDate.value = "";
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
    if (!Array.isArray(session.exercises)) continue;
    const entry = session.exercises.find((item) => item.exerciseId === exerciseId);
    if (entry) return entry;
  }
  return null;
}

function getLastCardioEntry(templateId) {
  for (const session of state.sessions) {
    if (session.type === "cardio" && session.templateId === templateId && session.cardio) {
      return session.cardio;
    }
  }
  return null;
}

function getExerciseHistory(exerciseId) {
  return state.sessions
    .flatMap((session) =>
      (session.exercises || [])
        .filter((item) => item.exerciseId === exerciseId)
        .map((item) => ({ ...item, date: session.date, templateName: session.templateName })),
    )
    .reverse();
}

function getWorkoutHistory(templateId) {
  return state.sessions.filter((session) => session.templateId === templateId).reverse();
}

function getExerciseHistoryForWorkout(templateId, exerciseId) {
  return getWorkoutHistory(templateId)
    .flatMap((session) =>
      (session.exercises || [])
        .filter((item) => item.exerciseId === exerciseId)
        .map((item) => ({ ...item, date: session.date, templateName: session.templateName })),
    );
}

function getAllWorkoutTemplates() {
  return [...templates, ...cardioTemplates];
}

function getSessionVolume(session) {
  return (session.exercises || []).reduce(
    (sum, exerciseEntry) =>
      sum +
      exerciseEntry.sets
        .filter((set) => set.done !== false)
        .reduce((setSum, set) => setSum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0),
    0,
  );
}

function getSessionLastWeights(session) {
  return (session.exercises || []).map((entry) => ({
    exerciseId: entry.exerciseId,
    name: entry.name,
    weight: getLastSetWeight(entry),
  }));
}

function getCompletedSetCount(session) {
  return (session.exercises || []).reduce(
    (sum, exerciseEntry) => sum + exerciseEntry.sets.filter((set) => set.done !== false).length,
    0,
  );
}

function getBestWeight(entry) {
  return Math.max(...entry.sets.map((set) => Number(set.weight) || 0));
}

function getLastSetWeight(entry) {
  const weightedSets = entry.sets.filter((set) => set.weight !== "" && set.weight !== undefined && set.weight !== null);
  return weightedSets.length ? Number(weightedSets.at(-1).weight) || 0 : 0;
}

function getEntryVolume(entry) {
  return entry.sets
    .filter((set) => set.done !== false)
    .reduce((sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0);
}

function getSuggestion(templateExercise) {
  return getSuggestionById(templateExercise.id, templateExercise);
}

function getSuggestionById(exerciseId, templateExercise = null) {
  const templateItem = templateExercise || getAllExercises().find((item) => item.id === exerciseId);
  const history = getExerciseHistory(exerciseId);
  const last = history.at(-1);
  if (!last) {
    return {
      status: "start",
      label: getStartLabel(templateItem),
      nextWeights: templateItem.defaults,
    };
  }

  const completed = last.sets.filter((set) => set.done !== false);
  const allTop = completed.length === last.sets.length && completed.every((set) => Number(set.reps) >= last.topReps);
  const missedHard = completed.some((set) => Number(set.reps) <= Math.max(5, last.topReps - 4));
  const weights = last.sets.map((set) => Number(set.weight) || 0);
  const previous = history.at(-2);

  if (allTop && previous && hasSameCompletedWeightsAtTop(last, previous)) {
    const increment = isDumbbellExercise(last.name) ? 2.5 : 5;
    return {
      status: "increase",
      label: `Ready: you can increase by ${increment} lbs when you choose.`,
      nextWeights: weights.map((weight) => weight + increment),
    };
  }

  if (allTop) {
    return {
      status: "hold",
      label: "Next time: repeat the same weight once more before increasing.",
      nextWeights: weights,
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

function hasSameCompletedWeightsAtTop(latest, previous) {
  if (!previous || latest.sets.length !== previous.sets.length) return false;

  return latest.sets.every((latestSet, index) => {
    const previousSet = previous.sets[index];
    if (latestSet.done === false || previousSet.done === false) return false;
    const latestWeight = Number(latestSet.weight);
    const previousWeight = Number(previousSet.weight);
    if (!latestWeight || latestWeight !== previousWeight) return false;
    return Number(latestSet.reps) >= latest.topReps && Number(previousSet.reps) >= previous.topReps;
  });
}

function getStartLabel(templateItem) {
  const hasDefaults = templateItem.defaults.some((weight) => weight !== "");
  if (!hasDefaults) return "Start with blank weights and enter your working weight.";
  return `Start with ${templateItem.defaults.join(" / ")} lbs.`;
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

function renderWorkoutOptions() {
  const current = els.workoutSelect.value;
  els.workoutSelect.innerHTML = getAllWorkoutTemplates()
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  if (current) els.workoutSelect.value = current;
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

function renderWorkoutProgress() {
  const workoutId = els.workoutSelect.value || getAllWorkoutTemplates()[0]?.id;
  if (!workoutId) return;
  const template = getAllWorkoutTemplates().find((item) => item.id === workoutId);
  const history = getWorkoutHistory(workoutId);

  if (!history.length) {
    els.workoutChartArea.innerHTML = `<div class="chart-empty">No logged sessions yet for this workout.</div>`;
    els.workoutSummary.innerHTML = "";
    els.workoutMovementList.innerHTML = renderWorkoutMovementList(template, []);
    return;
  }

  if (template.type === "cardio") {
    renderCardioProgress(template, history);
    return;
  }

  const latest = history.at(-1);
  const readyCount = template.exercises.filter((item) => getSuggestion(item).status === "increase").length;
  const latestLastWeights = getSessionLastWeights(latest).filter((item) => item.weight > 0);

  els.workoutChartArea.innerHTML = renderWorkoutSessionWeights(template, history);
  els.workoutSummary.innerHTML = `
    <div class="summary-card"><strong>${formatShortDate(latest.date)}</strong><span>latest workout</span></div>
    <div class="summary-card"><strong>${latestLastWeights.length}</strong><span>weights logged</span></div>
    <div class="summary-card"><strong>${readyCount}</strong><span>ready up</span></div>
  `;
  els.workoutMovementList.innerHTML = renderWorkoutMovementList(template, history);
}

function renderCardioProgress(template, history) {
  const minutes = history.map((session) => Number(session.cardio?.minutes) || 0);
  const levels = history.map((session) => Number(session.cardio?.level) || 0);
  const latest = history.at(-1);

  els.workoutChartArea.innerHTML = makeLineChart(minutes, history.map((item) => formatShortDate(item.date)), "Minutes per session");
  els.workoutSummary.innerHTML = `
    <div class="summary-card"><strong>${Math.max(...minutes)}</strong><span>best minutes</span></div>
    <div class="summary-card"><strong>${Math.max(...levels)}</strong><span>best level</span></div>
    <div class="summary-card"><strong>${formatShortDate(latest.date)}</strong><span>last logged</span></div>
  `;
  els.workoutMovementList.innerHTML = `
    <article class="movement-progress-card">
      <div>
        <strong>${template.name}</strong>
        <p class="history-meta">Latest: Level ${latest.cardio?.level || "-"} · ${latest.cardio?.minutes || "-"} minutes</p>
      </div>
      <span class="status-badge">Cardio</span>
    </article>
  `;
}

function renderWorkoutMovementList(template, history) {
  if (template.type === "cardio") return "";

  return template.exercises
    .map((exerciseItem) => {
      const exerciseHistory = getExerciseHistoryForWorkout(template.id, exerciseItem.id);
      const latest = exerciseHistory.at(-1);
      const bestWeight = exerciseHistory.length ? Math.max(...exerciseHistory.map(getBestWeight)) : 0;
      const bestVolume = exerciseHistory.length ? Math.max(...exerciseHistory.map(getEntryVolume)) : 0;
      const suggestion = getSuggestion(exerciseItem);
      return `
        <article class="movement-progress-card">
          <div>
            <strong>${exerciseItem.name}</strong>
            <p class="source">(${exerciseItem.source}) · ${exerciseItem.target}</p>
            <p class="history-meta">
              Latest: ${latest ? `${getLastSetWeight(latest)} lbs · ${formatShortDate(latest.date)}` : "not logged yet"}
            </p>
          </div>
          <div class="movement-stats">
            <span>Best ${bestWeight} lbs</span>
            <span>Vol ${Math.round(bestVolume)}</span>
            <span class="status-badge ${suggestion.status}">${suggestion.status === "increase" ? "Ready up" : suggestion.status}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWorkoutSessionWeights(template, history) {
  return `
    <div class="session-weight-table" role="table" aria-label="Last weight per exercise by workout date">
      ${[...history]
        .reverse()
        .map((session) => {
          const entries = new Map((session.exercises || []).map((entry) => [entry.exerciseId, entry]));
          return `
            <article class="session-weight-row">
              <div class="session-weight-date">
                <strong>${formatShortDate(session.date)}</strong>
                <span>${getCompletedSetCount(session)} sets</span>
              </div>
              <div class="session-weight-list">
                ${template.exercises
                  .map((exerciseItem) => {
                    const entry = entries.get(exerciseItem.id);
                    const weight = entry ? getLastSetWeight(entry) : 0;
                    return `
                      <div class="session-weight-item">
                        <span>${exerciseItem.name}</span>
                        <strong>${weight ? `${weight} lbs` : "-"}</strong>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function makeLineChart(values, labels, title = "Best weight per session") {
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
      <text x="${pad}" y="22" font-size="13" fill="#637083">${title}</text>
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
      if (session.type === "cardio") {
        return `
          <article class="history-item">
            <div class="history-top">
              <strong>${session.templateName}</strong>
              <span>${formatDate(session.date)}</span>
            </div>
            <p class="history-meta">Level ${session.cardio?.level || "-"} · ${session.cardio?.minutes || "-"} minutes</p>
            ${session.notes ? `<p class="history-meta">${escapeHtml(session.notes)}</p>` : ""}
          </article>
        `;
      }

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
    sortSessions();
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
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

function formatFullDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date(value));
}

function toDateInputValue(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getSessionDateFromInput(inputValue, fallback) {
  if (!inputValue) return fallback;
  return new Date(`${inputValue}T12:00:00`).toISOString();
}

function sortSessions() {
  state.sessions = sortSessionList(state.sessions);
}

function sortSessionList(sessions) {
  return sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
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
  const increaseButton = event.target.closest("[data-increase-exercise-id]");
  if (increaseButton) {
    toggleExerciseIncrease(increaseButton.dataset.increaseExerciseId);
    return;
  }

  const templateButton = event.target.closest("[data-template-id]");
  if (templateButton) startWorkout(templateButton.dataset.templateId);
});

document.addEventListener("input", (event) => {
  if (activeSession && event.target.matches("[data-cardio-field]")) {
    activeSession.cardio[event.target.dataset.cardioField] =
      event.target.value === "" ? "" : Number(event.target.value);
    return;
  }

  if (!activeSession || !event.target.matches("[data-field]")) return;
  const { exerciseIndex, setIndex, field } = event.target.dataset;
  const set = activeSession.exercises[exerciseIndex].sets[setIndex];
  set[field] = field === "done" ? event.target.checked : Number(event.target.value);
});

els.finishWorkout.addEventListener("click", finishWorkout);
els.cancelWorkout.addEventListener("click", () => {
  activeSession = null;
  els.workoutDate.value = "";
  els.workoutNotes.value = "";
  els.activeWorkoutPanel.classList.add("hidden");
  renderDashboard();
});

els.workoutDate.addEventListener("change", () => {
  if (!activeSession) return;
  activeSession.date = getSessionDateFromInput(els.workoutDate.value, activeSession.date);
});

els.exerciseSelect.addEventListener("change", renderChart);
els.workoutSelect.addEventListener("change", renderWorkoutProgress);

els.progressModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    els.progressModeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const mode = button.dataset.progressMode;
    els.exerciseProgressPanel.classList.toggle("hidden", mode !== "exercise");
    els.workoutProgressPanel.classList.toggle("hidden", mode !== "workout");
  });
});

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
