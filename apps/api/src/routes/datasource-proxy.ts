import { Router } from "express";
import { storage } from "../db/storage.js";
import { DatasourcePrometheusClient } from "../services/datasource-prometheus-client.js";

const router = Router();

// Proxy instant query through a specific datasource
router.get("/api/datasources/:id/prom/query", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.getDatasource(id);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    const { query, time } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing required 'query' parameter" });
    }

    const client = new DatasourcePrometheusClient(datasource);
    const result = await client.query(query, time as string | undefined);
    res.json(result);
  } catch (error) {
    console.error("Error proxying query:", error);
    res.status(502).json({
      error: error instanceof Error ? error.message : "Failed to proxy query",
    });
  }
});

// Proxy range query through a specific datasource
router.get("/api/datasources/:id/prom/query_range", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.getDatasource(id);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    const { query, start, end, step } = req.query;
    if (!query || !start || !end || !step) {
      return res.status(400).json({ error: "Missing required parameters: query, start, end, step" });
    }

    const client = new DatasourcePrometheusClient(datasource);
    const result = await client.queryRange(
      query as string,
      start as string,
      end as string,
      step as string
    );
    res.json(result);
  } catch (error) {
    console.error("Error proxying range query:", error);
    res.status(502).json({
      error: error instanceof Error ? error.message : "Failed to proxy range query",
    });
  }
});

// Proxy label values through a specific datasource
router.get("/api/datasources/:id/prom/label/:label/values", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.getDatasource(id);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    const client = new DatasourcePrometheusClient(datasource);
    const result = await client.labelValues(req.params.label);
    res.json(result);
  } catch (error) {
    console.error("Error proxying label values:", error);
    res.status(502).json({
      error: error instanceof Error ? error.message : "Failed to proxy label values",
    });
  }
});

export default router;
