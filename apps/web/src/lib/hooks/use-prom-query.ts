import { useQuery } from "@tanstack/react-query";
import { useFilterStore, resolveTimeRange } from "../stores/filter-store.js";
import { useSettingsStore } from "../stores/settings-store.js";
import { useQueryLogStore } from "../stores/query-log-store.js";
import { buildLabelMatcher } from "@metrics-nexus/shared/utils/promql-templates.js";
import type { PanelTarget } from "@/features/dashboards/shared/DashboardPanel";

/** Convert the settings-store refreshInterval (seconds, 0 = off) to ms for React Query. */
function useRefetchInterval(): number | false {
  const seconds = useSettingsStore((s) => s.refreshInterval);
  return seconds > 0 ? seconds * 1000 : false;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Inject filters into a PromQL template.
 * Handles two patterns:
 *  - {$filters}               → replaced with full label matcher or removed
 *  - {existing, $filters}     → $filters expanded inline or removed
 */
function injectFilters(template: string, labelMatcher: string): string {
  // Pass 1: replace standalone {$filters} with the full matcher (or "")
  let result = template.replace(/\{\$filters\}/g, labelMatcher || "");

  if (labelMatcher) {
    // Has active filters — expand $filters to inner content (without braces)
    const inner = labelMatcher.slice(1, -1);
    result = result.replace(/\$filters/g, inner);
  } else {
    // No filters — remove ", $filters" or "$filters, " leftovers inside braces
    result = result.replace(/,\s*\$filters/g, "").replace(/\$filters\s*,\s*/g, "");
  }

  return result;
}

function getPromBase(datasourceId?: number): string {
  if (datasourceId) return `${API_BASE}/api/datasources/${datasourceId}/prom`;
  return `${API_BASE}/api/prom`;
}

async function fetchPromQuery(promql: string, datasourceId?: number) {
  const base = getPromBase(datasourceId);
  const params = new URLSearchParams({ query: promql });
  const { addEntry, updateEntry } = useQueryLogStore.getState();
  const id = addEntry({
    timestamp: Date.now(),
    kind: "instant",
    promql,
    endpoint: `${base}/query`,
    datasourceId,
    status: "pending",
  });
  const t0 = performance.now();
  try {
    const res = await fetch(`${base}/query?${params}`);
    const durationMs = Math.round(performance.now() - t0);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = body.error || `HTTP ${res.status}`;
      updateEntry(id, { status: "error", httpStatus: res.status, durationMs, error });
      throw new Error(error);
    }
    const resultCount = body?.data?.result?.length ?? 0;
    updateEntry(id, {
      status: resultCount === 0 ? "no-data" : "success",
      httpStatus: res.status,
      durationMs,
      resultCount,
    });
    return body;
  } catch (err) {
    const entry = useQueryLogStore.getState().entries.find((e) => e.id === id);
    if (entry?.status === "pending") {
      updateEntry(id, {
        status: "error",
        durationMs: Math.round(performance.now() - t0),
        error: err instanceof Error ? err.message : String(err),
      });
    }
    throw err;
  }
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
  const { addEntry, updateEntry } = useQueryLogStore.getState();
  const id = addEntry({
    timestamp: Date.now(),
    kind: "range",
    promql,
    endpoint: `${base}/query_range`,
    datasourceId,
    status: "pending",
  });
  const t0 = performance.now();
  try {
    const res = await fetch(`${base}/query_range?${params}`);
    const durationMs = Math.round(performance.now() - t0);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = body.error || `HTTP ${res.status}`;
      updateEntry(id, { status: "error", httpStatus: res.status, durationMs, error });
      throw new Error(error);
    }
    const resultCount = body?.data?.result?.length ?? 0;
    updateEntry(id, {
      status: resultCount === 0 ? "no-data" : "success",
      httpStatus: res.status,
      durationMs,
      resultCount,
    });
    return body;
  } catch (err) {
    const entry = useQueryLogStore.getState().entries.find((e) => e.id === id);
    if (entry?.status === "pending") {
      updateEntry(id, {
        status: "error",
        durationMs: Math.round(performance.now() - t0),
        error: err instanceof Error ? err.message : String(err),
      });
    }
    throw err;
  }
}

