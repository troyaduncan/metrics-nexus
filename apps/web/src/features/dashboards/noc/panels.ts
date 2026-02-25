import type { PanelDefinition } from "../shared/DashboardPanel";

export const nocPanels: PanelDefinition[] = [
  {
    id: "noc-error-ratio",
    title: "Overall Error Ratio",
    description:
      "Ratio of errors to total requests across all CHA Access endpoints. A value above 0.01 (1%) warrants investigation.",
    promql:
      'sum(rate(cha_access_nchf_charging_http_requests_errors_total{$filters}[5m])) / sum(rate(cha_access_nchf_charging_http_requests_total{$filters}[5m]))',
    metricUsed:
      "cha_access_nchf_charging_http_requests_errors_total, cha_access_nchf_charging_http_requests_total",
    chartType: "gauge",
    thresholds: { warning: 0.01, critical: 0.05 },
  },
  {
    id: "noc-total-request-rate",
    title: "Total Request Rate",
    description:
      "Sum of all incoming request rates across CHA Access HTTP interfaces.",
    promql:
      '(sum(rate(cha_access_nchf_charging_http_requests_total{$filters}[5m])) or vector(0)) + (sum(rate(cha_access_balance_enquiry_http_requests_total{$filters}[5m])) or vector(0)) + (sum(rate(cha_access_refill_http_requests_total{$filters}[5m])) or vector(0))',
    metricUsed:
      "cha_access_nchf_charging_http_requests_total, cha_access_balance_enquiry_http_requests_total, cha_access_refill_http_requests_total",
    chartType: "timeseries",
    unit: "req/s",
  },
  {
    id: "noc-error-rate-by-component",
    title: "Error Rate by Component",
    description:
      "Error rates for major CHA components: Core, Access, Collector.",
    promql:
      'sum(rate(cha_core_rating_akka_requests_errors_total{$filters}[5m]))',
    metricUsed:
      "cha_core_rating_akka_requests_errors_total",
    chartType: "timeseries",
    unit: "errors/s",
  },
  {
    id: "noc-access-error-rate",
    title: "Access Layer Error Rate",
    description:
      "Errors across all CHA Access interfaces (HTTP, Diameter, Kafka).",
    promql:
      'sum by (job)(rate(cha_access_nchf_charging_http_requests_errors_total{$filters}[5m]))',
    metricUsed: "cha_access_nchf_charging_http_requests_errors_total",
    chartType: "bar",
    unit: "errors/s",
  },
  {
    id: "noc-core-health",
    title: "Core Internal Statistics",
    description:
      "CHA Core internal resource statistics gauge showing system health.",
    promql: 'cha_core_internal_resource_statistics{$filters}',
    metricUsed: "cha_core_internal_resource_statistics",
    chartType: "stat",
  },
  {
    id: "noc-dlb-requests",
    title: "DLB Diameter Load Balancing",
    description:
      "Diameter load balancing request rate by direction.",
    promql:
      'sum by (direction)(rate(cha_dlb_loadbalancing_diameter_requests_total{$filters}[5m]))',
    metricUsed: "cha_dlb_loadbalancing_diameter_requests_total",
    chartType: "timeseries",
    unit: "req/s",
  },
];
