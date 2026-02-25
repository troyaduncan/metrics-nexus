import { useState, useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { CopyButton } from "@/components/ui/CopyButton";
import { datasourceApi } from "@/lib/api/datasources";
import {
  QUERY_METRIC_TYPES,
  COMMON_LABELS,
  QUERY_BUILDER_COLORS,
  type MetricTarget,
} from "@metrics-nexus/shared";
import { MetricSearchDropdown } from "@/features/query-builder/MetricSearchDropdown";
import {
  buildPromQLExpression,
  INNER_FUNCTIONS,
  OUTER_FUNCTIONS,
  LABEL_OPERATORS,
  type LabelOperator,
} from "../query-builder/promql-builder";
import {
  Plus,
  X,
  Play,
  Save,
  Code,
  Palette,
  Tag,
  Activity,
  Search,
  Zap,
  Hash,
  Sigma,
  Calculator,
  Layers,
} from "lucide-react";

const targetFormSchema = z.object({
  name: z.string().min(1, "Target name is required"),
  description: z.string().optional(),
  metricName: z.string().min(1, "Metric name is required"),
  metricType: z.string().min(1),
  innerFunction: z.string().optional(),
  outerFunction: z.string().optional(),
  groupBy: z.string().optional(),
  range: z.string().optional(),
  mathExpr: z.string().optional(),
  quantile: z.string().optional(),
  legendFormat: z.string().optional(),
  refId: z.string().optional(),
  color: z.string().min(1),
});

type TargetFormValues = z.infer<typeof targetFormSchema>;

interface InitialMetric {
  metricName: string;
  metricType: string;
  metricLabels: string[];
}

interface TargetBuilderFormProps {
  datasourceId: number | null;
  onExecute: (target: Partial<MetricTarget>) => void;
  onSave: (target: Partial<MetricTarget>) => void;
  editingTarget?: MetricTarget | null;
  initialMetric?: InitialMetric | null;
  isSaving?: boolean;
}

/** Format a label value for display, showing its operator */
function formatLabelDisplay(key: string, raw: string): string {
  let op = "=";
  let val = raw;
  if (val.startsWith("=~")) {
    op = "=~";
    val = val.slice(2);
  } else if (val.startsWith("!~")) {
    op = "!~";
    val = val.slice(2);
  } else if (val.startsWith("!=")) {
    op = "!=";
    val = val.slice(2);
  }
  return `${key}${op}"${val}"`;
}

export function TargetBuilderForm({
  datasourceId,
  onExecute,
  onSave,
  editingTarget,
  initialMetric,
  isSaving,
}: TargetBuilderFormProps) {
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [newLabelKey, setNewLabelKey] = useState("");
  const [newLabelValue, setNewLabelValue] = useState("");
  const [newLabelOp, setNewLabelOp] = useState<LabelOperator>("=");
  const [labelPopoverOpen, setLabelPopoverOpen] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
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
  } = useForm<TargetFormValues>({
    resolver: zodResolver(targetFormSchema),
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
      legendFormat: "",
      refId: "",
      color: QUERY_BUILDER_COLORS[0],
    },
  });

  // Restore fields when editing an existing target
  useEffect(() => {
    if (editingTarget) {
      const agg = editingTarget.aggregation || "";
      let innerFn = "none";
      let outerFn = "none";
      if (agg.includes("(")) {
        const match = agg.match(/^(\w+)\((\w+)\)$/);
        if (match) {
          outerFn = match[1];
          innerFn = match[2];
        }
      } else if (
        INNER_FUNCTIONS.includes(agg as (typeof INNER_FUNCTIONS)[number])
      ) {
        innerFn = agg;
      } else if (
        OUTER_FUNCTIONS.includes(agg as (typeof OUTER_FUNCTIONS)[number])
      ) {
        outerFn = agg;
      } else if (agg) {
        outerFn = agg;
      }

      reset({
        name: editingTarget.name,
        description: editingTarget.description || "",
        metricName: editingTarget.metricName,
        metricType: editingTarget.metricType,
        innerFunction: innerFn,
        outerFunction: outerFn,
        groupBy: "",
        range: editingTarget.range || "none",
        mathExpr: "",
        quantile: "0.95",
        legendFormat: editingTarget.legendFormat || "",
        refId: editingTarget.refId || "",
        color: editingTarget.color || QUERY_BUILDER_COLORS[0],
      });
      setLabels(editingTarget.labels || {});
    }
  }, [editingTarget, reset]);

  // Pre-populate from catalog metric (initialMetric from navigation state)
  useEffect(() => {
    if (initialMetric && !editingTarget) {
      setValue("metricName", initialMetric.metricName);
      setValue("metricType", initialMetric.metricType);
      setExtraLabelKeys(initialMetric.metricLabels || []);
      setLabels({});
    }
  }, [initialMetric, editingTarget, setValue]);

  // Close label popover on outside click
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
        innerFunction && innerFunction !== "none" ? innerFunction : undefined,
      outerFunction:
        outerFunction && outerFunction !== "none" ? outerFunction : undefined,
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

  // Store aggregation as combo string
  const aggregationCombo = useMemo(() => {
    const inner =
      innerFunction && innerFunction !== "none" ? innerFunction : "";
    const outer =
      outerFunction && outerFunction !== "none" ? outerFunction : "";
    if (outer && inner) return `${outer}(${inner})`;
    return outer || inner || undefined;
  }, [innerFunction, outerFunction]);

  const buildTarget = (values: TargetFormValues): Partial<MetricTarget> => ({
    name: values.name || values.metricName || "Untitled Target",
    description: values.description || undefined,
    expression,
    metricName: values.metricName,
    metricType: values.metricType,
    labels,
    aggregation: aggregationCombo,
    range: values.range && values.range !== "none" ? values.range : undefined,
    legendFormat: values.legendFormat || undefined,
    refId: values.refId || undefined,
    color: values.color,
    datasourceId,
  });

  const handleAddLabel = () => {
    if (newLabelKey && newLabelValue) {
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
      legendFormat: "",
      refId: "",
      color: QUERY_BUILDER_COLORS[0],
    });
    setLabels({});
    setExtraLabelKeys([]);
  };

  const handleExecuteClick = () => {
    const values = getValues();
    if (!values.metricName) return;
    onExecute(buildTarget(values));
  };

  const onSubmit = (values: TargetFormValues) => {
    onSave(buildTarget(values));
  };

  const showGroupBy =
    outerFunction &&
    outerFunction !== "none" &&
    outerFunction !== "histogram_quantile";
  const showQuantile = outerFunction === "histogram_quantile";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 rounded-full bg-magenta-500 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-text-muted">
            Target Builder
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
            Target Name
          </label>
          <Input
            placeholder="e.g., NCHF Incoming TPS"
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
                          ...extraLabelKeys
                            .filter(
                              (l) =>
                                !(
                                  COMMON_LABELS as readonly string[]
                                ).includes(l)
                            )
                            .map((l) => ({ value: l, label: l })),
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

          {/* Group By */}
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

          {/* Quantile */}
          {showQuantile && (
            <div>
              <label className="text-xs text-text-muted font-medium mb-1 flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
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

      {/* Config: Time Range, Math Expression, Color */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  ...[
                    "1m",
                    "5m",
                    "15m",
                    "30m",
                    "1h",
                    "2h",
                    "6h",
                    "12h",
                    "24h",
                  ].map((r) => ({ value: r, label: `[${r}]` })),
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
                    className={`w-7 h-7 rounded-md border-2 transition-all ${
                      field.value === c
                        ? "border-text-primary scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          />
        </div>
      </div>

      {/* Legend Format + Ref ID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-text-muted font-medium mb-1 block">
            Legend Format
          </label>
          <Input
            placeholder='e.g., "{{instanceName}} | {{code}}"'
            className="text-xs font-mono"
            {...register("legendFormat")}
          />
          <p className="text-[10px] text-text-muted mt-0.5">
            Use {"{{label}}"} for dynamic label substitution
          </p>
        </div>
        <div>
          <label className="text-xs text-text-muted font-medium mb-1 block">
            Ref ID
          </label>
          <Input
            placeholder="e.g., A"
            className="text-xs font-mono"
            {...register("refId")}
          />
          <p className="text-[10px] text-text-muted mt-0.5">
            Reference identifier for this target (A, B, C...)
          </p>
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
          {editingTarget ? "Update" : "Save"} Target
        </Button>
      </div>
    </form>
  );
}
