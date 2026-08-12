import { Router } from "express";
import { query } from "../db/index.js";

export const projectsRouter = Router();

projectsRouter.get("/projects", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM projects ORDER BY created_at DESC",
    );
    res.json({ status: "ok", content: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

projectsRouter.post("/projects", async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await query(
      "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
      [name, description],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});
