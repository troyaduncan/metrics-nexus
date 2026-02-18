import { useQuery } from "@tanstack/react-query";
import { useFilterStore, resolveTimeRange } from "../stores/filter-store.js";
import { buildLabelMatcher } from "@metrics-nexus/shared/utils/promql-templates.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function getPromBase(datasourceId?: number): string {
  if (datasourceId) return `${API_BASE}/api/datasources/${datasourceId}/prom`;
  return `${API_BASE}/api/prom`;
}

async function fetchPromQuery(promql: string, datasourceId?: number) {
  const base = getPromBase(datasourceId);
  const res = await fetch(
    `${base}/query?${new URLSearchParams({ query: promql })}`
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function fetchPromRangeQuery(
  promql: string,
  start: number,
  end: number,
  step: number,
  datasourceId?: number
) {
  const base = getPromBase(datasourceId);
  const params = new URLSearchParams({
    query: promql,
    start: (start / 1000).toFixed(0),
    end: (end / 1000).toFixed(0),
    step: step.toString(),
  });
  const res = await fetch(`${base}/query_range?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchLabelValues(label: string, datasourceId?: number): Promise<string[]> {
  const base = getPromBase(datasourceId);
  const res = await fetch(
    `${base}/label/${encodeURIComponent(label)}/values`
  );
  if (!res.ok) return [];
  const body = await res.json();
  return body.data || [];
}

export function usePromQuery(promqlTemplate: string, enabled = true, datasourceId?: number) {
  const filters = useFilterStore((s) => s.filters);
  const labelMatcher = buildLabelMatcher(filters);
  const promql = promqlTemplate.replace(/\{\$filters\}/g, labelMatcher || "");

  return useQuery({
    queryKey: ["prom-instant", promql, datasourceId],
    queryFn: () => fetchPromQuery(promql, datasourceId),
    enabled,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}

export function usePromRangeQuery(promqlTemplate: string, enabled = true, datasourceId?: number) {
  const filters = useFilterStore((s) => s.filters);
  const timeRange = useFilterStore((s) => s.timeRange);
  const labelMatcher = buildLabelMatcher(filters);
  const promql = promqlTemplate.replace(/\{\$filters\}/g, labelMatcher || "");
  const { start, end, stepSeconds } = resolveTimeRange(timeRange);

  return useQuery({
    queryKey: ["prom-range", promql, start, end, stepSeconds, datasourceId],
    queryFn: () => fetchPromRangeQuery(promql, start, end, stepSeconds, datasourceId),
    enabled,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}
