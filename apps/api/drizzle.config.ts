import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "../../packages/shared/src/schemas/datasource.ts",
    "../../packages/shared/src/schemas/metric-query.ts",
    "../../packages/shared/src/schemas/metric-target.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/metrics_nexus",
  },
});
