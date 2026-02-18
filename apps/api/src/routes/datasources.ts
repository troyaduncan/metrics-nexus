import { Router } from "express";
import { storage } from "../db/storage.js";
import { insertDatasourceSchema, exportFormatSchema } from "@metrics-nexus/shared";
import { DatasourcePrometheusClient, metricsToCSV } from "../services/datasource-prometheus-client.js";

function formatZodError(error: { issues: Array<{ path: (string | number)[]; message: string }> }): string {
  return error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
}

const router = Router();

// Get all datasources
router.get("/api/datasources", async (_req, res) => {
  try {
    const datasources = await storage.getDatasources();
    res.json(datasources);
  } catch (error) {
    console.error("Error fetching datasources:", error);
    res.status(500).json({ error: "Failed to fetch datasources" });
  }
});

// Get single datasource
router.get("/api/datasources/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.getDatasource(id);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    res.json(datasource);
  } catch (error) {
    console.error("Error fetching datasource:", error);
    res.status(500).json({ error: "Failed to fetch datasource" });
  }
});

// Create datasource
router.post("/api/datasources", async (req, res) => {
  try {
    const validation = insertDatasourceSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: formatZodError(validation.error) });
    }

    const datasource = await storage.createDatasource(validation.data);
    res.status(201).json(datasource);
  } catch (error) {
    console.error("Error creating datasource:", error);
    res.status(500).json({ error: "Failed to create datasource" });
  }
});

// Update datasource
router.patch("/api/datasources/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.updateDatasource(id, req.body);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    res.json(datasource);
  } catch (error) {
    console.error("Error updating datasource:", error);
    res.status(500).json({ error: "Failed to update datasource" });
  }
});

// Delete datasource
router.delete("/api/datasources/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteDatasource(id);

    if (!success) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting datasource:", error);
    res.status(500).json({ error: "Failed to delete datasource" });
  }
});

// Test datasource connection
router.post("/api/datasources/:id/test", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.getDatasource(id);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    const client = new DatasourcePrometheusClient(datasource);
    const result = await client.testConnection();
    res.json(result);
  } catch (error) {
    console.error("Error testing datasource:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to test connection",
    });
  }
});

// Get metrics from datasource
router.get("/api/datasources/:id/metrics", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.getDatasource(id);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    const client = new DatasourcePrometheusClient(datasource);
    const extended = req.query.extended === "true";
    const metrics = extended
      ? await client.getExtendedMetrics()
      : await client.getBasicMetrics();

    res.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch metrics",
    });
  }
});

// Export metrics from datasource
router.get("/api/datasources/:id/metrics/export", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.getDatasource(id);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    const formatValidation = exportFormatSchema.safeParse(req.query.format);
    const format = formatValidation.success ? formatValidation.data : "json";

    const client = new DatasourcePrometheusClient(datasource);
    const metrics = await client.getBasicMetrics();

    const safeName = datasource.name.replace(/[^a-zA-Z0-9-_]/g, "_");
    const timestamp = new Date().toISOString().split("T")[0];

    if (format === "csv") {
      const csv = metricsToCSV(metrics);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="metrics-${safeName}-${timestamp}.csv"`
      );
      res.send(csv);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="metrics-${safeName}-${timestamp}.json"`
      );
      res.json(metrics);
    }
  } catch (error) {
    console.error("Error exporting metrics:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to export metrics",
    });
  }
});

// Stream extended metrics export with SSE progress
router.get("/api/datasources/:id/metrics/export/stream", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datasource = await storage.getDatasource(id);

    if (!datasource) {
      return res.status(404).json({ error: "Datasource not found" });
    }

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const sendEvent = (type: string, data: unknown) => {
      res.write(`event: ${type}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    res.on("close", () => {
      console.log(`[Export] Client disconnected from datasource ${id}`);
    });

    try {
      console.log(`[Export] Started for datasource ${id}`);
      sendEvent("connected", { message: "Connection established" });

      const client = new DatasourcePrometheusClient(datasource);

      const result = await client.getExtendedMetricsWithProgress((progress) => {
        sendEvent("progress", progress);

        if (progress.processed % 50 === 0 || progress.processed === progress.total) {
          sendEvent("activity", {
            timestamp: Date.now(),
            message: `Processed ${progress.processed}/${progress.total} metrics (${progress.percentage}%)`,
            type: "info",
          });
        }
      });

      console.log(`[Export] Completed for datasource ${id}: ${result.length} metrics`);

      sendEvent("complete", {
        metrics: result,
        totalProcessed: result.length,
      });

      sendEvent("activity", {
        timestamp: Date.now(),
        message: `Export completed successfully. ${result.length} metrics exported.`,
        type: "success",
      });
    } catch (error) {
      console.error(`[Export] Error for datasource ${id}:`, error);
      sendEvent("error", {
        error: error instanceof Error ? error.message : "Failed to export metrics",
      });
      sendEvent("activity", {
        timestamp: Date.now(),
        message: error instanceof Error ? error.message : "Export failed",
        type: "error",
      });
    } finally {
      res.end();
    }
  } catch (error) {
    console.error("Error setting up SSE:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to start export",
      });
    }
  }
});

export default router;
