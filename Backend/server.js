import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// ---------- API ROUTES ----------

// GET /tasks
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error querying tasks:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// POST /tasks
app.post("/tasks", async (req, res) => {
  try {
    const { title, category, time, completed } = req.body;
    const result = await pool.query(
      "INSERT INTO tasks (title, category, time, completed) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, category, time, completed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting task:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// PUT /tasks/:id
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, category, time, completed } = req.body;
    const result = await pool.query(
      "UPDATE tasks SET title=$1, category=$2, time=$3, completed=$4 WHERE id=$5 RETURNING *",
      [title, category, time, completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// ---------- SERVE FRONTEND IN PRODUCTION ----------
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve(); // required for ES modules
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Send all other routes to React's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});