import { eq } from "drizzle-orm";
import { db } from "./index.js";
import {
  datasources,
  type Datasource,
  type InsertDatasource,
} from "@metrics-nexus/shared";

export interface IDatasourceStorage {
  getDatasources(): Promise<Datasource[]>;
  getDatasource(id: number): Promise<Datasource | undefined>;
  createDatasource(datasource: InsertDatasource): Promise<Datasource>;
  updateDatasource(id: number, datasource: Partial<InsertDatasource>): Promise<Datasource | undefined>;
  deleteDatasource(id: number): Promise<boolean>;
}

export class DatasourceStorage implements IDatasourceStorage {
  async getDatasources(): Promise<Datasource[]> {
    return await db.select().from(datasources);
  }

  async getDatasource(id: number): Promise<Datasource | undefined> {
    const [datasource] = await db.select().from(datasources).where(eq(datasources.id, id));
    return datasource;
  }

  async createDatasource(datasource: InsertDatasource): Promise<Datasource> {
    const [created] = await db.insert(datasources).values(datasource).returning();
    return created;
  }

  async updateDatasource(id: number, datasource: Partial<InsertDatasource>): Promise<Datasource | undefined> {
    const [updated] = await db
      .update(datasources)
      .set({ ...datasource, updatedAt: new Date() })
      .where(eq(datasources.id, id))
      .returning();
    return updated;
  }

  async deleteDatasource(id: number): Promise<boolean> {
    const result = await db.delete(datasources).where(eq(datasources.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatasourceStorage();
