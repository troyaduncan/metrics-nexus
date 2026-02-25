import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { metricTargetApi } from "@/lib/api/metric-targets";
import { TargetBuilderForm } from "./TargetBuilderForm";
import { QueryChart } from "../query-builder/QueryChart";
import { SavedTargetsPanel } from "./SavedTargetsPanel";
import { LayoutDashboard } from "lucide-react";
import type { MetricTarget } from "@metrics-nexus/shared";

interface InitialMetric {
  metricName: string;
  metricType: string;
  metricLabels: string[];
}

export function TargetBuilderPage() {
  const activeDatasourceId = useSettingsStore((s) => s.activeDatasourceId);
  const queryClient = useQueryClient();
  const location = useLocation();
  const previewRef = useRef<HTMLDivElement>(null);
  const [editingTarget, setEditingTarget] = useState<MetricTarget | null>(null);
  const [initialMetric, setInitialMetric] = useState<InitialMetric | null>(null);
  const [activeCharts, setActiveCharts] = useState<Partial<MetricTarget>[]>([]);

  // Read navigation state from catalog page
  useEffect(() => {
    const state = location.state as InitialMetric | null;
    if (state?.metricName) {
      setInitialMetric(state);
      setEditingTarget(null);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const saveMutation = useMutation({
    mutationFn: async (target: Partial<MetricTarget>) => {
      const payload = {
        name: target.name || "Untitled",
        expression: target.expression || "",
        metricName: target.metricName || "",
        metricType: target.metricType || "counter",
        labels: target.labels || {},
        aggregation: target.aggregation,
        range: target.range,
        legendFormat: target.legendFormat,
        refId: target.refId,
        color: target.color || "#E20074",
        isFavorite: target.isFavorite || false,
        datasourceId: target.datasourceId,
      };
      if (editingTarget) return metricTargetApi.update(editingTarget.id, payload);
      return metricTargetApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metric-targets"] });
      setEditingTarget(null);
    },
  });

  const handleExecute = useCallback(
    (target: Partial<MetricTarget>) => {
      setActiveCharts((prev) => {
        const exists = prev.findIndex(
          (c) => c.expression === target.expression
        );
        if (exists >= 0) {
          const updated = [...prev];
          updated[exists] = target;
          return updated;
        }
        return [...prev, target];
      });
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    []
  );

  const handleEditTarget = useCallback((target: MetricTarget) => {
    setEditingTarget(target);
  }, []);

  return (
    <div className="flex h-full -m-6">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight mb-1 text-text-primary">
                {editingTarget ? "Edit Target" : "Create New Target"}
              </h2>
              <p className="text-sm text-text-muted">
                Build individual metric targets with PromQL expressions for use
                in dashboard panels.
              </p>
            </div>

            <TargetBuilderForm
              datasourceId={activeDatasourceId}
              onExecute={handleExecute}
              onSave={(t) => saveMutation.mutate(t)}
              editingTarget={editingTarget}
              initialMetric={initialMetric}
              isSaving={saveMutation.isPending}
            />

            {/* Preview */}
            {activeCharts.length > 0 && (
              <div ref={previewRef} className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <LayoutDashboard className="w-4 h-4 text-text-muted" />
                  <h3 className="text-sm font-semibold text-text-muted">
                    Preview
                  </h3>
                </div>
                <QueryChart
                  query={{
                    expression:
                      activeCharts[activeCharts.length - 1].expression,
                    name: activeCharts[activeCharts.length - 1].name,
                    metricName:
                      activeCharts[activeCharts.length - 1].metricName,
                    metricType:
                      activeCharts[activeCharts.length - 1].metricType,
                    color: activeCharts[activeCharts.length - 1].color,
                  }}
                  datasourceId={activeDatasourceId}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved targets sidebar */}
      <SavedTargetsPanel
        onSelect={handleEditTarget}
        onEdit={handleEditTarget}
        selectedId={editingTarget?.id}
      />
    </div>
  );
}
