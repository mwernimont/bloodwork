import { Router } from "express";
import { prisma, Prisma } from "../db/index.js";

export const projectsRouter = Router();

// List all projects, newest first
projectsRouter.get("/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ status: "ok", content: projects });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Fetch a single project by id, for the edit view
projectsRouter.get("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project ID does not exist" });
    }
    res.json(project);
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
    const project = await prisma.project.create({
      data: { name, description },
    });
    res.status(201).json(project);
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

  const { name, description } = req.body;
  const data = {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
  };

  if (Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No fields provided to update" });
  }

  try {
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data,
    });
    res.json(project);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ status: "error", message: "Project ID does not exist" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete a project (cascades to its characters)
projectsRouter.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.delete({
      where: { id: Number(id) },
    });
    res.json(project);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ status: "error", message: "Project ID does not exist" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
});
