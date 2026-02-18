import { useFilterStore } from "@/lib/stores/filter-store";
import type { TimeRangePreset } from "@metrics-nexus/shared/schemas/filters.js";
import { clsx } from "clsx";

const PRESETS: { value: TimeRangePreset; label: string }[] = [
  { value: "15m", label: "15m" },
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
];

export function TimeRangePicker() {
  const { timeRange, setTimePreset } = useFilterStore();

  return (
    <div className="flex items-center gap-1">
      {PRESETS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTimePreset(value)}
          className={clsx(
            "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
            timeRange.preset === value
              ? "bg-magenta-500 text-white"
              : "text-text-muted hover:text-text-primary hover:bg-surface-tertiary"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