export async function fetchLabelValues(label: string, datasourceId?: number): Promise<string[]> {
  const base = getPromBase(datasourceId);
  const { addEntry, updateEntry } = useQueryLogStore.getState();
  const id = addEntry({
    timestamp: Date.now(),
    kind: "labels",
    promql: label,
    endpoint: `${base}/label/${label}/values`,
    datasourceId,
    status: "pending",
  });
  const t0 = performance.now();
  try {
    const res = await fetch(`${base}/label/${encodeURIComponent(label)}/values`);
    const durationMs = Math.round(performance.now() - t0);
    if (!res.ok) {
      updateEntry(id, { status: "error", httpStatus: res.status, durationMs, error: `HTTP ${res.status}` });
      return [];
    }
    const body = await res.json();
    const values: string[] = body.data || [];
    updateEntry(id, {
      status: values.length === 0 ? "no-data" : "success",
      httpStatus: res.status,
      durationMs,
      resultCount: values.length,
    });
    return values;
  } catch (err) {
    const entry = useQueryLogStore.getState().entries.find((e) => e.id === id);
    if (entry?.status === "pending") {
      updateEntry(id, {
        status: "error",
        durationMs: Math.round(performance.now() - t0),
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return [];
  }
}

export function usePromQuery(promqlTemplate: string, enabled = true, datasourceId?: number) {
  const filters = useFilterStore((s) => s.filters);
  const labelMatcher = buildLabelMatcher(filters);
  const promql = injectFilters(promqlTemplate, labelMatcher);
  const refetchInterval = useRefetchInterval();

  return useQuery({
    queryKey: ["prom-instant", promql, datasourceId],
    queryFn: () => fetchPromQuery(promql, datasourceId),
    enabled,
    staleTime: 30_000,
    refetchInterval,
    retry: 1,
  });
}

export function usePromRangeQuery(promqlTemplate: string, enabled = true, datasourceId?: number) {
  const filters = useFilterStore((s) => s.filters);
  const timeRange = useFilterStore((s) => s.timeRange);
  const labelMatcher = buildLabelMatcher(filters);
  const promql = injectFilters(promqlTemplate, labelMatcher);
  const { start, end, stepSeconds } = resolveTimeRange(timeRange);
  const refetchInterval = useRefetchInterval();

  return useQuery({
    queryKey: ["prom-range", promql, start, end, stepSeconds, datasourceId],
    queryFn: () => fetchPromRangeQuery(promql, start, end, stepSeconds, datasourceId),
    enabled,
    staleTime: 30_000,
    refetchInterval,
    retry: 1,
  });
}

function formatLegend(legendFormat: string, metric: Record<string, string>): string {
  return legendFormat.replace(/\{\{(\w+)\}\}/g, (_, key) => metric[key] || "");
}

export interface MultiTargetSeries {
  name: string;
  data: [number, number][];
}

/**
 * Global semaphore — limits the total number of concurrent Prometheus
 * range queries across ALL panels to prevent overwhelming the server.
 */
const globalSemaphore = {
  max: 10,
  running: 0,
  queue: [] as Array<() => void>,

  async acquire(): Promise<void> {
    if (this.running < this.max) {
      this.running++;
      return;
    }
    return new Promise<void>((resolve) => this.queue.push(resolve));
  },

  release(): void {
    const next = this.queue.shift();
    if (next) {
      next(); // hand the slot directly to the next waiter
    } else {
      this.running--;
    }
  },
};

async function throttledFetch<T>(fn: () => Promise<T>): Promise<T> {
  await globalSemaphore.acquire();
  try {
    return await fn();
  } finally {
    globalSemaphore.release();
  }
}

export function useMultiTargetRangeQuery(
  targets: PanelTarget[],
  enabled = true,
  datasourceId?: number
) {
  const filters = useFilterStore((s) => s.filters);
  const timeRange = useFilterStore((s) => s.timeRange);
  const labelMatcher = buildLabelMatcher(filters);
  const { start, end, stepSeconds } = resolveTimeRange(timeRange);
  const refetchInterval = useRefetchInterval();

  const processedExprs = targets.map((t) => injectFilters(t.expr, labelMatcher));

  return useQuery({
    queryKey: ["prom-multi-range", processedExprs, start, end, stepSeconds, datasourceId],
    queryFn: async () => {
      const allSeries: MultiTargetSeries[] = [];

      const results = await Promise.allSettled(
        targets.map((target, i) =>
          throttledFetch(() =>
            fetchPromRangeQuery(processedExprs[i], start, end, stepSeconds, datasourceId)
              .then((body) => ({ body, target }))
          )
        )
      );

      for (const result of results) {
        if (result.status !== "fulfilled") continue;
        const { body, target } = result.value;
        const promResults = body?.data?.result || [];

        for (const r of promResults) {
          const labels = { ...r.metric };
          delete labels.__name__;
          const name = target.legendFormat
            ? formatLegend(target.legendFormat, r.metric)
            : Object.values(labels).join(", ") || "value";

          allSeries.push({
            name,
            data: (r.values || []).map((v: [number, string]) => [
              v[0] * 1000,
              parseFloat(v[1]),
            ]),
          });
        }
      }

      return allSeries;
    },
    enabled,
    staleTime: 30_000,
    refetchInterval,
    retry: 1,
  });
}
