import { useMemo, useState, useCallback } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, typeBadgeVariant } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { EChartWrapper } from "@/components/charts/EChartWrapper";
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { MetricQuery } from "@metrics-nexus/shared";
import { CHART_SERIES_COLORS } from "@/theme/tokens";
import { TIME_RANGES } from "./promql-builder";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

interface QueryChartProps {
  query: Partial<MetricQuery>;
  datasourceId: number | null;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  compact?: boolean;
}

function getPromBase(datasourceId?: number | null): string {
  if (datasourceId) return `${API_BASE}/api/datasources/${datasourceId}/prom`;
  return `${API_BASE}/api/prom`;
}

function getRangeParams(timeRange: string) {
  const now = Date.now();
  const rangeMs: Record<string, number> = {
    "5m": 5 * 60_000,
    "15m": 15 * 60_000,
    "30m": 30 * 60_000,
    "1h": 60 * 60_000,
    "3h": 3 * 60 * 60_000,
    "6h": 6 * 60 * 60_000,
    "12h": 12 * 60 * 60_000,
    "24h": 24 * 60 * 60_000,
  };
  const duration = rangeMs[timeRange] || 60 * 60_000;
  const start = ((now - duration) / 1000).toFixed(0);
  const end = (now / 1000).toFixed(0);
  const step = Math.max(15, Math.floor(duration / 1000 / 200)).toString();
  return { start, end, step };
}

async function fetchRangeQuery(
  promql: string,
  timeRange: string,
  datasourceId?: number | null
) {
  const base = getPromBase(datasourceId);
  const { start, end, step } = getRangeParams(timeRange);
  const params = new URLSearchParams({ query: promql, start, end, step });
  const res = await fetch(`${base}/query_range?${params}`);
  if (!res.ok) throw new Error(`Prometheus query failed: ${res.status}`);
  return res.json();
}

async function fetchInstantQuery(
  promql: string,
  datasourceId?: number | null
) {
  const base = getPromBase(datasourceId);
  const params = new URLSearchParams({ query: promql });
  const res = await fetch(`${base}/query?${params}`);
  if (!res.ok) throw new Error(`Prometheus query failed: ${res.status}`);
  return res.json();
}

function formatValue(value: number, metricType?: string): string {
  if (metricType === "histogram" || metricType === "summary") {
    return value.toFixed(4) + "s";
  }
  if (value >= 1e9) return (value / 1e9).toFixed(2) + "G";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
  return value.toFixed(metricType === "gauge" ? 1 : 0);
}

function formatLegend(legendFormat: string, metric: Record<string, string>): string {
  return legendFormat.replace(/\{\{(\w+)\}\}/g, (_, key) => metric[key] || "");
}

function buildYAxisFormatter(decimals?: number | null) {
  return (v: number) => {
    const d = decimals != null ? decimals : undefined;
    if (v >= 1e9) return `${(v / 1e9).toFixed(d ?? 1)}G`;
    if (v >= 1e6) return `${(v / 1e6).toFixed(d ?? 1)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(d ?? 1)}K`;
    if (d != null) return v.toFixed(d);
    return v < 1 ? v.toFixed(3) : v.toFixed(0);
  };
}

function StatCard({
  label,
  value,
  trend,
  trendPercent,
}: {
  label: string;
  value: string;
  trend?: number;
  trendPercent?: string;
}) {
  return (
    <div className="rounded-md bg-surface-secondary p-2">
      <p className="text-[10px] text-text-muted mb-0.5">{label}</p>
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold font-mono tabular-nums truncate text-text-primary">
          {value}
        </span>
        {trend !== undefined && (
          <span
            className={clsx(
              "text-[10px] flex items-center gap-0.5",
              trend > 0
                ? "text-green-500"
                : trend < 0
                  ? "text-red-500"
                  : "text-text-muted"
            )}
          >
            {trend > 0 ? (
              <TrendingUp className="w-2.5 h-2.5" />
            ) : trend < 0 ? (
              <TrendingDown className="w-2.5 h-2.5" />
            ) : (
              <Minus className="w-2.5 h-2.5" />
            )}
            {trendPercent}%
          </span>
        )}
      </div>
    </div>
  );
}

interface SeriesItem {
  name: string;
  data: [number, number][];
}

function transformRangeData(
  body: { data?: { result?: Array<{ metric: Record<string, string>; values: [number, string][] }> } },
  legendFormat?: string
): SeriesItem[] {
  const results = body?.data?.result || [];
  return results.map((r) => {
    const labels = { ...r.metric };
    delete labels.__name__;
    const name = legendFormat
      ? formatLegend(legendFormat, r.metric)
      : Object.values(labels).join(", ") || r.metric.__name__ || "value";
    const data = (r.values || []).map(
      (v) => [v[0] * 1000, parseFloat(v[1])] as [number, number]
    );
    return { name, data };
  });
}

