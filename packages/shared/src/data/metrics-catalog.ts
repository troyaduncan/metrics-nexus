import type { Metric } from "../schemas/metric.js";
import { coreMetrics } from "./core-metrics.js";
import { accessMetrics } from "./access-metrics.js";
import { collectorMetrics } from "./collector-metrics.js";
import { snapshotProducerMetrics } from "./snapshot-producer-metrics.js";
import { dlbMetrics } from "./dlb-metrics.js";
import { bcaMetrics } from "./bca-metrics.js";
import { nfregMetrics } from "./nfreg-metrics.js";

export const metricsCatalog: Metric[] = [
  ...coreMetrics,
  ...accessMetrics,
  ...collectorMetrics,
  ...snapshotProducerMetrics,
  ...dlbMetrics,
  ...bcaMetrics,
  ...nfregMetrics,
];

export const metricsByComponent = new Map<string, Metric[]>([
  ["core", coreMetrics],
  ["access", accessMetrics],
  ["collector", collectorMetrics],
  ["snapshot_producer", snapshotProducerMetrics],
  ["dlb", dlbMetrics],
  ["bca", bcaMetrics],
  ["nfreg", nfregMetrics],
]);

export const metricsByName = new Map<string, Metric>(
  metricsCatalog.map((m) => [m.name, m])
);
