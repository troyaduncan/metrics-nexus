import type { MetricTarget, InsertMetricTarget } from "@metrics-nexus/shared";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export const metricTargetApi = {
  getAll: async (): Promise<MetricTarget[]> => {
    const res = await fetch(`${API_BASE}/api/targets`);
    if (!res.ok) throw new Error("Failed to fetch targets");
    return res.json();
  },

  getOne: async (id: string): Promise<MetricTarget> => {
    const res = await fetch(`${API_BASE}/api/targets/${id}`);
    if (!res.ok) throw new Error("Target not found");
    return res.json();
  },

  create: async (data: InsertMetricTarget): Promise<MetricTarget> => {
    const res = await fetch(`${API_BASE}/api/targets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create target");
    }
    return res.json();
  },

  update: async (
    id: string,
    data: Partial<InsertMetricTarget>
  ): Promise<MetricTarget> => {
    const res = await fetch(`${API_BASE}/api/targets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update target");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/api/targets/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete target");
  },
};
