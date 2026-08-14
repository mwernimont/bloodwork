import { Router } from "express";
import { query } from "../db/index.js";
import { buildSetClause } from "../db/buildSetClause.js";

export const projectsRouter = Router();

// List all projects, newest first
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

// Fetch a single project by id, for the edit view
projectsRouter.get("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("SELECT * FROM projects WHERE id = $1", [id]);
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

// Create a new project
projectsRouter.post("/projects", async (req, res) => {
  const { name, description } = req.body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Name is required" });
  }

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

// Partially update a project (only the fields provided in the body)
projectsRouter.patch("/projects/:id", async (req, res) => {
  const { id } = req.params;

  if (
    req.body.name !== undefined &&
    (typeof req.body.name !== "string" || req.body.name.trim().length === 0)
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Name cannot be empty" });
  }

  const allowedFields = ["name", "description"];
  const { fields, values, nextIndex } = buildSetClause(
    req.body,
    allowedFields,
  );

  if (fields.length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No fields provided to update" });
  }
  values.push(id);

  try {
    const result = await query(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = $${nextIndex} RETURNING *`,
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

// Delete a project (cascades to its characters)
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
