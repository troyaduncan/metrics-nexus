// Schemas & types
export {
  MetricSchema,
  MetricTypeEnum,
  AudienceEnum,
  ConfidenceEnum,
  MetricLabelSchema,
  type Metric,
  type MetricType,
  type Audience,
  type Confidence,
  type MetricLabel,
} from "./schemas/metric.js";

export {
  InstantVectorResultSchema,
  RangeVectorResultSchema,
  LabelValuesResultSchema,
  PromErrorSchema,
  type InstantVectorResult,
  type RangeVectorResult,
} from "./schemas/prometheus.js";

export {
  TierConfigSchema,
  TierLevel,
  type TierConfig,
} from "./schemas/tier.js";

export {
  TimeRangeSchema,
  GlobalFilterSchema,
  TimeRangePreset,
  REFRESH_INTERVALS,
  type TimeRange,
  type GlobalFilter,
} from "./schemas/filters.js";

// PromQL utilities
export {
  buildLabelMatcher,
  rateQuery,
  sumRateQuery,
  errorRatioQuery,
  histogramQuantileQuery,
  summaryAvgQuery,
  availabilitySLI,
  burnRateQuery,
} from "./utils/promql-templates.js";

export { CATEGORIES, COMPONENTS } from "./utils/metric-categories.js";

// Data
export {
  metricsCatalog,
  metricsByComponent,
  metricsByName,
} from "./data/metrics-catalog.js";

export { CHA_COMPONENTS } from "./data/components.js";

// Datasource schema & types
export {
  datasources,
  insertDatasourceSchema,
  type InsertDatasource,
  type Datasource,
} from "./schemas/datasource.js";

// Metric query schema & types (Query Builder)
export {
  metricQueries,
  insertMetricQuerySchema,
  type InsertMetricQuery,
  type MetricQuery,
  type QueryTarget,
  METRIC_TYPES as QUERY_METRIC_TYPES,
  type QueryMetricType,
  AGGREGATIONS,
  type Aggregation,
  VISUALIZATION_TYPES,
  type VisualizationType,
  COMMON_LABELS,
  COMMON_METRICS,
  QUERY_BUILDER_COLORS,
  UNIT_TYPES,
  type UnitType,
  X_AXIS_FORMATS,
} from "./schemas/metric-query.js";

// Metric target schema & types (Target Builder)
export {
  metricTargets,
  insertMetricTargetSchema,
  type InsertMetricTarget,
  type MetricTarget,
} from "./schemas/metric-target.js";

// Metrics discovery types
export {
  metricTypeSchema,
  exportFormatSchema,
  type MetricType as DiscoveryMetricType,
  type ExtendedMetricInfo,
  type ExportFormat,
  type ConnectionTestResult,
  type MetricsProgress,
  type ProgressActivity,
  type ExportProgressState,
} from "./schemas/metrics-discovery.js";
