import { Router } from "express";
import { prisma, Prisma } from "../db/index.js";

export const charactersRouter = Router();

// List all characters belonging to a project, newest first
charactersRouter.get("/projects/:projectId/characters", async (req, res) => {
  const { projectId } = req.params;
  try {
    const characters = await prisma.character.findMany({
      where: { projectId: Number(projectId) },
      orderBy: { createdAt: "desc" },
    });
    res.json({ status: "ok", content: characters });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Fetch a single character by id, for the edit view
charactersRouter.get("/characters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const character = await prisma.character.findUnique({
      where: { id: Number(id) },
    });
    if (!character) {
      return res
        .status(404)
        .json({ status: "error", message: "Character ID does not exist" });
    }
    res.json(character);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Create a new character under a project; unrecognized body fields are stored as metadata
charactersRouter.post("/projects/:projectId/characters", async (req, res) => {
  const { projectId } = req.params;
  const { name, faction, ...metadata } = req.body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "Name is required" });
  }

  try {
    const character = await prisma.character.create({
      data: { projectId: Number(projectId), name, faction, metadata },
    });
    res.status(201).json(character);
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Partially update a character (only the fields provided in the body)
charactersRouter.patch("/characters/:id", async (req, res) => {
  const { id } = req.params;

  if (
    req.body.name !== undefined &&
    (typeof req.body.name !== "string" || req.body.name.trim().length === 0)
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Name cannot be empty" });
  }

  const { name, faction, metadata } = req.body;
  const data = {
    ...(name !== undefined && { name }),
    ...(faction !== undefined && { faction }),
    ...(metadata !== undefined && { metadata }),
  };

  if (Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No fields provided to update" });
  }

  try {
    const character = await prisma.character.update({
      where: { id: Number(id) },
      data,
    });
    res.json(character);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ status: "error", message: "Character ID does not exist" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete a character
charactersRouter.delete("/characters/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const character = await prisma.character.delete({
      where: { id: Number(id) },
    });
    res.json(character);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ status: "error", message: "Character ID does not exist" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
});
