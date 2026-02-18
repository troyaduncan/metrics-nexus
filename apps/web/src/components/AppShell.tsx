import { NavLink, Outlet } from "react-router-dom";
import { clsx } from "clsx";
import {
  LayoutGrid,
  Search,
  Layers,
  BarChart3,
  Download,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { useThemeStore } from "@/lib/stores/theme-store";
import { TimeRangePicker } from "./TimeRangePicker";

const NAV_ITEMS = [
  { to: "/catalog", label: "Catalog", icon: Search },
  { to: "/priority", label: "Priority", icon: Layers },
  { to: "/dashboards/noc", label: "Dashboards", icon: BarChart3 },
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
          <div />
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
