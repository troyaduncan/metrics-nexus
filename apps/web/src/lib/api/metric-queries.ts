import type { MetricQuery, InsertMetricQuery } from "@metrics-nexus/shared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export const metricQueryApi = {
  getAll: async (): Promise<MetricQuery[]> => {
    const res = await fetch(`${API_BASE}/api/queries`);
    if (!res.ok) throw new Error("Failed to fetch queries");
    return res.json();
  },

  getOne: async (id: string): Promise<MetricQuery> => {
    const res = await fetch(`${API_BASE}/api/queries/${id}`);
    if (!res.ok) throw new Error("Query not found");
    return res.json();
  },

  create: async (data: InsertMetricQuery): Promise<MetricQuery> => {
    const res = await fetch(`${API_BASE}/api/queries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create query");
    }
    return res.json();
  },

  update: async (
    id: string,
    data: Partial<InsertMetricQuery>
  ): Promise<MetricQuery> => {
    const res = await fetch(`${API_BASE}/api/queries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update query");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/queries/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete query");
  },
};
