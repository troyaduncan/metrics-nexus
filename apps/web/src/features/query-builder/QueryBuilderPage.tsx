import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { metricQueryApi } from "@/lib/api/metric-queries";
import { QueryBuilderForm } from "./QueryBuilderForm";
import { QueryChart, DashboardCards } from "./QueryChart";
import { SavedQueriesPanel } from "./SavedQueriesPanel";
import {
  Layers,
  LayoutDashboard,
  Plus,
  LayoutGrid,
  List,
} from "lucide-react";
import type { MetricQuery } from "@metrics-nexus/shared";

export interface InitialMetric {
  metricName: string;
  metricType: string;
  metricLabels: string[];
}

export function QueryBuilderPage() {
  const activeDatasourceId = useSettingsStore((s) => s.activeDatasourceId);
  const queryClient = useQueryClient();
  const location = useLocation();

  const [editingQuery, setEditingQuery] = useState<MetricQuery | null>(null);
  const [initialMetric, setInitialMetric] = useState<InitialMetric | null>(null);

  // Read navigation state from catalog page (metric name, type, labels)
  useEffect(() => {
    const state = location.state as InitialMetric | null;
    if (state?.metricName) {
      setInitialMetric(state);
      setEditingQuery(null);
      // Clear the location state so it doesn't re-apply on re-renders
      window.history.replaceState({}, "");
    }
  }, [location.state]);
  const [activeCharts, setActiveCharts] = useState<Partial<MetricQuery>[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<string>();
  const [expandedChart, setExpandedChart] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"builder" | "dashboard">(
    "builder"
  );
  const [dashboardView, setDashboardView] = useState<"grid" | "cards">(
    "grid"
  );

  const saveMutation = useMutation({
    mutationFn: async (query: Partial<MetricQuery>) => {
      const payload = {
        name: query.name || "Untitled",
        expression: query.expression || "",
        metricName: query.metricName || "",
        metricType: query.metricType || "counter",
        labels: query.labels || {},
        aggregation: query.aggregation,
        range: query.range,
        visualizationType: query.visualizationType || "line",
        color: query.color || "#E20074",
        isFavorite: query.isFavorite || false,
        datasourceId: query.datasourceId,
        targets: query.targets || [],
        unit: query.unit,
        stack: query.stack || false,
        decimals: query.decimals,
        xAxisFormat: query.xAxisFormat,
      };

      if (editingQuery) {
        return metricQueryApi.update(editingQuery.id, payload);
      }
      return metricQueryApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metric-queries"] });
      setEditingQuery(null);
    },
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleExecute = useCallback(
    (query: Partial<MetricQuery>) => {
      setActiveCharts((prev) => {
        const exists = prev.findIndex(
          (c) => c.expression === query.expression
        );
        if (exists >= 0) {
          const updated = [...prev];
          updated[exists] = query;
          return updated;
        }
        return [...prev, query];
      });
      // Stay on builder tab and scroll preview into view
      setActiveTab("builder");
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    },
    []
  );

  const handleSelectQuery = useCallback(
    (query: MetricQuery) => {
      setSelectedQueryId(query.id);
      handleExecute(query);
    },
    [handleExecute]
  );

  const handleEditQuery = useCallback((query: MetricQuery) => {
    setEditingQuery(query);
    setActiveTab("builder");
  }, []);

  return (
    <div className="flex h-full -m-6">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Tab bar */}
        <div className="h-10 border-b border-border flex items-center justify-between gap-2 px-4 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("builder")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeTab === "builder"
                  ? "bg-magenta-500/10 text-magenta-500"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              Builder
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeTab === "dashboard"
                  ? "bg-magenta-500/10 text-magenta-500"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-tertiary"
              )}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
              {activeCharts.length > 0 && (
                <Badge variant="magenta" className="ml-1 text-[9px] px-1.5">
                  {activeCharts.length}
                </Badge>
              )}
            </button>
          </div>

          {activeTab === "dashboard" && activeCharts.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border rounded-md">
                <button
                  type="button"
                  onClick={() => setDashboardView("grid")}
                  className={clsx(
                    "p-1.5 rounded-l-md transition-colors",
                    dashboardView === "grid"
                      ? "bg-surface-tertiary text-text-primary"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardView("cards")}
                  className={clsx(
                    "p-1.5 rounded-r-md transition-colors",
                    dashboardView === "cards"
                      ? "bg-surface-tertiary text-text-primary"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab("builder")}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Query
              </Button>
            </div>
          )}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "builder" ? (
            <div className="max-w-6xl mx-auto p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight mb-1 text-text-primary">
                  {editingQuery ? "Edit Query" : "Create New Query"}
                </h2>
                <p className="text-sm text-text-muted">
                  Build PromQL expressions with an intuitive interface and
                  visualize metrics in real-time.
                </p>
              </div>

              <QueryBuilderForm
                datasourceId={activeDatasourceId}
                onExecute={handleExecute}
                onSave={(q) => saveMutation.mutate(q)}
                editingQuery={editingQuery}
                initialMetric={initialMetric}
                isSaving={saveMutation.isPending}
              />

              {/* Live preview */}
              {activeCharts.length > 0 && (
                <div ref={previewRef} className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <LayoutDashboard className="w-4 h-4 text-text-muted" />
                    <h3 className="text-sm font-semibold text-text-muted">
                      Preview
                    </h3>
                  </div>
                  <QueryChart
                    query={activeCharts[activeCharts.length - 1]}
                    datasourceId={activeDatasourceId}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1 text-text-primary">
                    Metrics Dashboard
                  </h2>
                  <p className="text-sm text-text-muted">
                    {activeCharts.length > 0
                      ? `Viewing ${activeCharts.length} metric${activeCharts.length > 1 ? "s" : ""}`
                      : "Run queries to see visualizations here"}
                  </p>
                </div>
              </div>

              {activeCharts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-surface-tertiary flex items-center justify-center mb-4">
                    <LayoutDashboard className="w-8 h-8 text-text-muted/40" />
                  </div>
                  <h3 className="text-base font-semibold mb-1 text-text-primary">
                    No metrics yet
                  </h3>
                  <p className="text-sm text-text-muted max-w-xs">
                    Create a query in the Builder tab and run it to see your
                    metrics visualized here.
                  </p>
                  <Button
                    size="sm"
                    className="mt-4"
                    onClick={() => setActiveTab("builder")}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Query
                  </Button>
                </div>
              ) : dashboardView === "cards" ? (
                <DashboardCards
                  charts={activeCharts}
                  datasourceId={activeDatasourceId}
                />
              ) : (
                <div
                  className={
                    expandedChart !== null
                      ? ""
                      : "grid grid-cols-1 xl:grid-cols-2 gap-4"
                  }
                >
                  {activeCharts.map(
                    (chart, i) =>
                      (expandedChart === null || expandedChart === i) && (
                        <QueryChart
                          key={`${chart.expression}-${i}`}
                          query={chart}
                          datasourceId={activeDatasourceId}
                          isExpanded={expandedChart === i}
                          onToggleExpand={() =>
                            setExpandedChart(
                              expandedChart === i ? null : i
                            )
                          }
                        />
                      )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Saved queries panel */}
      <SavedQueriesPanel
        onSelect={handleSelectQuery}
        onEdit={handleEditQuery}
        selectedId={selectedQueryId}
      />
    </div>
  );
}
