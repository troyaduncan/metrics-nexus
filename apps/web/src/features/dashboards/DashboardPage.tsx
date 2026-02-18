import { useParams, NavLink } from "react-router-dom";
import { clsx } from "clsx";
import { DrillDownBar } from "./shared/DrillDownBar";
import { DashboardPanel } from "./shared/DashboardPanel";
import type { PanelDefinition } from "./shared/DashboardPanel";
import { EChartWrapper } from "@/components/charts/EChartWrapper";
import { usePromRangeQuery, usePromQuery } from "@/lib/hooks/use-prom-query";
import { CHART_COLORS, CHART_SERIES_COLORS } from "@/theme/tokens";
import { nocPanels } from "./noc/panels";
import { srePanels } from "./sre/panels";
import { engPanels } from "./eng/panels";

const DASHBOARD_TABS = [
  { id: "noc", label: "NOC Overview" },
  { id: "sre", label: "SRE / SLO" },
  { id: "eng", label: "Engineering" },
];

function getPanels(tab: string): PanelDefinition[] {
  switch (tab) {
    case "noc": return nocPanels;
    case "sre": return srePanels;
    case "eng": return engPanels;
    default: return nocPanels;
  }
}

function PanelChart({ panel }: { panel: PanelDefinition }) {
  const rangeQuery = usePromRangeQuery(panel.promql, panel.chartType === "timeseries");
  const instantQuery = usePromQuery(panel.promql, panel.chartType !== "timeseries");

  const isTimeseries = panel.chartType === "timeseries";
  const query = isTimeseries ? rangeQuery : instantQuery;
  const hasData = query.data?.data?.result?.length > 0;

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

  // timeseries
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

export function DashboardPage() {
  const { tab = "noc" } = useParams<{ tab: string }>();
  const panels = getPanels(tab);

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
      <DrillDownBar />

      {/* Panels grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {panels.map((panel) => (
          <PanelChart key={panel.id} panel={panel} />
        ))}
      </div>
    </div>
  );
}
