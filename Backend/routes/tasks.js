import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM tasks");
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { title, category, time, completed } = req.body;
  const [result] = await pool.query(
    "INSERT INTO tasks (title, category, time, completed) VALUES (?, ?, ?, ?)",
    [title, category, time, completed]
  );
  res.json({ id: result.insertId, ...req.body });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, category, time, completed } = req.body;
  await pool.query(
    "UPDATE tasks SET title=?, category=?, time=?, completed=? WHERE id=?",
    [title, category, time, completed, id]
  );
  res.json({ id, ...req.body });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tasks WHERE id=?", [id]);
  res.json({ message: "Task deleted", id });
});

export default router;