import { useEffect, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import { clsx } from "clsx";
import { DrillDownBar } from "./shared/DrillDownBar";
import { DashboardPanel } from "./shared/DashboardPanel";
import { QueryLogPanel } from "./shared/QueryLogPanel";
import type { PanelDefinition } from "./shared/DashboardPanel";
import { EChartWrapper } from "@/components/charts/EChartWrapper";
import {
  usePromRangeQuery,
  usePromQuery,
  useMultiTargetRangeQuery,
} from "@/lib/hooks/use-prom-query";
import type { MultiTargetSeries } from "@/lib/hooks/use-prom-query";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { usePanelSlot, usePanelSequencerStore } from "@/lib/stores/panel-sequencer-store";
import { CHART_COLORS, CHART_SERIES_COLORS } from "@/theme/tokens";
import { nocPanels } from "./noc/panels";
import { srePanels } from "./sre/panels";
import { engPanels } from "./eng/panels";
import { trafficPanels } from "./traffic/panels";

const DASHBOARD_TABS = [
  { id: "noc", label: "NOC Overview" },
  { id: "sre", label: "SRE / SLO" },
  { id: "eng", label: "Engineering" },
  { id: "traffic", label: "Traffic" },
];

function getPanels(tab: string): PanelDefinition[] {
  switch (tab) {
    case "noc": return nocPanels;
    case "sre": return srePanels;
    case "eng": return engPanels;
    case "traffic": return trafficPanels;
    default: return nocPanels;
  }
}

function PanelChart({ panel, datasourceId, panelIndex }: { panel: PanelDefinition; datasourceId?: number; panelIndex: number }) {
  const hasSource = datasourceId !== undefined;
  const { canLoad, advance } = usePanelSlot(panelIndex);

  const isTimeseries = panel.chartType === "timeseries";
  const rangeQuery = usePromRangeQuery(
    panel.promql,
    canLoad && hasSource && !panel.targets && isTimeseries,
    datasourceId
  );
  const instantQuery = usePromQuery(
    panel.promql,
    canLoad && hasSource && !panel.targets && !isTimeseries,
    datasourceId
  );

  const query = isTimeseries ? rangeQuery : instantQuery;
  const hasData = query.data?.data?.result?.length > 0;

  // Advance the sequencer when this panel's query settles (or immediately if
  // no source is configured, so subsequent panels don't stall).
  const advancedRef = useRef(false);
  useEffect(() => {
    if (!canLoad) { advancedRef.current = false; return; }
    if (advancedRef.current) return;
    if (!hasSource) { advancedRef.current = true; advance(); return; }
    if (!query.isFetching && (query.isSuccess || query.isError)) {
      advancedRef.current = true;
      advance();
    }
  }, [canLoad, hasSource, query.isFetching, query.isSuccess, query.isError, advance]);

  if (panel.chartType === "gauge" || panel.chartType === "stat") {
    const value = query.data?.data?.result?.[0]?.value?.[1];
    const numVal = value != null ? parseFloat(value) : null;

    return (
      <DashboardPanel
        panel={panel}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error?.message}
        hasData={hasData}
        noSource={!hasSource}
      >
        {numVal != null && (
          <EChartWrapper
            height="200px"
            option={{
              series: [
                {
                  type: "gauge",
                  min: 0,
                  max: panel.chartType === "gauge" && panel.thresholds ? 1 : undefined,
                  progress: { show: true, width: 12 },
                  axisLine: { lineStyle: { width: 12 } },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  axisLabel: { show: false },
                  pointer: { show: false },
                  detail: {
                    fontSize: 24,
                    fontWeight: "bold",
                    formatter: (v: number) =>
                      panel.unit === "ms"
                        ? `${(v * 1000).toFixed(1)}ms`
                        : v >= 0.99
                          ? `${(v * 100).toFixed(2)}%`
                          : v.toFixed(4),
                    color: CHART_COLORS.magenta,
                  },
                  data: [{ value: numVal }],
                  itemStyle: { color: CHART_COLORS.magenta },
                },
              ],
            }}
          />
        )}
      </DashboardPanel>
    );
  }

  if (panel.chartType === "bar") {
    const results = query.data?.data?.result || [];
    const categories = results.map(
      (r: { metric: Record<string, string> }) => {
        const labels = { ...r.metric };
        delete labels.__name__;
        return Object.values(labels).join(", ") || "total";
      }
    );
    const values = results.map(
      (r: { value: [number, string] }) => parseFloat(r.value[1])
    );

    return (
      <DashboardPanel
        panel={panel}
        isLoading={query.isLoading}
        isError={query.isError}
        error={query.error?.message}
        hasData={hasData}
        noSource={!hasSource}
      >
        <EChartWrapper
          height="250px"
          option={{
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: categories, axisLabel: { rotate: 30, fontSize: 10 } },
            yAxis: { type: "value", name: panel.unit },
            series: [
              {
                type: "bar",
                data: values,
                itemStyle: { color: CHART_COLORS.magenta },
                barMaxWidth: 40,
              },
            ],
            grid: { left: 60, right: 20, bottom: 60, top: 20 },
          }}
        />
      </DashboardPanel>
    );
  }

  // timeseries (single-query panels without targets[])
  const results = query.data?.data?.result || [];
  const series = results.map(
    (
      r: { metric: Record<string, string>; values: [number, string][] },
      i: number
    ) => {
      const labels = { ...r.metric };
      delete labels.__name__;
      const name = Object.values(labels).join(", ") || "total";
      return {
        name,
        type: "line",
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2 },
        itemStyle: { color: CHART_SERIES_COLORS[i % CHART_SERIES_COLORS.length] },
        data: (r.values || []).map((v: [number, string]) => [
          v[0] * 1000,
          parseFloat(v[1]),
        ]),
      };
    }
  );

  return (
    <DashboardPanel
      panel={panel}
      isLoading={query.isLoading}
      isError={query.isError}
      error={query.error?.message}
      hasData={hasData}
      noSource={!hasSource}
    >
      <EChartWrapper
        height="250px"
        option={{
          tooltip: { trigger: "axis" },
          legend: { show: series.length > 1, bottom: 0, type: "scroll" },
          xAxis: { type: "time" },
          yAxis: { type: "value", name: panel.unit },
          series,
          grid: { left: 60, right: 20, bottom: series.length > 1 ? 40 : 20, top: 20 },
        }}
      />
    </DashboardPanel>
  );
}

