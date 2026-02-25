import { NavLink, Outlet } from "react-router-dom";
import { clsx } from "clsx";
import {
  LayoutGrid,
  Search,
  Layers,
  BarChart3,
  Download,
  Wand2,
  Target,
  Settings,
  Sun,
  Moon,
  Database,
} from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "@/lib/stores/theme-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { datasourceApi } from "@/lib/api/datasources";
import { TimeRangePicker } from "./TimeRangePicker";

function DatasourceSelector() {
  const { activeDatasourceId, updateSettings } = useSettingsStore();
  const { data: datasources = [] } = useQuery({
    queryKey: ["datasources"],
    queryFn: datasourceApi.getAll,
    staleTime: 60_000,
  });

  // Auto-select the first datasource when none is chosen
  useEffect(() => {
    if (activeDatasourceId === null && datasources.length > 0) {
      updateSettings({ activeDatasourceId: datasources[0].id });
    }
  }, [datasources, activeDatasourceId, updateSettings]);

  const options = [
    { value: "", label: "Global (PROM_URL)" },
    ...datasources.map((ds) => ({ value: String(ds.id), label: ds.name })),
  ];

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Database size={14} className="text-text-muted shrink-0" />
      <select
        value={activeDatasourceId ?? ""}
        onChange={(e) =>
          updateSettings({
            activeDatasourceId: e.target.value ? Number(e.target.value) : null,
          })
        }
        className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-magenta-500 focus:border-transparent transition-colors appearance-none cursor-pointer max-w-[180px]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const NAV_ITEMS = [
  { to: "/catalog", label: "Catalog", icon: Search },
  { to: "/priority", label: "Priority", icon: Layers },
  { to: "/dashboards/noc", label: "Dashboards", icon: BarChart3 },
  { to: "/query-builder", label: "Builder", icon: Wand2 },
  { to: "/target-builder", label: "Targets", icon: Target },
  { to: "/exports", label: "Exports", icon: Download },
  { to: "/admin", label: "Admin", icon: Settings },
];

export function AppShell() {
  const { isDark, toggle } = useThemeStore();

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface-secondary flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-magenta-500" size={24} />
            <div>
              <h1 className="text-sm font-bold text-text-primary leading-tight">
                Metrics Nexus
              </h1>
              <p className="text-[10px] text-text-muted">CHA Performance</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-magenta-500/10 text-magenta-500"
                    : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={toggle}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-tertiary transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-12 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0">
          <DatasourceSelector />
          <TimeRangePicker />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
