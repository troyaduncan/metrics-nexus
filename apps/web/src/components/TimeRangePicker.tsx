import { useState, useRef, useEffect } from "react";
import { useFilterStore } from "@/lib/stores/filter-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { REFRESH_INTERVALS } from "@metrics-nexus/shared/schemas/filters.js";
import type { TimeRangePreset } from "@metrics-nexus/shared/schemas/filters.js";
import { clsx } from "clsx";
import { RefreshCw, ChevronDown } from "lucide-react";

const PRESETS: { value: TimeRangePreset; label: string }[] = [
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "12h", label: "12h" },
  { value: "24h", label: "24h" },
  { value: "2d", label: "2d" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
];

function RefreshIntervalPicker() {
  const { refreshInterval, updateSettings } = useSettingsStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const activeLabel =
    REFRESH_INTERVALS.find((r) => r.value === refreshInterval)?.label || `${refreshInterval}s`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-colors border",
          refreshInterval > 0
            ? "border-magenta-500/30 text-magenta-500 bg-magenta-500/5"
            : "border-border text-text-muted hover:text-text-primary hover:bg-surface-tertiary"
        )}
        title="Auto-refresh interval"
      >
        <RefreshCw
          className={clsx("w-3 h-3", refreshInterval > 0 && "animate-spin")}
          style={refreshInterval > 0 ? { animationDuration: "3s" } : undefined}
        />
        {refreshInterval > 0 ? activeLabel : "Off"}
        <ChevronDown className="w-2.5 h-2.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[100px] rounded-lg border border-border bg-surface shadow-lg overflow-hidden">
          {REFRESH_INTERVALS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                updateSettings({ refreshInterval: value });
                setOpen(false);
              }}
              className={clsx(
                "w-full text-left px-3 py-1.5 text-xs transition-colors",
                refreshInterval === value
                  ? "bg-magenta-500/10 text-magenta-500"
                  : "text-text-secondary hover:bg-surface-tertiary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function TimeRangePicker() {
  const { timeRange, setTimePreset } = useFilterStore();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {PRESETS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTimePreset(value)}
            className={clsx(
              "px-2 py-1 text-xs font-medium rounded-md transition-colors",
              timeRange.preset === value
                ? "bg-magenta-500 text-white"
                : "text-text-muted hover:text-text-primary hover:bg-surface-tertiary"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="w-px h-5 bg-border" />
      <RefreshIntervalPicker />
    </div>
  );
}
