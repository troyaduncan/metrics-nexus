import { useState, useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { CopyButton } from "@/components/ui/CopyButton";
import { datasourceApi } from "@/lib/api/datasources";
import {
  QUERY_METRIC_TYPES,
  VISUALIZATION_TYPES,
  COMMON_LABELS,
  QUERY_BUILDER_COLORS,
  UNIT_TYPES,
  X_AXIS_FORMATS,
  type MetricQuery,
  type QueryTarget,
} from "@metrics-nexus/shared";
import { MetricSearchDropdown } from "./MetricSearchDropdown";
import {
  buildPromQLExpression,
  INNER_FUNCTIONS,
  OUTER_FUNCTIONS,
  LABEL_OPERATORS,
  type LabelOperator,
} from "./promql-builder";
import {
  Plus,
  X,
  Play,
  Save,
  Code,
  Palette,
  Tag,
  Activity,
  BarChart3,
  LineChart,
  ScatterChart,
  AreaChart,
  Search,
  ChevronDown,
  Zap,
  Hash,
  Database,
  Braces,
  PieChart,
  Circle,
  TrendingUp,
  Sigma,
  Calculator,
  Layers,
  Target,
  Ruler,
  ToggleLeft,
  ToggleRight,
  GripVertical,
} from "lucide-react";

const queryFormSchema = z.object({
  name: z.string().min(1, "Query name is required"),
  description: z.string().optional(),
  metricName: z.string().min(1, "Metric name is required"),
  metricType: z.string().min(1),
  innerFunction: z.string().optional(),
  outerFunction: z.string().optional(),
  groupBy: z.string().optional(),
  range: z.string().optional(),
  mathExpr: z.string().optional(),
  quantile: z.string().optional(),
  visualizationType: z.string().min(1),
  color: z.string().min(1),
  unit: z.string().optional(),
  stack: z.boolean().optional(),
  decimals: z.string().optional(),
  xAxisFormat: z.string().optional(),
});

type QueryFormValues = z.infer<typeof queryFormSchema>;

interface InitialMetric {
  metricName: string;
  metricType: string;
  metricLabels: string[];
}

interface QueryBuilderFormProps {
  datasourceId: number | null;
  onExecute: (query: Partial<MetricQuery>) => void;
  onSave: (query: Partial<MetricQuery>) => void;
  editingQuery?: MetricQuery | null;
  initialMetric?: InitialMetric | null;
  isSaving?: boolean;
}

const vizIcons: Record<string, React.ReactNode> = {
  line: <LineChart className="w-4 h-4" />,
  area: <AreaChart className="w-4 h-4" />,
  bar: <BarChart3 className="w-4 h-4" />,
  scatter: <ScatterChart className="w-4 h-4" />,
  pie: <PieChart className="w-4 h-4" />,
  donut: <Circle className="w-4 h-4" />,
  sparkline: <TrendingUp className="w-4 h-4" />,
};

/** Format a label value for display, showing its operator */
function formatLabelDisplay(key: string, raw: string): string {
  let op = "=";
  let val = raw;
  if (val.startsWith("=~")) { op = "=~"; val = val.slice(2); }
  else if (val.startsWith("!~")) { op = "!~"; val = val.slice(2); }
  else if (val.startsWith("!=")) { op = "!="; val = val.slice(2); }
  return `${key}${op}"${val}"`;
}

function JsonPreview({
  query,
  expression,
  labels,
}: {
  query: Partial<MetricQuery>;
  expression: string;
  labels: Record<string, string>;
}) {
  const [collapsed, setCollapsed] = useState(true);

  const jsonObj = useMemo(
    () => ({
      name: query.name || "",
      description: query.description || null,
      expression,
      metric: {
        name: query.metricName || "",
        type: query.metricType || "counter",
      },
      labels: Object.keys(labels).length > 0 ? labels : {},
      aggregation: query.aggregation || null,
      range: query.range || null,
      visualization: {
        type: query.visualizationType || "line",
        color: query.color || QUERY_BUILDER_COLORS[0],
      },
    }),
    [query, expression, labels]
  );

  const jsonStr = JSON.stringify(jsonObj, null, 2);

  return (
    <Card className="p-3 bg-surface-secondary">
      <div className="flex items-center justify-between mb-1">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          <Braces className="w-3.5 h-3.5" />
          <span>JSON Representation</span>
          <ChevronDown
            className={clsx(
              "w-3 h-3 transition-transform",
              collapsed && "-rotate-90"
            )}
          />
        </button>
        {!collapsed && <CopyButton text={jsonStr} />}
      </div>
      {!collapsed && (
        <pre className="font-mono text-xs p-3 bg-surface rounded-md border border-border text-text-primary overflow-x-auto max-h-[300px] overflow-y-auto">
          {jsonStr}
        </pre>
      )}
    </Card>
  );
}

export function QueryBuilderForm({
  datasourceId,
  onExecute,
  onSave,
  editingQuery,
  initialMetric,
  isSaving,
}: QueryBuilderFormProps) {
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [newLabelKey, setNewLabelKey] = useState("");
  const [newLabelValue, setNewLabelValue] = useState("");
  const [newLabelOp, setNewLabelOp] = useState<LabelOperator>("=");
  const [labelPopoverOpen, setLabelPopoverOpen] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<QueryTarget[]>([]);
  const [extraLabelKeys, setExtraLabelKeys] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<QueryFormValues>({
    resolver: zodResolver(queryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      metricName: "",
      metricType: "counter",
      innerFunction: "none",
      outerFunction: "none",
      groupBy: "",
      range: "none",
      mathExpr: "",
      quantile: "0.95",
      visualizationType: "line",
      color: QUERY_BUILDER_COLORS[0],
      unit: "none",
      stack: false,
      decimals: "",
      xAxisFormat: "auto",
    },
  });

  useEffect(() => {
    if (editingQuery) {
      // Try to decompose the saved aggregation back into inner/outer
      const agg = editingQuery.aggregation || "";
      let innerFn = "none";
      let outerFn = "none";
      if (agg.includes("(")) {
        // e.g. "sum(increase)" stored as combo
        const match = agg.match(/^(\w+)\((\w+)\)$/);
        if (match) {
          outerFn = match[1];
          innerFn = match[2];
        }
      } else if (INNER_FUNCTIONS.includes(agg as typeof INNER_FUNCTIONS[number])) {
        innerFn = agg;
      } else if (OUTER_FUNCTIONS.includes(agg as typeof OUTER_FUNCTIONS[number])) {
        outerFn = agg;
      } else if (agg) {
        // Fallback: treat unknown as outer
        outerFn = agg;
      }

      reset({
        name: editingQuery.name,
        description: editingQuery.description || "",
        metricName: editingQuery.metricName,
        metricType: editingQuery.metricType,
        innerFunction: innerFn,
        outerFunction: outerFn,
        groupBy: "",
        range: editingQuery.range || "none",
        mathExpr: "",
        quantile: "0.95",
        visualizationType: editingQuery.visualizationType,
        color: editingQuery.color || QUERY_BUILDER_COLORS[0],
        unit: editingQuery.unit || "none",
        stack: editingQuery.stack || false,
        decimals: editingQuery.decimals != null ? String(editingQuery.decimals) : "",
        xAxisFormat: editingQuery.xAxisFormat || "auto",
      });
      setLabels(editingQuery.labels || {});
      setTargets(editingQuery.targets || []);
    }
  }, [editingQuery, reset]);

  // Pre-populate from catalog metric (initialMetric from navigation state)
  useEffect(() => {
    if (initialMetric && !editingQuery) {
      setValue("metricName", initialMetric.metricName);
      setValue("metricType", initialMetric.metricType);
      setExtraLabelKeys(initialMetric.metricLabels || []);
      setLabels({});
      setTargets([]);
    }
  }, [initialMetric, editingQuery, setValue]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (labelRef.current && !labelRef.current.contains(e.target as Node)) {
        setLabelPopoverOpen(false);
      }
    }
    if (labelPopoverOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [labelPopoverOpen]);

  const metricName = watch("metricName");

  // Fetch extended metrics to get label keys for the selected metric
  const { data: extendedMetrics } = useQuery({
    queryKey: ["datasource-extended-metrics", datasourceId],
    queryFn: () => datasourceApi.getMetrics(datasourceId!, true),
    enabled: !!datasourceId,
    staleTime: 120_000,
  });

  // Update extra label keys when metric selection changes (from dropdown)
  useEffect(() => {
    if (!metricName || !extendedMetrics) return;
    // Don't overwrite if initialMetric already set the labels for this metric
    if (initialMetric?.metricName === metricName && extraLabelKeys.length > 0) return;
    const info = extendedMetrics.find((m) => m.name === metricName);
    if (info?.labels && info.labels.length > 0) {
      setExtraLabelKeys(info.labels);
    }
  }, [metricName, extendedMetrics]);

  const innerFunction = watch("innerFunction");
  const outerFunction = watch("outerFunction");
  const groupBy = watch("groupBy");
  const range = watch("range");
  const mathExpr = watch("mathExpr");
  const quantile = watch("quantile");

  const expression = buildPromQLExpression(
    metricName || "metric_name",
    labels,
    {
      innerFunction:
        innerFunction && innerFunction !== "none"
          ? innerFunction
          : undefined,
      outerFunction:
        outerFunction && outerFunction !== "none"
          ? outerFunction
          : undefined,
      groupBy: groupBy
        ? groupBy
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      range: range && range !== "none" ? range : undefined,
      mathExpr: mathExpr || undefined,
      quantile: quantile || undefined,
    }
  );

  // Store aggregation as combo string for backward compat
  const aggregationCombo = (() => {
    const inner =
      innerFunction && innerFunction !== "none" ? innerFunction : "";
    const outer =
      outerFunction && outerFunction !== "none" ? outerFunction : "";
    if (outer && inner) return `${outer}(${inner})`;
    return outer || inner || undefined;
  })();

  const buildQuery = (values: QueryFormValues): Partial<MetricQuery> => {
    // Build the effective targets list.
    // Filter out targets with empty expressions (they can't be queried).
    const effectiveTargets: QueryTarget[] = targets
      .map((t, i) => ({
        ...t,
        // First target always uses the live builder expression
        expr: i === 0 ? expression : t.expr,
      }))
      .filter((t) => t.expr.trim() !== "");

    return {
      name: values.name || values.metricName || "Untitled Query",
      description: values.description || undefined,
      expression,
      metricName: values.metricName,
      metricType: values.metricType,
      labels,
      aggregation: aggregationCombo,
      range:
        values.range && values.range !== "none" ? values.range : undefined,
      visualizationType: values.visualizationType,
      color: values.color,
      datasourceId,
      targets: effectiveTargets,
      unit: values.unit && values.unit !== "none" ? values.unit : undefined,
      stack: values.stack || false,
      decimals: values.decimals ? parseInt(values.decimals, 10) : undefined,
      xAxisFormat: values.xAxisFormat && values.xAxisFormat !== "auto" ? values.xAxisFormat : undefined,
    };
  };

  const handleAddLabel = () => {
    if (newLabelKey && newLabelValue) {
      // Prefix value with operator if not exact match
      const storedValue =
        newLabelOp === "=" ? newLabelValue : `${newLabelOp}${newLabelValue}`;
      setLabels((prev) => ({ ...prev, [newLabelKey]: storedValue }));
      setNewLabelKey("");
      setNewLabelValue("");
      setNewLabelOp("=");
      setLabelPopoverOpen(false);
    }
  };

  const removeLabel = (key: string) => {
    setLabels((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleReset = () => {
    reset({
      name: "",
      description: "",
      metricName: "",
      metricType: "counter",
      innerFunction: "none",
      outerFunction: "none",
      groupBy: "",
      range: "none",
      mathExpr: "",
      quantile: "0.95",
      visualizationType: "line",
      color: QUERY_BUILDER_COLORS[0],
      unit: "none",
      stack: false,
      decimals: "",
      xAxisFormat: "auto",
    });
    setLabels({});
    setTargets([]);
    setExtraLabelKeys([]);
  };

  const handleExecuteClick = () => {
    const values = getValues();
    if (!values.metricName) return;
    onExecute(buildQuery(values));
  };

  const onSubmit = (values: QueryFormValues) => {
    onSave(buildQuery(values));
  };

  const showGroupBy =
    outerFunction &&
    outerFunction !== "none" &&
    outerFunction !== "histogram_quantile";
  const showQuantile = outerFunction === "histogram_quantile";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 rounded-full bg-magenta-500 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-text-muted">
            Query Builder
          </h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
        >
          Clear
        </Button>
      </div>

      {/* Name + Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-text-muted font-medium mb-1 block">
            Query Name
          </label>
          <Input
            placeholder="e.g., Total Incoming Traffic TPS"
            className="text-sm"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs text-text-muted font-medium mb-1 block">
            Description
          </label>
          <Input
            placeholder="Optional description..."
            className="text-sm"
            {...register("description")}
          />
        </div>
      </div>

      {/* Metric + Type */}
      <Card className="p-3 bg-surface-secondary">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          {/* Metric Name */}
          <div>
            <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
              <Search className="w-3 h-3" />
              Metric Name
            </label>
            <Controller
              control={control}
              name="metricName"
              render={({ field }) => (
                <MetricSearchDropdown
                  value={field.value}
                  onChange={(name, type) => {
                    field.onChange(name);
                    setValue("metricType", type);
                  }}
                  datasourceId={datasourceId}
                />
              )}
            />
            {errors.metricName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.metricName.message}
              </p>
            )}
          </div>

          {/* Metric Type */}
          <div className="w-36">
            <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              Metric Type
            </label>
            <Controller
              control={control}
              name="metricType"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={QUERY_METRIC_TYPES.map((t) => ({
                    value: t,
                    label: t.charAt(0).toUpperCase() + t.slice(1),
                  }))}
                />
              )}
            />
          </div>
        </div>

        {/* Labels */}
        <div className="mt-3">
          <label className="text-xs text-text-muted font-medium flex items-center gap-1.5 mb-2">
            <Tag className="w-3 h-3" />
            Labels
          </label>
          <div className="flex flex-wrap gap-1.5 items-center">
            {Object.entries(labels).map(([key, value]) => (
              <span key={key} title={formatLabelDisplay(key, value)}>
                <Badge
                  variant="default"
                  className="text-xs font-mono gap-1 pr-1"
                >
                  {formatLabelDisplay(key, value)}
                  <button
                    type="button"
                    onClick={() => removeLabel(key)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-surface-tertiary"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              </span>
            ))}
            <div ref={labelRef} className="relative">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setLabelPopoverOpen(!labelPopoverOpen)}
                className="gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Label
              </Button>
              {labelPopoverOpen && (
                <div className="absolute z-50 mt-1 w-80 rounded-lg border border-border bg-surface shadow-lg p-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-text-muted block mb-1">
                        Label Key
                      </label>
                      <Select
                        value={newLabelKey}
                        onChange={(e) => setNewLabelKey(e.target.value)}
                        options={[
                          // Metric-specific labels first (from catalog/live data)
                          ...extraLabelKeys
                            .filter((l) => !(COMMON_LABELS as readonly string[]).includes(l))
                            .map((l) => ({ value: l, label: l })),
                          // Then common labels
                          ...COMMON_LABELS.map((l) => ({
                            value: l,
                            label: l,
                          })),
                        ]}
                        placeholder="Select label..."
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-muted block mb-1">
                        Match Type
                      </label>
                      <Select
                        value={newLabelOp}
                        onChange={(e) =>
                          setNewLabelOp(e.target.value as LabelOperator)
                        }
                        options={LABEL_OPERATORS.map((op) => ({
                          value: op,
                          label:
                            op === "="
                              ? "= (exact)"
                              : op === "=~"
                                ? "=~ (regex)"
                                : op === "!="
                                  ? "!= (not equal)"
                                  : "!~ (not regex)",
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted block mb-1">
                      Label Value
                    </label>
                    <Input
                      placeholder={
                        newLabelOp === "=~" || newLabelOp === "!~"
                          ? "e.g., EricssonCharging-Ro-Gy-.*"
                          : "e.g., production"
                      }
                      value={newLabelValue}
                      onChange={(e) => setNewLabelValue(e.target.value)}
                      className="text-xs font-mono"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddLabel();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    onClick={handleAddLabel}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Functions: Inner + Outer + Group By */}
      <Card className="p-3 bg-surface-secondary">
        <div className="flex items-center gap-1.5 mb-3">
          <Sigma className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-medium text-text-muted">
            Functions
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Inner Function */}
          <div>
            <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              Inner Function
            </label>
            <Controller
              control={control}
              name="innerFunction"
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={[
                    { value: "none", label: "None" },
                    ...INNER_FUNCTIONS.map((f) => ({
                      value: f,
                      label: `${f}()`,
                    })),
                  ]}
                />
              )}
            />
            <p className="text-[10px] text-text-muted mt-0.5">
              rate, increase, irate, delta...
            </p>
          </div>

          {/* Outer Function */}
          <div>
            <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              Outer Function
            </label>
            <Controller
              control={control}
              name="outerFunction"
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={[
                    { value: "none", label: "None" },
                    ...OUTER_FUNCTIONS.map((f) => ({
                      value: f,
                      label: `${f}()`,
                    })),
                  ]}
                />
              )}
            />
            <p className="text-[10px] text-text-muted mt-0.5">
              sum, avg, min, max, histogram_quantile...
            </p>
          </div>

          {/* Group By (shown when outer function is selected) */}
          {showGroupBy && (
            <div>
              <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                Group By
              </label>
              <Input
                placeholder="e.g., code, operation, requestname"
                className="text-xs font-mono"
                {...register("groupBy")}
              />
              <p className="text-[10px] text-text-muted mt-0.5">
                Comma-separated label names
              </p>
            </div>
          )}

          {/* Quantile (shown when histogram_quantile is selected) */}
          {showQuantile && (
            <div>
              <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" />
                Quantile
              </label>
              <Input
                placeholder="0.95"
                className="text-xs font-mono"
                {...register("quantile")}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Range, Math, Visualization, Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Time Range */}
        <div>
          <label className="text-xs text-text-muted font-medium mb-1 block">
            Time Range
          </label>
          <Controller
            control={control}
            name="range"
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onChange={(e) => field.onChange(e.target.value)}
                options={[
                  { value: "none", label: "No range" },
                  ...["1m", "5m", "15m", "30m", "1h", "2h", "6h", "12h", "24h"].map(
                    (r) => ({ value: r, label: `[${r}]` })
                  ),
                ]}
              />
            )}
          />
        </div>

        {/* Math Expression */}
        <div>
          <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
            <Calculator className="w-3 h-3" />
            Math
          </label>
          <Input
            placeholder="e.g., / 60"
            className="text-xs font-mono"
            {...register("mathExpr")}
          />
        </div>

        {/* Visualization Type */}
        <div>
          <label className="text-xs text-text-muted font-medium mb-1 block">
            Visualization
          </label>
          <Controller
            control={control}
            name="visualizationType"
            render={({ field }) => (
              <div className="flex gap-1">
                {VISUALIZATION_TYPES.map((viz) => (
                  <button
                    key={viz}
                    type="button"
                    title={`${viz} chart`}
                    onClick={() => field.onChange(viz)}
                    className={clsx(
                      "p-2 rounded-lg border transition-colors",
                      field.value === viz
                        ? "border-magenta-500 bg-magenta-500/10 text-magenta-500"
                        : "border-border text-text-muted hover:border-magenta-500/50 hover:text-text-primary"
                    )}
                  >
                    {vizIcons[viz]}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Color */}
        <div>
          <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
            <Palette className="w-3 h-3" />
            Color
          </label>
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <div className="flex gap-1 flex-wrap">
                {QUERY_BUILDER_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => field.onChange(c)}
                    className={clsx(
                      "w-7 h-7 rounded-md border-2 transition-all",
                      field.value === c
                        ? "border-text-primary scale-110"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          />
        </div>
      </div>

      {/* PromQL Expression Preview */}
      <Card className="p-3 bg-surface-secondary">
        <div className="flex items-center gap-2 mb-1">
          <Code className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-medium text-text-muted">
            PromQL Expression
          </span>
          <CopyButton text={expression} />
        </div>
        <div className="font-mono text-sm p-2 bg-surface rounded-md border border-border text-text-primary break-all">
          {expression}
        </div>
      </Card>

      {/* Panel Targets — multi-metric support */}
      <Card className="p-3 bg-surface-secondary">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs font-medium text-text-muted">
              Panel Targets
            </span>
            {targets.length > 0 && (
              <Badge variant="magenta" className="text-[9px] px-1.5">
                {targets.length}
              </Badge>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              setTargets((prev) => [
                ...prev,
                { expr: prev.length === 0 ? expression : "", legendFormat: "" },
              ])
            }
            className="gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Target
          </Button>
        </div>

        {targets.length === 0 ? (
          <p className="text-xs text-text-muted">
            Add targets to define multiple metrics on the same panel. The first target auto-syncs with the builder expression above.
          </p>
        ) : (
          <div className="space-y-2">
            {targets.map((target, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg border border-border bg-surface p-2"
              >
                <div className="flex items-center gap-1 pt-1.5 text-text-muted">
                  <GripVertical className="w-3 h-3" />
                  <span className="text-[10px] font-mono w-4 text-center">
                    {String.fromCharCode(65 + idx)}
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div>
                    <label className="text-[10px] text-text-muted block mb-0.5">
                      PromQL Expression
                    </label>
                    {idx === 0 ? (
                      <>
                        <div className="font-mono text-xs p-2 bg-surface rounded-md border border-border text-text-secondary break-all">
                          {expression}
                        </div>
                        <p className="text-[9px] text-text-muted mt-0.5">
                          Synced from builder fields above
                        </p>
                      </>
                    ) : (
                      <Input
                        placeholder="e.g., sum(increase(metric_name{...}[1m])) / 60"
                        className="text-xs font-mono"
                        value={target.expr}
                        onChange={(e) =>
                          setTargets((prev) =>
                            prev.map((t, i) =>
                              i === idx ? { ...t, expr: e.target.value } : t
                            )
                          )
                        }
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-text-muted block mb-0.5">
                      Legend Format
                    </label>
                    <Input
                      placeholder='e.g., "NCHF Charging" or "{{instanceName}} | {{code}}"'
                      className="text-xs font-mono"
                      value={target.legendFormat || ""}
                      onChange={(e) =>
                        setTargets((prev) =>
                          prev.map((t, i) =>
                            i === idx
                              ? { ...t, legendFormat: e.target.value }
                              : t
                          )
                        )
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setTargets((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="p-1 rounded hover:bg-surface-tertiary text-text-muted mt-1"
                  title="Remove target"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Panel Settings — unit, decimals, stacking */}
      <Card className="p-3 bg-surface-secondary">
        <div className="flex items-center gap-1.5 mb-3">
          <Ruler className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs font-medium text-text-muted">
            Panel Settings
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Y-Axis Unit */}
          <div>
            <label className="text-xs text-text-muted font-medium mb-1 block">
              Y-Axis Unit
            </label>
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={UNIT_TYPES.map((u) => ({
                    value: u,
                    label: u === "none" ? "None" : u,
                  }))}
                />
              )}
            />
          </div>

          {/* Decimals */}
          <div>
            <label className="text-xs text-text-muted font-medium mb-1 block">
              Decimals
            </label>
            <Input
              type="number"
              placeholder="Auto"
              className="text-xs"
              min={0}
              max={6}
              {...register("decimals")}
            />
          </div>

          {/* Stacking */}
          <div>
            <label className="text-xs text-text-muted font-medium mb-1 block">
              Stacking
            </label>
            <Controller
              control={control}
              name="stack"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors w-full",
                    field.value
                      ? "border-magenta-500 bg-magenta-500/10 text-magenta-500"
                      : "border-border text-text-muted hover:border-magenta-500/50"
                  )}
                >
                  {field.value ? (
                    <ToggleRight className="w-4 h-4" />
                  ) : (
                    <ToggleLeft className="w-4 h-4" />
                  )}
                  <span className="text-xs">
                    {field.value ? "Stacked" : "Off"}
                  </span>
                </button>
              )}
            />
          </div>

          {/* X-Axis Format */}
          <div>
            <label className="text-xs text-text-muted font-medium mb-1 block">
              X-Axis Format
            </label>
            <Controller
              control={control}
              name="xAxisFormat"
              render={({ field }) => (
                <Select
                  value={field.value || "auto"}
                  onChange={(e) => field.onChange(e.target.value)}
                  options={X_AXIS_FORMATS.map((f) => ({
                    value: f.value,
                    label: f.label,
                  }))}
                />
              )}
            />
          </div>
        </div>
      </Card>

      {/* JSON Preview */}
      <JsonPreview
        query={buildQuery(getValues())}
        expression={expression}
        labels={labels}
      />

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleExecuteClick}
          disabled={!metricName}
        >
          <Play className="w-3.5 h-3.5" />
          Run Query
        </Button>
        <Button type="submit" disabled={!metricName || isSaving}>
          <Save className="w-3.5 h-3.5" />
          {editingQuery ? "Update" : "Save"} Query
        </Button>
      </div>
    </form>
  );
}
