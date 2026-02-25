import { useState, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Input } from "@/components/ui/Input";
import { Badge, typeBadgeVariant } from "@/components/ui/Badge";
import { datasourceApi } from "@/lib/api/datasources";
import { COMMON_METRICS } from "@metrics-nexus/shared";
import { Search, ChevronDown } from "lucide-react";

export function MetricSearchDropdown({
  value,
  onChange,
  datasourceId,
}: {
  value: string;
  onChange: (name: string, type: string) => void;
  datasourceId: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const { data: dsMetrics } = useQuery({
    queryKey: ["datasource-metrics", datasourceId],
    queryFn: () => datasourceApi.getMetrics(datasourceId!),
    enabled: !!datasourceId,
    staleTime: 120_000,
  });

  const metrics = useMemo(() => {
    if (dsMetrics && dsMetrics.length > 0) {
      return dsMetrics.map((m) => ({
        name: m.name,
        type: m.type,
        description: m.help || "",
      }));
    }
    return COMMON_METRICS.map((m) => ({ ...m }));
  }, [dsMetrics]);

  const filtered = useMemo(
    () =>
      search
        ? metrics.filter(
            (m) =>
              m.name.toLowerCase().includes(search.toLowerCase()) ||
              m.description.toLowerCase().includes(search.toLowerCase())
          )
        : metrics,
    [metrics, search]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title={value || undefined}
        className={clsx(
          "w-full flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono transition-colors",
          "hover:border-magenta-500/50 focus:outline-none focus:ring-2 focus:ring-magenta-500",
          !value && "text-text-muted"
        )}
      >
        <span className="truncate">{value || "Select metric..."}</span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 text-text-muted" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 min-w-full w-[420px] max-h-80 rounded-lg border border-border bg-surface shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <Input
              placeholder="Search metrics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-3.5 h-3.5" />}
              className="text-xs py-1.5"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-64">
            {filtered.length === 0 ? (
              <p className="text-xs text-text-muted p-3 text-center">
                No metrics found.
              </p>
            ) : (
              filtered.slice(0, 100).map((m) => (
                <button
                  key={m.name}
                  type="button"
                  title={
                    m.name + (m.description ? ` — ${m.description}` : "")
                  }
                  onClick={() => {
                    onChange(m.name, m.type);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={clsx(
                    "w-full text-left px-3 py-2 text-sm hover:bg-surface-tertiary transition-colors flex items-center gap-2",
                    value === m.name && "bg-magenta-500/10"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs text-text-primary truncate">
                      {m.name}
                    </div>
                    {m.description && (
                      <div className="text-[10px] text-text-muted truncate">
                        {m.description}
                      </div>
                    )}
                  </div>
                  <Badge
                    variant={typeBadgeVariant(m.type)}
                    className="text-[9px] shrink-0"
                  >
                    {m.type}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
