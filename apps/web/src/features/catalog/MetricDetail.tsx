import { useNavigate } from "react-router-dom";
import { Badge, typeBadgeVariant, categoryBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { COMPONENTS } from "@metrics-nexus/shared/utils/metric-categories.js";
import { useTierStore } from "@/lib/stores/tier-store";
import { Activity, Tag, Wand2, Target } from "lucide-react";
import type { Metric } from "@metrics-nexus/shared/schemas/metric.js";
import type { TierLevel } from "@metrics-nexus/shared/schemas/tier.js";
import type { ExtendedMetricInfo } from "@metrics-nexus/shared";

interface MetricDetailProps {
  metric: Metric;
  liveInfo?: ExtendedMetricInfo;
}

export function MetricDetail({ metric, liveInfo }: MetricDetailProps) {
  const navigate = useNavigate();
  const { addToTier, getTierForMetric } = useTierStore();
  const currentTier = getTierForMetric(metric.name);
  const componentName =
    COMPONENTS[metric.component as keyof typeof COMPONENTS] || metric.component;

  // All label keys (static + live) for passing to the builder
  const allLabelKeys = [
    ...metric.labels.map((l) => l.key),
    ...(liveInfo?.labels || []).filter(
      (k) => !metric.labels.some((l) => l.key === k)
    ),
  ];

  // Compute live-only labels (labels from Prometheus not in static catalog)
  const staticLabelKeys = new Set(metric.labels.map((l) => l.key));
  const liveLabelKeys = liveInfo?.labels || [];
  const liveOnlyLabels = liveLabelKeys.filter((k) => !staticLabelKeys.has(k));

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <h3 className="text-base font-mono font-semibold text-magenta-500 break-all">
          {metric.name}
        </h3>
        {metric.description && (
          <p className="mt-2 text-sm text-text-secondary">{metric.description}</p>
        )}
        {liveInfo?.help && liveInfo.help !== metric.description && (
          <p className="mt-1 text-xs text-text-muted italic">
            Prometheus: {liveInfo.help}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant={typeBadgeVariant(metric.type)}>{metric.type}</Badge>
        <Badge variant={categoryBadgeVariant(metric.category)}>
          {metric.category}
        </Badge>
        <Badge variant="default">{componentName}</Badge>
        {metric.audience.map((a) => (
          <Badge key={a} variant="magenta">{a}</Badge>
        ))}
        {metric.unit && <Badge variant="blue">{metric.unit}</Badge>}
      </div>

      {/* Build Query / Target buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() =>
            navigate("/query-builder", {
              state: {
                metricName: metric.name,
                metricType: metric.type,
                metricLabels: allLabelKeys,
              },
            })
          }
          className="flex-1 gap-2"
          size="sm"
        >
          <Wand2 className="w-3.5 h-3.5" />
          Build Query
        </Button>
        <Button
          onClick={() =>
            navigate("/target-builder", {
              state: {
                metricName: metric.name,
                metricType: metric.type,
                metricLabels: allLabelKeys,
              },
            })
          }
          variant="secondary"
          className="flex-1 gap-2"
          size="sm"
        >
          <Target className="w-3.5 h-3.5" />
          Build Target
        </Button>
      </div>

      {/* Live metrics summary */}
      {liveInfo && (
        <div className="rounded-lg bg-surface-secondary border border-border p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Activity className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs font-medium text-text-muted">
              Live Data
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-text-muted">Time Series</p>
              <p className="text-sm font-semibold font-mono text-text-primary">
                {liveInfo.sampleCount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted">Labels</p>
              <p className="text-sm font-semibold font-mono text-text-primary">
                {liveInfo.labels.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Labels — static catalog labels with descriptions */}
      {(metric.labels.length > 0 || liveOnlyLabels.length > 0) && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="w-3.5 h-3.5 text-text-muted" />
            <h4 className="text-sm font-semibold text-text-primary">Labels</h4>
            <Badge variant="default" className="text-[9px]">
              {metric.labels.length + liveOnlyLabels.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {/* Static catalog labels (with descriptions + possible values) */}
            {metric.labels.map((label) => (
              <div
                key={label.key}
                className="rounded-lg bg-surface-secondary border border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-magenta-400">
                    {label.key}
                  </code>
                  {liveInfo?.labels.includes(label.key) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Active in Prometheus" />
                  )}
                </div>
                {label.description && (
                  <p className="text-xs text-text-muted mt-1">
                    {label.description}
                  </p>
                )}
                {label.possibleValues && label.possibleValues.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {label.possibleValues.map((v) => (
                      <span
                        key={v}
                        className="text-[10px] px-1.5 py-0.5 bg-surface-tertiary rounded text-text-muted"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Live-only labels (from Prometheus, not in static catalog) */}
            {liveOnlyLabels.length > 0 && (
              <>
                {metric.labels.length > 0 && (
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold pt-1">
                    Discovered from Prometheus
                  </p>
                )}
                {liveOnlyLabels.map((key) => (
                  <div
                    key={key}
                    className="rounded-lg bg-surface-secondary border border-border/50 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-text-secondary">
                        {key}
                      </code>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Active in Prometheus" />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* PromQL Examples */}
      {metric.examples && metric.examples.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-2">
            PromQL Templates
          </h4>
          <div className="space-y-2">
            {metric.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-lg bg-surface-secondary border border-border p-3"
              >
                {ex.note && (
                  <p className="text-xs text-text-muted mb-1.5">{ex.note}</p>
                )}
                <div className="flex items-start gap-2">
                  <code className="flex-1 text-xs font-mono text-text-primary break-all whitespace-pre-wrap">
                    {ex.promql}
                  </code>
                  <CopyButton text={ex.promql} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source reference */}
      {metric.sourceRef && (
        <div className="text-xs text-text-muted">
          Source: {metric.sourceRef.docName}
          {metric.sourceRef.section && ` — ${metric.sourceRef.section}`}
        </div>
      )}

      {/* Add to Tier actions */}
      <div>
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          Priority Tier
        </h4>
        {currentTier && (
          <p className="text-xs text-text-muted mb-2">
            Currently in{" "}
            <span className="text-magenta-500 font-medium">
              {currentTier === "tier1"
                ? "Tier 1 (NOC)"
                : currentTier === "tier2"
                  ? "Tier 2 (SRE)"
                  : "Tier 3 (ENG)"}
            </span>
          </p>
        )}
        <div className="flex gap-2">
          {(["tier1", "tier2", "tier3"] as TierLevel[]).map((tier) => (
            <Button
              key={tier}
              variant={currentTier === tier ? "primary" : "secondary"}
              size="sm"
              onClick={() => addToTier(tier, metric.name)}
            >
              {tier === "tier1"
                ? "Tier 1"
                : tier === "tier2"
                  ? "Tier 2"
                  : "Tier 3"}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
