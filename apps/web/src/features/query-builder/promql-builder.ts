/**
 * Build a PromQL expression from form inputs.
 *
 * Supports inner/outer function chaining, group-by clauses,
 * math operators, regex label matching, and histogram_quantile.
 *
 * Examples:
 *   sum(increase(metric{label=~"pattern"}[1m])) / 60
 *   sum by (code,operation) (increase(metric{labels}[1m])) / 60
 *   histogram_quantile(0.95, rate(metric[5m]))
 *   avg by (requestname,quantile) (metric{quantile="0.95"})
 */

export interface BuildExpressionOptions {
  /** Range-vector function applied directly to the metric: rate, irate, increase, delta, idelta, absent */
  innerFunction?: string;
  /** Aggregation operator wrapping the inner result: sum, avg, min, max, count, stddev, histogram_quantile */
  outerFunction?: string;
  /** Labels for `by (...)` clause on the outer function, e.g. ["code", "operation"] */
  groupBy?: string[];
  /** Range vector selector, e.g. "1m", "5m" */
  range?: string;
  /** Math expression appended to the result, e.g. "/ 60", "* 100" */
  mathExpr?: string;
  /** Quantile value for histogram_quantile, e.g. "0.95" */
  quantile?: string;
}

const RANGE_FUNCTIONS = ["rate", "irate", "increase", "delta", "idelta", "deriv", "predict_linear"];

/**
 * Format labels into a PromQL label matcher string.
 *
 * Values can be prefixed with an operator:
 *   "=~pattern.*"  → label=~"pattern.*"
 *   "!~pattern.*"  → label!~"pattern.*"
 *   "!=value"      → label!="value"
 *   "value"        → label="value"  (default exact match)
 */
function formatLabels(labels: Record<string, string>): string {
  const parts = Object.entries(labels)
    .filter(([, v]) => v)
    .map(([key, raw]) => {
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
    });

  return parts.join(", ");
}

export function buildPromQLExpression(
  metricName: string,
  labels: Record<string, string>,
  options?: BuildExpressionOptions
): string {
  const {
    innerFunction,
    outerFunction,
    groupBy,
    range,
    mathExpr,
    quantile,
  } = options || {};

  const labelStr = formatLabels(labels);

  // Step 1: base metric selector
  let base = labelStr ? `${metricName}{${labelStr}}` : metricName;

  // Step 2: add range vector if provided
  const needsRange =
    range || (innerFunction && RANGE_FUNCTIONS.includes(innerFunction));
  if (needsRange) {
    const rangeVal = range || "5m";
    base = `${base}[${rangeVal}]`;
  }

  // Step 3: wrap with inner function (range-vector function)
  let expr = base;
  if (innerFunction) {
    expr = `${innerFunction}(${base})`;
  }

  // Step 4: wrap with outer function (aggregation)
  if (outerFunction) {
    if (outerFunction === "histogram_quantile") {
      // histogram_quantile wraps differently: histogram_quantile(q, inner)
      const q = quantile || "0.95";
      // If no inner function was set, default to rate() for histogram_quantile
      const innerExpr = innerFunction ? expr : `rate(${base})`;
      expr = `histogram_quantile(${q}, ${innerExpr})`;
    } else {
      const byClause =
        groupBy && groupBy.length > 0
          ? ` by (${groupBy.join(",")})`
          : "";
      expr = `${outerFunction}${byClause} (${expr})`;
    }
  }

  // Step 5: append math expression
  if (mathExpr) {
    expr = `${expr} ${mathExpr.trim()}`;
  }

  return expr;
}

/** Kept for backward compat — old callers with single aggregation string */
export function buildPromQLExpressionLegacy(
  metricName: string,
  labels: Record<string, string>,
  aggregation?: string,
  range?: string
): string {
  if (!aggregation || aggregation === "none") {
    return buildPromQLExpression(metricName, labels, { range });
  }

  // Map old single aggregation to the new inner/outer model
  if (RANGE_FUNCTIONS.includes(aggregation)) {
    return buildPromQLExpression(metricName, labels, {
      innerFunction: aggregation,
      range,
    });
  }

  if (aggregation === "histogram_quantile") {
    return buildPromQLExpression(metricName, labels, {
      outerFunction: "histogram_quantile",
      range,
    });
  }

  return buildPromQLExpression(metricName, labels, {
    outerFunction: aggregation,
    range,
  });
}

export const INNER_FUNCTIONS = [
  "rate",
  "irate",
  "increase",
  "delta",
  "idelta",
  "absent",
] as const;

export const OUTER_FUNCTIONS = [
  "sum",
  "avg",
  "min",
  "max",
  "count",
  "stddev",
  "histogram_quantile",
] as const;

export const LABEL_OPERATORS = ["=", "=~", "!=", "!~"] as const;
export type LabelOperator = (typeof LABEL_OPERATORS)[number];

export const TIME_RANGES = [
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "30m", value: "30m" },
  { label: "1h", value: "1h" },
  { label: "3h", value: "3h" },
  { label: "6h", value: "6h" },
  { label: "12h", value: "12h" },
  { label: "24h", value: "24h" },
] as const;
