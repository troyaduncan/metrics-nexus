import { useEffect, useState } from "react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useFilterStore } from "@/lib/stores/filter-store";
import { fetchLabelValues } from "@/lib/hooks/use-prom-query";
import { RotateCcw } from "lucide-react";
import type { GlobalFilter } from "@metrics-nexus/shared/schemas/filters.js";

const DRILL_DIMENSIONS: { key: keyof GlobalFilter; label: string }[] = [
  { key: "cluster", label: "Cluster" },
  { key: "region", label: "Region" },
  { key: "service", label: "Service" },
  { key: "instance", label: "Instance" },
  { key: "pod", label: "Pod" },
];

export function DrillDownBar({ datasourceId }: { datasourceId?: number }) {
  const { filters, setFilter, clearFilters } = useFilterStore();
  const [labelOptions, setLabelOptions] = useState<
    Record<string, { value: string; label: string }[]>
  >({});

  useEffect(() => {
    async function loadLabels() {
      const results: Record<string, { value: string; label: string }[]> = {};
      for (const dim of DRILL_DIMENSIONS) {
        try {
          const values = await fetchLabelValues(dim.key, datasourceId);
          results[dim.key] = values.map((v) => ({ value: v, label: v }));
        } catch {
          results[dim.key] = [];
        }
      }
      setLabelOptions(results);
    }
    loadLabels();
  }, [datasourceId]);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {DRILL_DIMENSIONS.map(({ key, label }) => (
        <div key={key} className="w-36">
          <Select
            options={labelOptions[key] || []}
            placeholder={label}
            value={filters[key] || ""}
            onChange={(e) => setFilter(key, e.target.value || undefined)}
          />
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={clearFilters}>
        <RotateCcw size={14} />
        Clear
      </Button>
    </div>
  );
}
