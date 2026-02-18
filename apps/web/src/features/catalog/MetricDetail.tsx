import { Badge, typeBadgeVariant, categoryBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { COMPONENTS } from "@metrics-nexus/shared/utils/metric-categories.js";
import { useTierStore } from "@/lib/stores/tier-store";
import type { Metric } from "@metrics-nexus/shared/schemas/metric.js";
import type { TierLevel } from "@metrics-nexus/shared/schemas/tier.js";

interface MetricDetailProps {
  metric: Metric;
}

export function MetricDetail({ metric }: MetricDetailProps) {
  const { addToTier, getTierForMetric } = useTierStore();
  const currentTier = getTierForMetric(metric.name);
  const componentName =
    COMPONENTS[metric.component as keyof typeof COMPONENTS] || metric.component;

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

      {/* Labels */}
      {metric.labels.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-2">Labels</h4>
          <div className="space-y-2">
            {metric.labels.map((label) => (
              <div
                key={label.key}
                className="rounded-lg bg-surface-secondary border border-border p-3"
              >
                <code className="text-xs font-mono text-magenta-400">
                  {label.key}
                </code>
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
