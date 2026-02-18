import yaml from "js-yaml";
import type { TierConfig } from "@metrics-nexus/shared/schemas/tier.js";
import type { Metric } from "@metrics-nexus/shared/schemas/metric.js";

interface AlertRule {
  alert: string;
  expr: string;
  for: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
}

function metricToAlertName(name: string): string {
  return name
    .replace(/^cha_/, "CHA")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, "")
    .replace(/Total$/, "Alert");
}

function buildTier1Alert(metric: Metric): AlertRule | null {
  // For error metrics, build burn-rate alert
  if (metric.category === "errors" && metric.name.includes("_errors_")) {
    const totalMetric = metric.name.replace("_errors_total", "_total").replace("_error_total", "_total");
    return {
      alert: `${metricToAlertName(metric.name)}BurnRate`,
      expr: `(sum(rate(${metric.name}[1h])) / sum(rate(${totalMetric}[1h]))) / 0.001 > 1`,
      for: "5m",
      labels: { severity: "critical", tier: "1" },
      annotations: {
        summary: `High burn rate for ${metric.name}`,
        description:
          metric.description || `Error burn rate exceeds budget for ${metric.name}`,
      },
    };
  }

  // For health/saturation metrics, threshold alert
  if (metric.category === "health" || metric.category === "saturation") {
    return {
      alert: `${metricToAlertName(metric.name)}High`,
      expr: `${metric.name} > 0.9`,
      for: "5m",
      labels: { severity: "critical", tier: "1" },
      annotations: {
        summary: `${metric.name} exceeds threshold`,
        description:
          metric.description || `${metric.name} is above critical threshold`,
      },
    };
  }

  return null;
}

function buildTier2Alert(metric: Metric): AlertRule | null {
  if (metric.category === "latency" && metric.name.includes("_duration_")) {
    return {
      alert: `${metricToAlertName(metric.name)}High`,
      expr: `rate(${metric.name}_sum[5m]) / rate(${metric.name}_count[5m]) > 1`,
      for: "10m",
      labels: { severity: "warning", tier: "2" },
      annotations: {
        summary: `High latency for ${metric.name}`,
        description:
          metric.description || `Average latency exceeds threshold for ${metric.name}`,
      },
    };
  }

  if (metric.category === "throughput") {
    return {
      alert: `${metricToAlertName(metric.name)}Drop`,
      expr: `rate(${metric.name}[5m]) < 0.1 * rate(${metric.name}[1h] offset 1d)`,
      for: "15m",
      labels: { severity: "warning", tier: "2" },
      annotations: {
        summary: `Significant throughput drop for ${metric.name}`,
        description: `Request rate dropped below 10% of same time yesterday`,
      },
    };
  }

  return null;
}

export function generateAlertRulesYaml(
  tiers: TierConfig,
  catalog: Metric[]
): string {
  const metricMap = new Map(catalog.map((m) => [m.name, m]));
  const rules: AlertRule[] = [];

  // Tier 1 alerts
  for (const name of tiers.tier1) {
    const metric = metricMap.get(name);
    if (!metric) continue;
    const rule = buildTier1Alert(metric);
    if (rule) rules.push(rule);
  }

  // Tier 2 alerts
  for (const name of tiers.tier2) {
    const metric = metricMap.get(name);
    if (!metric) continue;
    const rule = buildTier2Alert(metric);
    if (rule) rules.push(rule);
  }

  if (rules.length === 0) {
    return "# No alert rules generated. Assign metrics to tiers in the Priority Builder.";
  }

  const alertConfig = {
    groups: [
      {
        name: "cha-metrics-nexus",
        interval: "30s",
        rules,
      },
    ],
  };

  return yaml.dump(alertConfig, { lineWidth: 120, noRefs: true });
}