function transformInstantData(
  body: { data?: { result?: Array<{ metric: Record<string, string>; value: [number, string] }> } }
) {
  const results = body?.data?.result || [];
  return results.map((r) => {
    const labels = { ...r.metric };
    delete labels.__name__;
    const name =
      Object.values(labels).join(", ") || r.metric.__name__ || "value";
    const value = parseFloat(r.value[1]);
    return { name, value };
  });
}

export function QueryChart({
  query,
  datasourceId,
  isExpanded,
  onToggleExpand,
  compact,
}: QueryChartProps) {
  const [timeRange, setTimeRange] = useState("1h");
  const [refreshKey, setRefreshKey] = useState(0);

  const vizType = query.visualizationType || "line";
  const isPieOrDonut = vizType === "pie" || vizType === "donut";
  const isSparkline = vizType === "sparkline";
  const chartColor = query.color || "#E20074";
  const hasMultiTargets = (query.targets?.length ?? 0) > 0;

  // --- Single-expression queries (original behavior) ---
  const { data: rangeBody } = useQuery({
    queryKey: [
      "qb-range",
      query.expression,
      timeRange,
      datasourceId,
      refreshKey,
    ],
    queryFn: () =>
      fetchRangeQuery(query.expression!, timeRange, datasourceId),
    enabled: !!query.expression && !isPieOrDonut && !hasMultiTargets,
    staleTime: 30_000,
    retry: 1,
  });

  const { data: instantBody } = useQuery({
    queryKey: [
      "qb-instant",
      query.expression,
      datasourceId,
      refreshKey,
    ],
    queryFn: () => fetchInstantQuery(query.expression!, datasourceId),
    enabled: !!query.expression && isPieOrDonut && !hasMultiTargets,
    staleTime: 30_000,
    retry: 1,
  });

  // --- Multi-target queries ---
  const targetQueries = useQueries({
    queries: hasMultiTargets
      ? (query.targets || []).map((target, i) => ({
          queryKey: [
            "qb-multi-range",
            target.expr,
            timeRange,
            datasourceId,
            refreshKey,
            i,
          ],
          queryFn: () => fetchRangeQuery(target.expr, timeRange, datasourceId),
          enabled: !!target.expr,
          staleTime: 30_000,
          retry: 1,
        }))
      : [],
  });

  // Merge multi-target results into a single series array
  const multiTargetSeries = useMemo<SeriesItem[]>(() => {
    if (!hasMultiTargets) return [];
    const allSeries: SeriesItem[] = [];
    const targets = query.targets || [];
    for (let i = 0; i < targetQueries.length; i++) {
      const tq = targetQueries[i];
      if (!tq.data) continue;
      const target = targets[i];
      const series = transformRangeData(tq.data, target?.legendFormat);
      allSeries.push(...series);
    }
    return allSeries;
  }, [hasMultiTargets, query.targets, targetQueries]);

  // Unified series data: either single-query or multi-target
  const seriesData = useMemo<SeriesItem[]>(() => {
    if (hasMultiTargets) return multiTargetSeries;
    return rangeBody ? transformRangeData(rangeBody) : [];
  }, [hasMultiTargets, multiTargetSeries, rangeBody]);

  const pieData = useMemo(
    () => (instantBody ? transformInstantData(instantBody) : []),
    [instantBody]
  );

  // Compute stats from first series
  const stats = useMemo(() => {
    if (seriesData.length === 0 || seriesData[0].data.length === 0) {
      return { current: 0, prev: 0, min: 0, max: 0, avg: 0 };
    }
    const values = seriesData[0].data.map((d) => d[1]);
    const current = values[values.length - 1];
    const prev = values.length > 1 ? values[values.length - 2] : current;
    return {
      current,
      prev,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    };
  }, [seriesData]);

  const trend = stats.current - stats.prev;
  const trendPercent =
    stats.prev !== 0
      ? ((trend / stats.prev) * 100).toFixed(1)
      : "0";

  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  const unitLabel = query.unit && query.unit !== "none" ? query.unit : undefined;

  // Build x-axis label formatter based on xAxisFormat setting
  const xAxisLabelConfig = useMemo(() => {
    const fmt = query.xAxisFormat;
    if (!fmt || fmt === "auto") {
      // Auto: adapt based on selected time range
      const rangeMs: Record<string, number> = {
        "5m": 5 * 60_000, "15m": 15 * 60_000, "30m": 30 * 60_000,
        "1h": 60 * 60_000, "3h": 3 * 60 * 60_000, "6h": 6 * 60 * 60_000,
        "12h": 12 * 60 * 60_000, "24h": 24 * 60 * 60_000,
      };
      const duration = rangeMs[timeRange] || 60 * 60_000;
      if (duration <= 30 * 60_000) {
        // <= 30m: show HH:mm:ss
        return {
          formatter: (value: number) => {
            const d = new Date(value);
            return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
          },
        };
      }
      if (duration <= 24 * 60 * 60_000) {
        // <= 24h: show HH:mm
        return {
          formatter: (value: number) => {
            const d = new Date(value);
            return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
          },
        };
      }
      // > 24h: show MM/dd HH:mm
      return {
        formatter: (value: number) => {
          const d = new Date(value);
          return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        },
      };
    }
    // Explicit format
    const formatMap: Record<string, (d: Date) => string> = {
      "HH:mm": (d) =>
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      "HH:mm:ss": (d) =>
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`,
      "MM/dd HH:mm": (d) =>
        `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      "yyyy-MM-dd": (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      "MM/dd": (d) =>
        `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`,
    };
    const fn = formatMap[fmt];
    return fn ? { formatter: (value: number) => fn(new Date(value)) } : {};
  }, [query.xAxisFormat, timeRange]);

  const buildTimeSeriesOption = useCallback(() => {
    const isStacked = query.stack;

    const series = seriesData.map((s, i) => {
      const base: Record<string, unknown> = {
        name: s.name,
        type: vizType === "scatter" ? "scatter" : "line",
        data: s.data,
        smooth: true,
        showSymbol: vizType === "scatter",
        symbolSize: vizType === "scatter" ? 6 : 0,
        lineStyle: { width: isStacked ? 1 : 2 },
        itemStyle: {
          color: CHART_SERIES_COLORS[i % CHART_SERIES_COLORS.length],
        },
      };

      if (vizType === "area" || isSparkline || isStacked) {
        base.areaStyle = { opacity: isStacked ? 0.4 : 0.15 };
      }

      if (isStacked) {
        base.stack = "total";
      }

      if (vizType === "bar") {
        base.type = "bar";
        delete base.smooth;
        delete base.showSymbol;
        if (isStacked) base.stack = "total";
      }

      return base;
    });

    const opt: Record<string, unknown> = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        textStyle: { fontSize: 11 },
      },
      grid: isSparkline
        ? { top: 4, right: 4, bottom: 4, left: 4 }
        : { top: 10, right: 20, bottom: 30, left: 50 },
      xAxis: {
        type: "time",
        show: !isSparkline,
        axisLine: { lineStyle: { color: "var(--border)" } },
        axisLabel: { fontSize: 10, color: "var(--text-muted)", ...xAxisLabelConfig },
      },
      yAxis: {
        type: "value",
        show: !isSparkline,
        name: unitLabel,
        nameTextStyle: { fontSize: 10, color: "var(--text-muted)" },
        splitLine: { lineStyle: { color: "var(--border)", opacity: 0.3 } },
        axisLabel: {
          fontSize: 10,
          color: "var(--text-muted)",
          formatter: buildYAxisFormatter(query.decimals),
        },
      },
      series,
    };

    if (seriesData.length > 1 && !isSparkline) {
      opt.legend = {
        bottom: 0,
        type: "scroll",
        textStyle: { fontSize: 10, color: "var(--text-muted)" },
      };
      (opt.grid as Record<string, unknown>).bottom = 45;
    }

    return opt;
  }, [seriesData, vizType, chartColor, isSparkline, query.stack, unitLabel, query.decimals, xAxisLabelConfig]);

  const buildPieOption = useCallback(() => {
    const isDonut = vizType === "donut";
    return {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
        textStyle: { fontSize: 11 },
      },
      legend: compact
        ? undefined
        : {
            orient: "horizontal" as const,
            bottom: 0,
            textStyle: { fontSize: 10, color: "var(--text-muted)" },
          },
      series: [
        {
          type: "pie",
          radius: isDonut
            ? [compact ? "35%" : "45%", compact ? "65%" : "80%"]
            : [0, compact ? "65%" : "80%"],
          center: ["50%", compact ? "50%" : "45%"],
          data: pieData.map((d, i) => ({
            name: d.name,
            value: d.value,
            itemStyle: {
              color: CHART_SERIES_COLORS[i % CHART_SERIES_COLORS.length],
            },
          })),
          label: compact
            ? { show: false }
            : {
                formatter: "{b}\n{d}%",
                fontSize: 10,
                color: "var(--text-primary)",
              },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
          },
        },
      ],
    };
  }, [pieData, vizType, compact]);

  const chartHeight = compact
    ? "80px"
    : isExpanded
      ? "400px"
      : "220px";

  // Target count badge text
  const targetCount = hasMultiTargets ? query.targets!.length : 0;

  // Compact card view
  if (compact) {
    const compactValue = isPieOrDonut
      ? formatValue(pieTotal)
      : seriesData.length > 0 && seriesData[0].data.length > 0
        ? formatValue(
            seriesData[0].data[seriesData[0].data.length - 1][1],
            query.metricType
          )
        : "—";

    return (
      <Card className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: chartColor }}
            />
            <h4 className="text-xs font-semibold truncate text-text-primary">
              {query.name || query.metricName || "Metric"}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            {targetCount > 1 && (
              <Badge variant="magenta" className="text-[9px] shrink-0">
                {targetCount} targets
              </Badge>
            )}
            <Badge variant="default" className="text-[9px] shrink-0">
              {vizType}
            </Badge>
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="shrink-0">
            <p className="text-lg font-bold font-mono tabular-nums text-text-primary">
              {compactValue}
            </p>
            {!isPieOrDonut && trend !== 0 && (
              <span
                className={clsx(
                  "text-[10px] flex items-center gap-0.5",
                  trend > 0
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {trend > 0 ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                {trendPercent}%
              </span>
            )}
          </div>
          <div className="flex-1 h-[60px]">
            <EChartWrapper
              option={isPieOrDonut ? buildPieOption() : buildTimeSeriesOption()}
              height="60px"
            />
          </div>
        </div>
        <p className="text-[9px] font-mono text-text-muted truncate mt-1.5">
          {query.expression}
        </p>
      </Card>
    );
  }

  // Full card view
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: chartColor }}
          />
          <h4 className="text-sm font-semibold truncate text-text-primary">
            {query.name || query.metricName || "Metric Query"}
          </h4>
          <Badge
            variant={typeBadgeVariant(query.metricType || "counter")}
            className="text-[10px] shrink-0"
          >
            {query.metricType}
          </Badge>
          {targetCount > 1 && (
            <Badge variant="magenta" className="text-[9px] shrink-0">
              {targetCount} targets
            </Badge>
          )}
          {unitLabel && (
            <Badge variant="default" className="text-[9px] shrink-0">
              {unitLabel}
            </Badge>
          )}
          {query.stack && (
            <Badge variant="default" className="text-[9px] shrink-0">
              stacked
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!isPieOrDonut && !isSparkline && (
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={TIME_RANGES.map((r) => ({
                value: r.value,
                label: r.label,
              }))}
              className="w-[70px] text-xs py-1"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRefreshKey((k) => k + 1)}
            title="Refresh data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          {onToggleExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      {!isPieOrDonut && !isSparkline && seriesData.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-3">
          <StatCard
            label="Current"
            value={formatValue(stats.current, query.metricType)}
            trend={trend}
            trendPercent={trendPercent}
          />
          <StatCard
            label="Average"
            value={formatValue(stats.avg, query.metricType)}
          />
          <StatCard
            label="Min"
            value={formatValue(stats.min, query.metricType)}
          />
          <StatCard
            label="Max"
            value={formatValue(stats.max, query.metricType)}
          />
        </div>
      )}

      {isPieOrDonut && pieData.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          <StatCard label="Total" value={formatValue(pieTotal)} />
          <StatCard label="Segments" value={String(pieData.length)} />
          <StatCard
            label="Largest"
            value={
              pieData.length > 0
                ? pieData.reduce((a, b) => (a.value > b.value ? a : b)).name
                : "—"
            }
          />
        </div>
      )}

      {isSparkline && seriesData.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          <StatCard
            label="Latest"
            value={formatValue(stats.current, query.metricType)}
          />
          <StatCard
            label="Min"
            value={formatValue(stats.min, query.metricType)}
          />
          <StatCard
            label="Max"
            value={formatValue(stats.max, query.metricType)}
          />
        </div>
      )}

      {/* Chart */}
      <EChartWrapper
        option={isPieOrDonut ? buildPieOption() : buildTimeSeriesOption()}
        height={chartHeight}
      />

      <div className="mt-2 px-1">
        <p className="text-[10px] font-mono text-text-muted truncate">
          {hasMultiTargets
            ? `${targetCount} targets — ${query.targets!.map((t) => t.legendFormat || t.expr.slice(0, 30)).join(", ")}`
            : query.expression}
        </p>
      </div>
    </Card>
  );
}

export function DashboardCards({
  charts,
  datasourceId,
}: {
  charts: Partial<MetricQuery>[];
  datasourceId: number | null;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {charts.map((chart, i) => (
        <QueryChart
          key={`${chart.expression}-${i}`}
          query={chart}
          datasourceId={datasourceId}
          compact
        />
      ))}
    </div>
  );
}
