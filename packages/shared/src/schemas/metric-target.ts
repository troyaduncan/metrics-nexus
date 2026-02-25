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

export const metricTargets = pgTable("metric_targets", {
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
  legendFormat: text("legend_format"),
  refId: text("ref_id"),
  color: text("color").notNull().default("#E20074"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  datasourceId: integer("datasource_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMetricTargetSchema = z.object({
  name: z.string().min(1, "Target name is required"),
  description: z.string().nullable().optional(),
  expression: z.string().min(1, "Expression is required"),
  metricName: z.string().min(1, "Metric name is required"),
  metricType: z.string().default("counter"),
  labels: z.record(z.string(), z.string()).default({}),
  aggregation: z.string().nullable().optional(),
  range: z.string().nullable().optional(),
  legendFormat: z.string().nullable().optional(),
  refId: z.string().nullable().optional(),
  color: z.string().default("#E20074"),
  isFavorite: z.boolean().default(false),
  datasourceId: z.number().nullable().optional(),
});

export type InsertMetricTarget = z.infer<typeof insertMetricTargetSchema>;
export type MetricTarget = typeof metricTargets.$inferSelect;
