import { useState, useEffect } from "react";
import { fetchTasks, addTask, updateTask, deleteTask } from "../api";
import "./task.css";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Work",
    time: "",
    completed: false,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetchTasks();
        setTasks(res.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    loadTasks();
  }, []);

  const handleSave = async () => {
    if (!formData.title || !formData.time) return;
    try {
      if (editTask) await updateTask(editTask.id, formData);
      else await addTask(formData);
      setFormData({ title: "", category: "Work", time: "", completed: false });
      setEditTask(null);
      setShowModal(false);
      const res = await fetchTasks();
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      if (taskToDelete) {
        await deleteTask(taskToDelete.id);
        const res = await fetchTasks();
        setTasks(res.data || []);
        setTaskToDelete(null);
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (!tasks) return <div>Loading tasks...</div>;

  return (
    <div className="container">
      <header className="header">
        <div className="headerTitle">
          <span className="headerIcon">
            <i className="fa-solid fa-list-check" />
          </span>
          <div>
            <h1>My Tasks</h1>
            <p>Manage your daily tasks efficiently</p>
          </div>
        </div>
      </header>

      <div className="tabs">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="taskList">
        {filteredTasks.length === 0 ? (
          <p className="noTasks">
            <span className="noTasksIcon">
              <i className="fa-solid fa-check" />
            </span>
            You are all caught up!
          </p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`taskCard ${task.completed ? "completedTask" : ""}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={async () => {
                  await updateTask(task.id, { ...task, completed: !task.completed });
                  const res = await fetchTasks();
                  setTasks(res.data || []);
                }}
              />
              <div className="taskInfo">
                <h3 className={task.completed ? "done" : ""}>{task.title}</h3>
                <span className={`tag ${task.category.toLowerCase()}`}>
                  {task.category}
                </span>
                <p className="time">Due {task.time}</p>
              </div>
              <div className="taskActions">
                <button
                  className="iconBtn editBtn"
                  onClick={() => {
                    setEditTask(task);
                    setFormData(task);
                    setShowModal(true);
                  }}
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  className="iconBtn deleteBtn"
                  onClick={() => {
                    setTaskToDelete(task);
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="addBtn" onClick={() => setShowModal(true)}>
        <span className="addBtnIcon">
          <i className="fa-solid fa-plus" />
        </span>
      </button>

      {showModal && (
        <div
          className="modalBackdrop"
          onClick={() => {
            setShowModal(false);
            setEditTask(null);
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editTask ? "Edit Task" : "Add Task"}</h2>
            <input
              type="text"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
            <label className="completedLabel">
              <input
                type="checkbox"
                checked={formData.completed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    completed: e.target.checked,
                  })
                }
              />
              Mark as completed
            </label>
            <button className="saveBtn" onClick={handleSave}>
              {editTask ? "Update Task" : "Save Task"}
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modalBackdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="modal deleteModal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Task?</h2>
            <p>Are you sure you want to delete "{taskToDelete?.title}"?</p>
            <div className="modalActions">
              <button className="cancelBtn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="deleteBtn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
