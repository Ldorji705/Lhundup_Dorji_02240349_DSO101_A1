// API client that talks to the backend server on port 5001

const API_URL = "http://localhost:5001"; // backend base URL

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return { data };
}

export async function addTask(task) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to add task");
  const data = await res.json();
  return { data };
}

export async function updateTask(id, updates) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  const data = await res.json();
  return { data };
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");

  // backend may or may not send JSON on delete
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { data };
}