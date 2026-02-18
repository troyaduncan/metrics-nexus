import type {
  Datasource,
  InsertDatasource,
  ExtendedMetricInfo,
  ExportFormat,
  ConnectionTestResult,
} from "@metrics-nexus/shared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export const datasourceApi = {
  getAll: async (): Promise<Datasource[]> => {
    const res = await fetch(`${API_BASE}/api/datasources`);
    if (!res.ok) throw new Error("Failed to fetch datasources");
    return res.json();
  },

  getOne: async (id: number): Promise<Datasource> => {
    const res = await fetch(`${API_BASE}/api/datasources/${id}`);
    if (!res.ok) throw new Error("Datasource not found");
    return res.json();
  },

  create: async (data: InsertDatasource): Promise<Datasource> => {
    const res = await fetch(`${API_BASE}/api/datasources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create datasource");
    }
    return res.json();
  },

  update: async (id: number, data: Partial<InsertDatasource>): Promise<Datasource> => {
    const res = await fetch(`${API_BASE}/api/datasources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update datasource");
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/datasources/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete datasource");
  },

  testConnection: async (id: number): Promise<ConnectionTestResult> => {
    const res = await fetch(`${API_BASE}/api/datasources/${id}/test`, {
      method: "POST",
    });
    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.error || "Connection test failed" };
    }
    return res.json();
  },

  getMetrics: async (id: number, extended = false): Promise<ExtendedMetricInfo[]> => {
    const res = await fetch(`${API_BASE}/api/datasources/${id}/metrics?extended=${extended}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch metrics");
    }
    return res.json();
  },

  getExportUrl: (id: number, format: ExportFormat): string => {
    return `${API_BASE}/api/datasources/${id}/metrics/export?format=${format}`;
  },

  getExportStreamUrl: (id: number): string => {
    return `${API_BASE}/api/datasources/${id}/metrics/export/stream`;
  },
};
