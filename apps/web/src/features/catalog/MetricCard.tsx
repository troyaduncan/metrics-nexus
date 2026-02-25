import { Card } from "@/components/ui/Card";
import {
  Badge,
  typeBadgeVariant,
  categoryBadgeVariant,
} from "@/components/ui/Badge";
import { COMPONENTS } from "@metrics-nexus/shared/utils/metric-categories.js";
import { Tag, Activity } from "lucide-react";
import type { Metric } from "@metrics-nexus/shared/schemas/metric.js";
import type { ExtendedMetricInfo } from "@metrics-nexus/shared";

interface MetricCardProps {
  metric: Metric;
  liveInfo?: ExtendedMetricInfo;
  onClick: () => void;
}

export function MetricCard({ metric, liveInfo, onClick }: MetricCardProps) {
  const componentName =
    COMPONENTS[metric.component as keyof typeof COMPONENTS] || metric.component;

  // Merge labels: use static catalog labels + any additional live labels not already defined
  const staticLabelKeys = new Set(metric.labels.map((l) => l.key));
  const liveLabelKeys = liveInfo?.labels || [];
  const allLabelKeys = [
    ...metric.labels.map((l) => l.key),
    ...liveLabelKeys.filter((k) => !staticLabelKeys.has(k)),
  ];

  return (
    <Card onClick={onClick} className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-mono font-medium text-text-primary break-all leading-tight">
          {metric.name}
        </h3>
        {liveInfo && liveInfo.sampleCount > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-text-muted shrink-0" title="Active time series count">
            <Activity className="w-3 h-3" />
            {liveInfo.sampleCount}
          </span>
        )}
      </div>
      {metric.description && (
        <p className="text-xs text-text-muted line-clamp-2">
          {metric.description}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant={typeBadgeVariant(metric.type)}>{metric.type}</Badge>
        <Badge variant={categoryBadgeVariant(metric.category)}>
          {metric.category}
        </Badge>
        <Badge variant="default">{componentName}</Badge>
        {metric.audience.map((a) => (
          <Badge key={a} variant="magenta">
            {a}
          </Badge>
        ))}
      </div>

      {/* Labels preview */}
      {allLabelKeys.length > 0 && (
        <div className="flex items-start gap-1.5 pt-1 border-t border-border">
          <Tag className="w-3 h-3 text-text-muted shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {allLabelKeys.map((key) => (
              <span
                key={key}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-tertiary text-text-secondary"
              >
                {key}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
