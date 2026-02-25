import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppSettings {
  refreshInterval: number;
  enableAlerts: boolean;
  activeDatasourceId: number | null;
}

interface SettingsState extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      refreshInterval: 60,
      enableAlerts: true,
      activeDatasourceId: null,
      updateSettings: (settings) => set((s) => ({ ...s, ...settings })),
    }),
    { name: "metrics-nexus-settings" }
  )
);
