import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const datasources = pgTable("datasources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull().default("prometheus"),
  authType: text("auth_type").notNull().default("none"),
  tlsClientCert: text("tls_client_cert"),
  tlsClientKey: text("tls_client_key"),
  caCert: text("ca_cert"),
  skipVerify: boolean("skip_verify").notNull().default(false),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDatasourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().min(1, "URL is required"),
  type: z.string(),
  authType: z.string(),
  tlsClientCert: z.string().nullable().optional(),
  tlsClientKey: z.string().nullable().optional(),
  caCert: z.string().nullable().optional(),
  skipVerify: z.boolean(),
  status: z.string(),
});

export type InsertDatasource = z.infer<typeof insertDatasourceSchema>;
export type Datasource = typeof datasources.$inferSelect;
