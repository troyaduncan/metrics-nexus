import { Router } from "express";
import type { Request, Response } from "express";
import * as prom from "../services/prometheus-client.js";

const router = Router();

router.get("/api/prom/query", async (req: Request, res: Response) => {
  try {
    const { query: promql, time } = req.query;
    if (!promql || typeof promql !== "string") {
      res.status(400).json({ error: "Missing 'query' parameter" });
      return;
    }
    const result = await prom.query(promql, time as string | undefined);
    res.json(result);
  } catch (err: unknown) {
    const statusCode = err instanceof prom.PrometheusError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(statusCode).json({ error: message });
  }
});

router.get("/api/prom/query_range", async (req: Request, res: Response) => {
  try {
    const { query: promql, start, end, step } = req.query;
    if (!promql || typeof promql !== "string") {
      res.status(400).json({ error: "Missing 'query' parameter" });
      return;
    }
    if (!start || !end || !step) {
      res.status(400).json({ error: "Missing 'start', 'end', or 'step' parameter" });
      return;
    }
    const result = await prom.queryRange(
      promql,
      start as string,
      end as string,
      step as string
    );
    res.json(result);
  } catch (err: unknown) {
    const statusCode = err instanceof prom.PrometheusError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(statusCode).json({ error: message });
  }
});

router.get(
  "/api/prom/label/:label/values",
  async (req: Request, res: Response) => {
    try {
      const label = req.params.label as string;
      const result = await prom.labelValues(label);
      res.json(result);
    } catch (err: unknown) {
      const statusCode = err instanceof prom.PrometheusError ? err.statusCode : 500;
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(statusCode).json({ error: message });
    }
  }
);

export default router;
