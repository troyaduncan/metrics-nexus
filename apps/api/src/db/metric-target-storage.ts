import { eq, desc } from "drizzle-orm";
import { db } from "./index.js";
import {
  metricTargets,
  type MetricTarget,
  type InsertMetricTarget,
} from "@metrics-nexus/shared";

export interface IMetricTargetStorage {
  getTargets(): Promise<MetricTarget[]>;
  getTarget(id: string): Promise<MetricTarget | undefined>;
  createTarget(target: InsertMetricTarget): Promise<MetricTarget>;
  updateTarget(
    id: string,
    target: Partial<InsertMetricTarget>
  ): Promise<MetricTarget | undefined>;
  deleteTarget(id: string): Promise<boolean>;
}

export class MetricTargetStorage implements IMetricTargetStorage {
  async getTargets(): Promise<MetricTarget[]> {
    return await db
      .select()
      .from(metricTargets)
      .orderBy(desc(metricTargets.createdAt));
  }

  async getTarget(id: string): Promise<MetricTarget | undefined> {
    const [target] = await db
      .select()
      .from(metricTargets)
      .where(eq(metricTargets.id, id));
    return target;
  }

  async createTarget(target: InsertMetricTarget): Promise<MetricTarget> {
    const [created] = await db
      .insert(metricTargets)
      .values(target)
      .returning();
    return created;
  }

  async updateTarget(
    id: string,
    target: Partial<InsertMetricTarget>
  ): Promise<MetricTarget | undefined> {
    const [updated] = await db
      .update(metricTargets)
      .set({ ...target, updatedAt: new Date() })
      .where(eq(metricTargets.id, id))
      .returning();
    return updated;
  }

  async deleteTarget(id: string): Promise<boolean> {
    const result = await db
      .delete(metricTargets)
      .where(eq(metricTargets.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const metricTargetStorage = new MetricTargetStorage();
