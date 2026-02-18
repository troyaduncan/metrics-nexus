import { z } from "zod";

export const metricTypeSchema = z.enum([
  "counter",
  "gauge",
  "histogram",
  "summary",
  "unknown",
]);

export type MetricType = z.infer<typeof metricTypeSchema>;

export interface ExtendedMetricInfo {
  name: string;
  type: MetricType;
  help: string;
  labels: string[];
  sampleCount: number;
}

export const exportFormatSchema = z.enum(["json", "csv"]);

export type ExportFormat = z.infer<typeof exportFormatSchema>;

export interface ConnectionTestResult {
  success: boolean;
  error?: string;
  metricCount?: number;
}

export interface MetricsProgress {
  processed: number;
  total: number;
  percentage: number;
  currentMetric: string;
  rate: number;
  elapsed: number;
  eta: number;
  batchSize: number;
}

export interface ProgressActivity {
  timestamp: number;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface ExportProgressState {
  status: "idle" | "connecting" | "processing" | "complete" | "error";
  progress: MetricsProgress | null;
  activities: ProgressActivity[];
  error: string | null;
  result: ExtendedMetricInfo[] | null;
}
