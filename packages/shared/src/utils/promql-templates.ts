import type { GlobalFilter } from "../schemas/filters.js";

export function buildLabelMatcher(filters: GlobalFilter): string {
  const parts: string[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      parts.push(`${key}="${value}"`);
    }
  }
  return parts.length > 0 ? `{${parts.join(", ")}}` : "";
}

export function rateQuery(
  metric: string,
  interval: string = "5m",
  filters: string = ""
): string {
  return `rate(${metric}${filters}[${interval}])`;
}

export function sumRateQuery(
  metric: string,
  interval: string = "5m",
  filters: string = "",
  by?: string[]
): string {
  const byClause = by ? ` by (${by.join(", ")})` : "";
  return `sum${byClause}(rate(${metric}${filters}[${interval}]))`;
}

export function errorRatioQuery(
  errorsMetric: string,
  totalMetric: string,
  interval: string = "5m",
  filters: string = ""
): string {
  return `sum(rate(${errorsMetric}${filters}[${interval}])) / sum(rate(${totalMetric}${filters}[${interval}]))`;
}

export function histogramQuantileQuery(
  metric: string,
  quantile: number,
  interval: string = "5m",
  filters: string = ""
): string {
  return `histogram_quantile(${quantile}, sum(rate(${metric}_bucket${filters}[${interval}])) by (le))`;
}

export function summaryAvgQuery(
  metric: string,
  interval: string = "5m",
  filters: string = ""
): string {
  return `rate(${metric}_sum${filters}[${interval}]) / rate(${metric}_count${filters}[${interval}])`;
}

export function availabilitySLI(
  errorsMetric: string,
  totalMetric: string,
  interval: string = "5m",
  filters: string = ""
): string {
  return `1 - (sum(rate(${errorsMetric}${filters}[${interval}])) / sum(rate(${totalMetric}${filters}[${interval}])))`;
}

export function burnRateQuery(
  errorsMetric: string,
  totalMetric: string,
  sloTarget: number,
  window: string,
  filters: string = ""
): string {
  const errorBudget = 1 - sloTarget;
  return `(sum(rate(${errorsMetric}${filters}[${window}])) / sum(rate(${totalMetric}${filters}[${window}]))) / ${errorBudget}`;
}
