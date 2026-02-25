import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import promRouter from "./routes/prometheus.js";
import datasourcesRouter from "./routes/datasources.js";
import datasourceProxyRouter from "./routes/datasource-proxy.js";
import metricQueriesRouter from "./routes/metric-queries.js";
import metricTargetsRouter from "./routes/metric-targets.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use(healthRouter);
app.use(promRouter);
app.use(datasourcesRouter);
app.use(datasourceProxyRouter);
app.use(metricQueriesRouter);
app.use(metricTargetsRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
  console.log(`Prometheus URL: ${process.env.PROM_URL || "http://localhost:9090"}`);
});
