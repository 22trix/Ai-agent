const API = "http://localhost:8000";

async function fetchTasks() {
  const res = await fetch(`${API}/tasks`);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const ul = document.getElementById("tasks");
  ul.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.title} ${t.completed ? "(done)" : ""}`;

    const toggle = document.createElement("button");
    toggle.textContent = t.completed ? "Mark undone" : "Mark done";
    toggle.onclick = async () => {
      await fetch(`${API}/tasks/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t.id, title: t.title, description: t.description, completed: !t.completed })
      });
      fetchTasks();
    };

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.onclick = async () => {
      await fetch(`${API}/tasks/${t.id}`, { method: "DELETE" });
      fetchTasks();
    };

    li.appendChild(toggle);
    li.appendChild(del);
    ul.appendChild(li);
  });
}

document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  if (!title) return;
  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  document.getElementById("title").value = "";
  fetchTasks();
});

fetchTasks();
