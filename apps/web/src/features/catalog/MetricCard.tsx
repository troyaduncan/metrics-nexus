import { Card } from "@/components/ui/Card";
import {
  Badge,
  typeBadgeVariant,
  categoryBadgeVariant,
} from "@/components/ui/Badge";
import { COMPONENTS } from "@metrics-nexus/shared/utils/metric-categories.js";
import type { Metric } from "@metrics-nexus/shared/schemas/metric.js";

interface MetricCardProps {
  metric: Metric;
  onClick: () => void;
}

export function MetricCard({ metric, onClick }: MetricCardProps) {
  const componentName =
    COMPONENTS[metric.component as keyof typeof COMPONENTS] || metric.component;

  return (
    <Card onClick={onClick} className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-mono font-medium text-text-primary break-all leading-tight">
          {metric.name}
        </h3>
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
    </Card>
  );
}