/**
 * Multi-target panel chart — runs one range query per target, then merges
 * all resulting series into a single ECharts timeseries.
 */
function MultiTargetPanelChart({ panel, datasourceId, panelIndex }: { panel: PanelDefinition; datasourceId?: number; panelIndex: number }) {
  const hasSource = datasourceId !== undefined;
  const { canLoad, advance } = usePanelSlot(panelIndex);

  const multiQuery = useMultiTargetRangeQuery(panel.targets || [], canLoad && hasSource, datasourceId);

  const allSeries: MultiTargetSeries[] = multiQuery.data || [];
  const hasData = allSeries.length > 0;

  // Advance when this panel's multi-query batch settles.
  const advancedRef = useRef(false);
  useEffect(() => {
    if (!canLoad) { advancedRef.current = false; return; }
    if (advancedRef.current) return;
    if (!hasSource) { advancedRef.current = true; advance(); return; }
    if (!multiQuery.isFetching && (multiQuery.isSuccess || multiQuery.isError)) {
      advancedRef.current = true;
      advance();
    }
  }, [canLoad, hasSource, multiQuery.isFetching, multiQuery.isSuccess, multiQuery.isError, advance]);

  const echartSeries = allSeries.map((s, i) => ({
    name: s.name,
    type: "line" as const,
    smooth: true,
    showSymbol: false,
    stack: panel.stack ? "total" : undefined,
    areaStyle: panel.stack ? { opacity: 0.4 } : undefined,
    lineStyle: { width: panel.stack ? 1 : 2 },
    itemStyle: { color: CHART_SERIES_COLORS[i % CHART_SERIES_COLORS.length] },
    data: s.data,
  }));

  return (
    <DashboardPanel
      panel={panel}
      isLoading={multiQuery.isLoading}
      isError={multiQuery.isError}
      error={multiQuery.error instanceof Error ? multiQuery.error.message : undefined}
      hasData={hasData}
      noSource={!hasSource}
    >
      <EChartWrapper
        height="250px"
        option={{
          tooltip: { trigger: "axis" },
          legend: { show: echartSeries.length > 1, bottom: 0, type: "scroll" },
          xAxis: { type: "time" },
          yAxis: { type: "value", name: panel.unit },
          series: echartSeries,
          grid: { left: 60, right: 20, bottom: echartSeries.length > 1 ? 40 : 20, top: 20 },
        }}
      />
    </DashboardPanel>
  );
}

export function DashboardPage() {
  const { tab = "noc" } = useParams<{ tab: string }>();
  const panels = getPanels(tab);
  const activeDatasourceId = useSettingsStore((s) => s.activeDatasourceId);
  const datasourceId = activeDatasourceId ?? undefined;
  const resetSequencer = usePanelSequencerStore((s) => s.reset);

  // Reset the sequencer whenever the tab or datasource changes so panels
  // reload sequentially from the first panel on the new view.
  useEffect(() => {
    resetSequencer();
  }, [tab, datasourceId, resetSequencer]);

  return (
    <div>
      {/* Dashboard tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-border">
        {DASHBOARD_TABS.map(({ id, label }) => (
          <NavLink
            key={id}
            to={`/dashboards/${id}`}
            className={({ isActive }) =>
              clsx(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                isActive
                  ? "border-magenta-500 text-magenta-500"
                  : "border-transparent text-text-muted hover:text-text-primary"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Drill-down filters */}
      <DrillDownBar datasourceId={datasourceId} />

      {/* Panels grid — use 2-col layout for Traffic (matches Grafana 2×12 grid) */}
      <div className={clsx(
        "grid gap-4",
        tab === "traffic"
          ? "grid-cols-1 lg:grid-cols-2"
          : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
      )}>
        {panels.map((panel, i) =>
          panel.targets && panel.targets.length > 0 ? (
            <MultiTargetPanelChart key={panel.id} panel={panel} datasourceId={datasourceId} panelIndex={i} />
          ) : (
            <PanelChart key={panel.id} panel={panel} datasourceId={datasourceId} panelIndex={i} />
          )
        )}
      </div>

      {/* Request / response log */}
      <QueryLogPanel />
    </div>
  );
}
