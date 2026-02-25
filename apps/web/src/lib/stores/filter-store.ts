import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GlobalFilter, TimeRangePreset } from "@metrics-nexus/shared/schemas/filters.js";

interface TimeRange {
  preset: TimeRangePreset;
  start?: number;
  end?: number;
}

function getTimeRangeMs(preset: TimeRangePreset): number {
  switch (preset) {
    case "5m": return 5 * 60 * 1000;
    case "15m": return 15 * 60 * 1000;
    case "1h": return 60 * 60 * 1000;
    case "6h": return 6 * 60 * 60 * 1000;
    case "12h": return 12 * 60 * 60 * 1000;
    case "24h": return 24 * 60 * 60 * 1000;
    case "2d": return 2 * 24 * 60 * 60 * 1000;
    case "7d": return 7 * 24 * 60 * 60 * 1000;
    case "30d": return 30 * 24 * 60 * 60 * 1000;
    default: return 60 * 60 * 1000;
  }
}

// Snap the current time to a 30-second grid so that minor differences in
// Date.now() between renders don't produce different query keys, which would
// cause React Query to re-fire queries on every state update and create an
// infinite loading loop.
const SNAP_MS = 30_000;

export function resolveTimeRange(tr: TimeRange): { start: number; end: number; stepSeconds: number } {
  if (tr.preset === "custom" && tr.start && tr.end) {
    const rangeMs = tr.end - tr.start;
    return { start: tr.start, end: tr.end, stepSeconds: Math.max(15, Math.floor(rangeMs / 1000 / 250)) };
  }
  const now = Math.floor(Date.now() / SNAP_MS) * SNAP_MS;
  const rangeMs = getTimeRangeMs(tr.preset);
  return {
    start: now - rangeMs,
    end: now,
    stepSeconds: Math.max(15, Math.floor(rangeMs / 1000 / 250)),
  };
}

interface FilterState {
  filters: GlobalFilter;
  timeRange: TimeRange;
  setFilter: (key: keyof GlobalFilter, value: string | undefined) => void;
  clearFilters: () => void;
  setTimeRange: (tr: TimeRange) => void;
  setTimePreset: (preset: TimeRangePreset) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      filters: {},
      timeRange: { preset: "1h" },
      setFilter: (key, value) =>
        set((s) => ({
          filters: { ...s.filters, [key]: value || undefined },
        })),
      clearFilters: () => set({ filters: {} }),
      setTimeRange: (tr) => set({ timeRange: tr }),
      setTimePreset: (preset) => set({ timeRange: { preset } }),
    }),
    {
      name: "metrics-nexus-filters",
      version: 1,
      migrate: () => ({ filters: {}, timeRange: { preset: "1h" as TimeRangePreset } }),
    }
  )
);
