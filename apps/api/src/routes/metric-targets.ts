import { Router } from "express";
import { metricTargetStorage } from "../db/metric-target-storage.js";
import { insertMetricTargetSchema } from "@metrics-nexus/shared";

function formatZodError(error: {
  issues: Array<{ path: (string | number)[]; message: string }>;
}): string {
  return error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
}

const router = Router();

// Get all saved targets
router.get("/api/targets", async (_req, res) => {
  try {
    const targets = await metricTargetStorage.getTargets();
    res.json(targets);
  } catch (error) {
    console.error("Error fetching targets:", error);
    res.status(500).json({ error: "Failed to fetch targets" });
  }
});

// Get single target
router.get("/api/targets/:id", async (req, res) => {
  try {
    const target = await metricTargetStorage.getTarget(req.params.id);
    if (!target) {
      return res.status(404).json({ error: "Target not found" });
    }
    res.json(target);
  } catch (error) {
    console.error("Error fetching target:", error);
    res.status(500).json({ error: "Failed to fetch target" });
  }
});

// Create target
router.post("/api/targets", async (req, res) => {
  try {
    const validation = insertMetricTargetSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: formatZodError(validation.error) });
    }
    const target = await metricTargetStorage.createTarget(validation.data);
    res.status(201).json(target);
  } catch (error) {
    console.error("Error creating target:", error);
    res.status(500).json({ error: "Failed to create target" });
  }
});

// Update target
router.patch("/api/targets/:id", async (req, res) => {
  try {
    const partialSchema = insertMetricTargetSchema.partial();
    const validation = partialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: formatZodError(validation.error) });
    }
    const target = await metricTargetStorage.updateTarget(
      req.params.id,
      validation.data
    );
    if (!target) {
      return res.status(404).json({ error: "Target not found" });
    }
    res.json(target);
  } catch (error) {
    console.error("Error updating target:", error);
    res.status(500).json({ error: "Failed to update target" });
  }
});

// Delete target
router.delete("/api/targets/:id", async (req, res) => {
  try {
    const success = await metricTargetStorage.deleteTarget(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Target not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting target:", error);
    res.status(500).json({ error: "Failed to delete target" });
  }
});

export default router;
