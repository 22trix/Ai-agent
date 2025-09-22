// frontend/app.js
const API_BASE = "http://127.0.0.1:8000"; // change if your backend uses a different port

const $ = id => document.getElementById(id);
const tasksContainer = $("tasksContainer");
const emptyState = $("emptyState");
const loader = $("loader");
const formFeedback = $("formFeedback");
const form = $("taskForm");
const titleInput = $("title");

function showLoader(show=true) { loader.style.display = show ? "block" : "none"; }
function showFeedback(message, kind="info") {
  formFeedback.innerHTML = `<div class="alert alert-${kind} py-1 mb-0">${message}</div>`;
  setTimeout(()=> formFeedback.innerHTML = "", 2500);
}

async function fetchTasks() {
  showLoader(true);
  try {
    const resp = await fetch(`${API_BASE}/tasks`);
    if (!resp.ok) throw new Error("Failed to fetch tasks");
    const tasks = await resp.json();
    renderTasks(tasks);
  } catch (err) {
    console.error(err);
    showFeedback("Could not load tasks. Is the backend running?", "danger");
  } finally {
    showLoader(false);
  }
}

function createTaskCard(t) {
  const col = document.createElement("div");
  col.className = "col-12";

  const card = document.createElement("div");
  card.className = "card task-card shadow-sm";

  const body = document.createElement("div");
  body.className = "card-body d-flex justify-content-between align-items-center";

  // left area (title + description)
  const left = document.createElement("div");
  left.className = "me-3 flex-grow-1";

  const titleWrap = document.createElement("div");
  titleWrap.className = "d-flex align-items-center gap-2";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = t.completed;
  checkbox.className = "form-check-input me-2";
  checkbox.style.cursor = "pointer";
  checkbox.onclick = async () => await toggleTask(t);

  const titleEl = document.createElement("div");
  titleEl.className = t.completed ? "task-title completed" : "task-title";
  titleEl.title = t.title;

  // inline editable title
  const titleInput = document.createElement("input");
  titleInput.value = t.title;
  titleInput.className = "inline-edit";
  titleInput.style.display = "none";

  // double-click to edit
  titleEl.textContent = t.title;
  titleEl.ondblclick = () => {
    titleEl.style.display = "none";
    titleInput.style.display = "block";
    titleInput.focus();
  };

  // commit edit on blur or Enter
  titleInput.onblur = async () => {
    if (titleInput.value.trim() === "") {
      titleInput.value = t.title;
    } else if (titleInput.value !== t.title) {
      await updateTask({...t, title: titleInput.value});
    }
    titleInput.style.display = "none";
    titleEl.style.display = "block";
  };
  titleInput.onkeydown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      titleInput.blur();
    } else if (e.key === "Escape") {
      titleInput.value = t.title;
      titleInput.blur();
    }
  };

  titleWrap.appendChild(checkbox);
  titleWrap.appendChild(titleEl);
  titleWrap.appendChild(titleInput);
  left.appendChild(titleWrap);

  if (t.description) {
    const desc = document.createElement("div");
    desc.className = "small-muted";
    desc.textContent = t.description;
    left.appendChild(desc);
  }

  // actions
  const actions = document.createElement("div");
  actions.className = "d-flex gap-2";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-sm btn-outline-secondary";
  editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
  editBtn.title = "Edit title";
  editBtn.onclick = () => {
    titleEl.style.display = "none";
    titleInput.style.display = "block";
    titleInput.focus();
  };

  const delBtn = document.createElement("button");
  delBtn.className = "btn btn-sm btn-outline-danger";
  delBtn.innerHTML = '<i class="bi bi-trash"></i>';
  delBtn.title = "Delete task";
  delBtn.onclick = async () => {
    if (!confirm("Delete this task?")) return;
    await deleteTask(t.id);
  };

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  body.appendChild(left);
  body.appendChild(actions);

  card.appendChild(body);
  col.appendChild(card);
  return col;
}

function renderTasks(tasks) {
  tasksContainer.innerHTML = "";
  if (!tasks.length) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  tasks.forEach(t => {
    tasksContainer.appendChild(createTaskCard(t));
  });
}

async function addTask(title) {
  if (!title || !title.trim()) {
    showFeedback("Please enter a task title", "warning");
    return;
  }
  showLoader(true);
  try {
    const resp = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ title: title.trim() })
    });
    if (!resp.ok) throw new Error("Add failed");
    showFeedback("Task added", "success");
    await fetchTasks();
  } catch (err) {
    console.error(err);
    showFeedback("Could not add task", "danger");
  } finally {
    showLoader(false);
  }
}

async function updateTask(task) {
  showLoader(true);
  try {
    const resp = await fetch(`${API_BASE}/tasks/${task.id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(task)
    });
    if (!resp.ok) throw new Error("Update failed");
    await fetchTasks();
    showFeedback("Task updated", "success");
  } catch (err) {
    console.error(err);
    showFeedback("Could not update task", "danger");
  } finally {
    showLoader(false);
  }
}

async function toggleTask(task) {
  await updateTask({...task, completed: !task.completed});
}

async function deleteTask(id) {
  showLoader(true);
  try {
    const resp = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    if (!(resp.status === 204 || resp.ok)) throw new Error("Delete failed");
    await fetchTasks();
    showFeedback("Task deleted", "info");
  } catch (err) {
    console.error(err);
    showFeedback("Could not delete task", "danger");
  } finally {
    showLoader(false);
  }
}

// Form handling
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(titleInput.value);
  titleInput.value = "";
  titleInput.focus();
});

// quick add with Enter while input focused
titleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask(titleInput.value);
    titleInput.value = "";
  }
});

// initial load
fetchTasks();
