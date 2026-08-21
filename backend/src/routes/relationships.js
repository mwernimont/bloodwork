import { Router } from "express";
import { prisma, Prisma } from "../db/index.js";

export const relationshipsRouter = Router();

// List all relationships touching a character (outgoing and incoming), for that character's graph
relationshipsRouter.get(
  "/characters/:characterId/relationships",
  async (req, res) => {
    const { characterId } = req.params;
    try {
      const relationships = await prisma.characterRelationship.findMany({
        where: {
          OR: [
            { fromCharacterId: Number(characterId) },
            { toCharacterId: Number(characterId) },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
      res.json({ status: "ok", content: relationships });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },
);

// Create a relationship from one character to another
relationshipsRouter.post(
  "/characters/:characterId/relationships",
  async (req, res) => {
    const { characterId } = req.params;
    const { toCharacterId, category, label, description } = req.body;

    if (!Number.isFinite(Number(toCharacterId))) {
      return res
        .status(400)
        .json({ status: "error", message: "toCharacterId is required" });
    }

    try {
      const relationship = await prisma.characterRelationship.create({
        data: {
          fromCharacterId: Number(characterId),
          toCharacterId: Number(toCharacterId),
          category,
          label,
          description,
        },
      });
      res.status(201).json(relationship);
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },
);

// Partially update a relationship (only the fields provided in the body)
relationshipsRouter.patch("/relationships/:id", async (req, res) => {
  const { id } = req.params;
  const { category, label, description } = req.body;
  const data = {
    ...(category !== undefined && { category }),
    ...(label !== undefined && { label }),
    ...(description !== undefined && { description }),
  };

  if (Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ status: "error", message: "No fields provided to update" });
  }

  try {
    const relationship = await prisma.characterRelationship.update({
      where: { id: Number(id) },
      data,
    });
    res.json(relationship);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ status: "error", message: "Relationship ID does not exist" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Delete a relationship
relationshipsRouter.delete("/relationships/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const relationship = await prisma.characterRelationship.delete({
      where: { id: Number(id) },
    });
    res.json(relationship);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ status: "error", message: "Relationship ID does not exist" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
});
