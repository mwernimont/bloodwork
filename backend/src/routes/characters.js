import { Router } from "express";
import { query } from "../db/index.js";

export const charactersRouter = Router();

charactersRouter.get("/projects/:projectId/characters", async (req, res) => {
  const { projectId } = req.params;
  try {
    const result = await query(
      "SELECT * FROM characters WHERE project_id = $1 ORDER BY created_at DESC",
      [projectId],
    );
    res.json({ status: "ok", content: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

charactersRouter.post("/projects/:projectId/characters", async (req, res) => {
  const { projectId } = req.params;
  const { name, ...metadata } = req.body;
  try {
    const result = await query(
      "INSERT INTO characters (project_id, name, metadata) VALUES ($1, $2, $3) RETURNING *",
      [projectId, name, metadata],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

charactersRouter.delete("/characters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      "DELETE FROM characters WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Character ID does not exist" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});
