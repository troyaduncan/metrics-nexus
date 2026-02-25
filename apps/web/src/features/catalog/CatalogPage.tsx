import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Database, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "./MetricCard";
import { MetricDetail } from "./MetricDetail";
import { metricsCatalog } from "@metrics-nexus/shared/data/metrics-catalog.js";
import { CATEGORIES, COMPONENTS } from "@metrics-nexus/shared/utils/metric-categories.js";
import { datasourceApi } from "@/lib/api/datasources";
import { useSettingsStore } from "@/lib/stores/settings-store";
import type { Metric } from "@metrics-nexus/shared/schemas/metric.js";
import type { ExtendedMetricInfo } from "@metrics-nexus/shared";

export function CatalogPage() {
  const [search, setSearch] = useState("");
  const [filterComponent, setFilterComponent] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAudience, setFilterAudience] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  const activeDatasourceId = useSettingsStore((s) => s.activeDatasourceId);

  // Fetch extended metrics (with labels + sample counts) from active datasource
  const { data: liveMetrics, isLoading: isLoadingLive } = useQuery({
    queryKey: ["datasource-extended-metrics", activeDatasourceId],
    queryFn: () => datasourceApi.getMetrics(activeDatasourceId!, true),
    enabled: !!activeDatasourceId,
    staleTime: 120_000,
  });

  // Build a lookup map: metric name → ExtendedMetricInfo
  const liveMetricsMap = useMemo(() => {
    const map = new Map<string, ExtendedMetricInfo>();
    if (liveMetrics) {
      for (const m of liveMetrics) {
        map.set(m.name, m);
      }
    }
    return map;
  }, [liveMetrics]);

  const filtered = useMemo(() => {
    return metricsCatalog.filter((m) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !m.name.toLowerCase().includes(q) &&
          !(m.description || "").toLowerCase().includes(q)
        )
          return false;
      }
      if (filterComponent && m.component !== filterComponent) return false;
      if (filterCategory && m.category !== filterCategory) return false;
      if (filterAudience && !m.audience.includes(filterAudience as "NOC" | "SRE" | "ENG"))
        return false;
      if (filterType && m.type !== filterType) return false;
      return true;
    });
  }, [search, filterComponent, filterCategory, filterAudience, filterType]);

  const componentOptions = Object.entries(COMPONENTS).map(([k, v]) => ({
    value: k,
    label: v,
  }));
  const categoryOptions = Object.entries(CATEGORIES).map(([k, v]) => ({
    value: k,
    label: v,
  }));
  const audienceOptions = [
    { value: "NOC", label: "NOC" },
    { value: "SRE", label: "SRE" },
    { value: "ENG", label: "ENG" },
  ];
  const typeOptions = [
    { value: "counter", label: "Counter" },
    { value: "gauge", label: "Gauge" },
    { value: "summary", label: "Summary" },
    { value: "histogram", label: "Histogram" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Metrics Catalog
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-sm text-text-muted">
            {metricsCatalog.length} metrics across {Object.keys(COMPONENTS).length} CHA components
          </p>
          {activeDatasourceId && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Database className="w-3 h-3" />
              {isLoadingLive ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading live data...
                </span>
              ) : liveMetrics ? (
                <Badge variant="default" className="text-[10px]">
                  {liveMetrics.length} live metrics
                </Badge>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[250px]">
          <Input
            icon={<Search size={16} />}
            placeholder="Search metrics by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-44">
          <Select
            options={componentOptions}
            placeholder="Component"
            value={filterComponent}
            onChange={(e) => setFilterComponent(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Select
            options={categoryOptions}
            placeholder="Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
        </div>
        <div className="w-28">
          <Select
            options={audienceOptions}
            placeholder="Audience"
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
          />
        </div>
        <div className="w-32">
          <Select
            options={typeOptions}
            placeholder="Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted mb-4">
        Showing {filtered.length} of {metricsCatalog.length} metrics
      </p>

      {/* Metric cards */}
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => (
          <MetricCard
            key={m.name}
            metric={m}
            liveInfo={liveMetricsMap.get(m.name)}
            onClick={() => setSelectedMetric(m)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          No metrics match your filters.
        </div>
      )}

      {/* Detail drawer */}
      <Drawer
        open={!!selectedMetric}
        onClose={() => setSelectedMetric(null)}
        title="Metric Details"
      >
        {selectedMetric && (
          <MetricDetail
            metric={selectedMetric}
            liveInfo={liveMetricsMap.get(selectedMetric.name)}
          />
        )}
      </Drawer>
    </div>
  );
}
