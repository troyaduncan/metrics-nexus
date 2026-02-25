import { Router } from "express";
import { metricQueryStorage } from "../db/metric-query-storage.js";
import { insertMetricQuerySchema } from "@metrics-nexus/shared";

function formatZodError(error: {
  issues: Array<{ path: (string | number)[]; message: string }>;
}): string {
  return error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
}

const router = Router();

// Get all saved queries
router.get("/api/queries", async (_req, res) => {
  try {
    const queries = await metricQueryStorage.getQueries();
    res.json(queries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});

// Get single query
router.get("/api/queries/:id", async (req, res) => {
  try {
    const query = await metricQueryStorage.getQuery(req.params.id);
    if (!query) {
      return res.status(404).json({ error: "Query not found" });
    }
    res.json(query);
  } catch (error) {
    console.error("Error fetching query:", error);
    res.status(500).json({ error: "Failed to fetch query" });
  }
});

// Create query
router.post("/api/queries", async (req, res) => {
  try {
    const validation = insertMetricQuerySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: formatZodError(validation.error) });
    }
    const query = await metricQueryStorage.createQuery(validation.data);
    res.status(201).json(query);
  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({ error: "Failed to create query" });
  }
});

// Update query
router.patch("/api/queries/:id", async (req, res) => {
  try {
    const partialSchema = insertMetricQuerySchema.partial();
    const validation = partialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: formatZodError(validation.error) });
    }
    const query = await metricQueryStorage.updateQuery(
      req.params.id,
      validation.data
    );
    if (!query) {
      return res.status(404).json({ error: "Query not found" });
    }
    res.json(query);
  } catch (error) {
    console.error("Error updating query:", error);
    res.status(500).json({ error: "Failed to update query" });
  }
});

// Delete query
router.delete("/api/queries/:id", async (req, res) => {
  try {
    const success = await metricQueryStorage.deleteQuery(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Query not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({ error: "Failed to delete query" });
  }
});

export default router;
