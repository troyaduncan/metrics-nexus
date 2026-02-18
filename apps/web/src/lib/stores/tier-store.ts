import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TierConfig, TierLevel } from "@metrics-nexus/shared/schemas/tier.js";

interface TierState {
  tiers: TierConfig;
  addToTier: (tier: TierLevel, metricName: string) => void;
  removeFromTier: (tier: TierLevel, metricName: string) => void;
  moveToTier: (from: TierLevel, to: TierLevel, metricName: string) => void;
  setTiers: (tiers: TierConfig) => void;
  clearTiers: () => void;
  getTierForMetric: (metricName: string) => TierLevel | null;
}

export const useTierStore = create<TierState>()(
  persist(
    (set, get) => ({
      tiers: { tier1: [], tier2: [], tier3: [] },
      addToTier: (tier, metricName) =>
        set((s) => {
          const updated = { ...s.tiers };
          // Remove from any existing tier first
          for (const t of ["tier1", "tier2", "tier3"] as TierLevel[]) {
            updated[t] = updated[t].filter((n) => n !== metricName);
          }
          updated[tier] = [...updated[tier], metricName];
          return { tiers: updated };
        }),
      removeFromTier: (tier, metricName) =>
        set((s) => ({
          tiers: {
            ...s.tiers,
            [tier]: s.tiers[tier].filter((n) => n !== metricName),
          },
        })),
      moveToTier: (from, to, metricName) =>
        set((s) => ({
          tiers: {
            ...s.tiers,
            [from]: s.tiers[from].filter((n) => n !== metricName),
            [to]: [...s.tiers[to].filter((n) => n !== metricName), metricName],
          },
        })),
      setTiers: (tiers) => set({ tiers }),
      clearTiers: () => set({ tiers: { tier1: [], tier2: [], tier3: [] } }),
      getTierForMetric: (metricName) => {
        const { tiers } = get();
        for (const t of ["tier1", "tier2", "tier3"] as TierLevel[]) {
          if (tiers[t].includes(metricName)) return t;
        }
        return null;
      },
    }),
    { name: "metrics-nexus-tiers" }
  )
);
