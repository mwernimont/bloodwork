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

projectsRouter.patch("/projects/:id", async (res, req) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const fields = [];
  const values = [];

  let i = 1;

  if (name !== undefined) {
    fields.push(`name = $${i++}`);
    values.push(name);
  }
  if (description !== undefined) {
    fields.push(`description = $${i++}`);
    values.push(description);
  }

  if (fields.length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No fields provided to update" });
  }
  values.push(id);

  try {
    const result = await query(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values,
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Project ID does not exist" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

projectsRouter.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Project ID does not exist" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});
