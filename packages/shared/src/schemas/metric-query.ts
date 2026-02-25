import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export interface QueryTarget {
  expr: string;
  legendFormat?: string;
}

export const metricQueries = pgTable("metric_queries", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  expression: text("expression").notNull(),
  metricName: text("metric_name").notNull(),
  metricType: text("metric_type").notNull().default("counter"),
  labels: jsonb("labels").$type<Record<string, string>>().default({}),
  aggregation: text("aggregation"),
  range: text("range"),
  visualizationType: text("visualization_type").notNull().default("line"),
  color: text("color").notNull().default("#E20074"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  datasourceId: integer("datasource_id"),
  targets: jsonb("targets").$type<QueryTarget[]>().default([]),
  unit: text("unit"),
  stack: boolean("stack").notNull().default(false),
  decimals: integer("decimals"),
  xAxisFormat: text("x_axis_format"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const queryTargetSchema = z.object({
  expr: z.string().min(1),
  legendFormat: z.string().optional(),
});

export const insertMetricQuerySchema = z.object({
  name: z.string().min(1, "Query name is required"),
  description: z.string().nullable().optional(),
  expression: z.string().min(1, "Expression is required"),
  metricName: z.string().min(1, "Metric name is required"),
  metricType: z.string().default("counter"),
  labels: z.record(z.string(), z.string()).default({}),
  aggregation: z.string().nullable().optional(),
  range: z.string().nullable().optional(),
  visualizationType: z.string().default("line"),
  color: z.string().default("#E20074"),
  isFavorite: z.boolean().default(false),
  datasourceId: z.number().nullable().optional(),
  targets: z.array(queryTargetSchema).default([]),
  unit: z.string().nullable().optional(),
  stack: z.boolean().default(false),
  decimals: z.number().int().min(0).max(6).nullable().optional(),
  xAxisFormat: z.string().nullable().optional(),
});

export type InsertMetricQuery = z.infer<typeof insertMetricQuerySchema>;
export type MetricQuery = typeof metricQueries.$inferSelect;

export const METRIC_TYPES = [
  "counter",
  "gauge",
  "histogram",
  "summary",
] as const;
export type QueryMetricType = (typeof METRIC_TYPES)[number];

export const AGGREGATIONS = [
  "sum",
  "avg",
  "min",
  "max",
  "count",
  "stddev",
  "rate",
  "irate",
  "increase",
  "delta",
  "absent",
  "histogram_quantile",
] as const;
export type Aggregation = (typeof AGGREGATIONS)[number];

export const VISUALIZATION_TYPES = [
  "line",
  "area",
  "bar",
  "scatter",
  "pie",
  "donut",
  "sparkline",
] as const;
export type VisualizationType = (typeof VISUALIZATION_TYPES)[number];

export const COMMON_LABELS = [
  "instance",
  "job",
  "env",
  "region",
  "cluster",
  "namespace",
  "pod",
  "container",
  "service",
  "method",
  "status_code",
  "handler",
  "endpoint",
] as const;

export const COMMON_METRICS = [
  {
    name: "http_requests_total",
    type: "counter",
    description: "Total number of HTTP requests",
  },
  {
    name: "http_request_duration_seconds",
    type: "histogram",
    description: "HTTP request duration in seconds",
  },
  {
    name: "node_cpu_seconds_total",
    type: "counter",
    description: "Total CPU time spent in each mode",
  },
  {
    name: "node_memory_bytes_total",
    type: "gauge",
    description: "Total memory in bytes",
  },
  {
    name: "node_disk_io_time_seconds_total",
    type: "counter",
    description: "Total disk I/O time",
  },
  {
    name: "process_resident_memory_bytes",
    type: "gauge",
    description: "Resident memory size in bytes",
  },
  {
    name: "go_goroutines",
    type: "gauge",
    description: "Number of goroutines",
  },
  { name: "up", type: "gauge", description: "Target up/down status" },
  {
    name: "prometheus_http_requests_total",
    type: "counter",
    description: "Prometheus HTTP requests",
  },
  {
    name: "container_cpu_usage_seconds_total",
    type: "counter",
    description: "Container CPU usage",
  },
  {
    name: "container_memory_usage_bytes",
    type: "gauge",
    description: "Container memory usage",
  },
  {
    name: "kube_pod_status_phase",
    type: "gauge",
    description: "Kubernetes pod status",
  },
  {
    name: "api_response_time_seconds",
    type: "histogram",
    description: "API response time",
  },
  {
    name: "database_connections_active",
    type: "gauge",
    description: "Active database connections",
  },
  {
    name: "error_rate_total",
    type: "counter",
    description: "Total error count",
  },
] as const;

export const QUERY_BUILDER_COLORS = [
  "#E20074",
  "#FF2D8A",
  "#B5005C",
  "#FF6DB3",
  "#9B0050",
  "#FF99CC",
  "#C7006A",
  "#FF4DA6",
  "#A30060",
  "#D4007F",
] as const;

export const UNIT_TYPES = [
  "none",
  "TPS",
  "reqps",
  "ops",
  "s",
  "ms",
  "bytes",
  "percent",
] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

export const X_AXIS_FORMATS = [
  { value: "auto", label: "Auto" },
  { value: "HH:mm", label: "HH:mm" },
  { value: "HH:mm:ss", label: "HH:mm:ss" },
  { value: "MM/dd HH:mm", label: "MM/dd HH:mm" },
  { value: "yyyy-MM-dd", label: "yyyy-MM-dd" },
  { value: "MM/dd", label: "MM/dd" },
] as const;
