import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppSettings {
  refreshInterval: number;
  enableAlerts: boolean;
}

interface SettingsState extends AppSettings {
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      refreshInterval: 30,
      enableAlerts: true,
      updateSettings: (settings) => set((s) => ({ ...s, ...settings })),
    }),
    { name: "metrics-nexus-settings" }
  )
);
