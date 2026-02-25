import { eq, desc } from "drizzle-orm";
import { db } from "./index.js";
import {
  metricQueries,
  type MetricQuery,
  type InsertMetricQuery,
} from "@metrics-nexus/shared";

export interface IMetricQueryStorage {
  getQueries(): Promise<MetricQuery[]>;
  getQuery(id: string): Promise<MetricQuery | undefined>;
  createQuery(query: InsertMetricQuery): Promise<MetricQuery>;
  updateQuery(
    id: string,
    query: Partial<InsertMetricQuery>
  ): Promise<MetricQuery | undefined>;
  deleteQuery(id: string): Promise<boolean>;
}

export class MetricQueryStorage implements IMetricQueryStorage {
  async getQueries(): Promise<MetricQuery[]> {
    return await db
      .select()
      .from(metricQueries)
      .orderBy(desc(metricQueries.createdAt));
  }

  async getQuery(id: string): Promise<MetricQuery | undefined> {
    const [query] = await db
      .select()
      .from(metricQueries)
      .where(eq(metricQueries.id, id));
    return query;
  }

  async createQuery(query: InsertMetricQuery): Promise<MetricQuery> {
    const [created] = await db
      .insert(metricQueries)
      .values(query)
      .returning();
    return created;
  }

  async updateQuery(
    id: string,
    query: Partial<InsertMetricQuery>
  ): Promise<MetricQuery | undefined> {
    const [updated] = await db
      .update(metricQueries)
      .set({ ...query, updatedAt: new Date() })
      .where(eq(metricQueries.id, id))
      .returning();
    return updated;
  }

  async deleteQuery(id: string): Promise<boolean> {
    const result = await db
      .delete(metricQueries)
      .where(eq(metricQueries.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const metricQueryStorage = new MetricQueryStorage();
