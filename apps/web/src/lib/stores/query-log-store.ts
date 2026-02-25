import { create } from "zustand";

export interface QueryLogEntry {
  id: string;
  timestamp: number;
  kind: "instant" | "range" | "labels";
  promql: string;
  endpoint: string;
  datasourceId?: number;
  status: "pending" | "success" | "error" | "no-data";
  httpStatus?: number;
  durationMs?: number;
  error?: string;
  resultCount?: number;
}

interface QueryLogState {
  entries: QueryLogEntry[];
  addEntry: (entry: Omit<QueryLogEntry, "id">) => string;
  updateEntry: (id: string, patch: Partial<QueryLogEntry>) => void;
  clear: () => void;
}

const MAX_ENTRIES = 300;
let counter = 0;

export const useQueryLogStore = create<QueryLogState>((set, get) => ({
  entries: [],
  addEntry: (entry) => {
    const id = String(++counter);
    set((s) => ({
      entries: [...s.entries.slice(-(MAX_ENTRIES - 1)), { ...entry, id }],
    }));
    return id;
  },
  updateEntry: (id, patch) =>
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })),
  clear: () => set({ entries: [] }),
}));
