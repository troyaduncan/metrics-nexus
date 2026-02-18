import type { PanelDefinition } from "../shared/DashboardPanel";

export const srePanels: PanelDefinition[] = [
  {
    id: "sre-availability-sli",
    title: "Availability SLI",
    description:
      "Service availability: 1 - (errors / total) for NCHF Charging. Target >= 99.9%.",
    promql:
      '1 - (sum(rate(cha_access_nchf_charging_http_requests_errors_total{$filters}[5m])) / sum(rate(cha_access_nchf_charging_http_requests_total{$filters}[5m])))',
    metricUsed:
      "cha_access_nchf_charging_http_requests_errors_total, cha_access_nchf_charging_http_requests_total",
    chartType: "gauge",
    thresholds: { warning: 0.999, critical: 0.99 },
  },
  {
    id: "sre-latency-access",
    title: "Access Latency (Avg)",
    description:
      "Average NCHF Charging request duration from Access layer Summary metric.",
    promql:
      'rate(cha_access_nchf_charging_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_nchf_charging_http_request_duration_seconds_count{$filters}[5m])',
    metricUsed: "cha_access_nchf_charging_http_request_duration_seconds",
    chartType: "timeseries",
    unit: "ms",
  },
  {
    id: "sre-latency-core-rating",
    title: "Core Rating Latency (Avg)",
    description: "Average Core rating request duration.",
    promql:
      'rate(cha_core_rating_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_rating_akka_request_duration_seconds_count{$filters}[5m])',
    metricUsed: "cha_core_rating_akka_request_duration_seconds",
    chartType: "timeseries",
    unit: "ms",
  },
  {
    id: "sre-error-budget",
    title: "Error Budget Remaining",
    description:
      "Estimated error budget remaining this period based on 99.9% SLO target.",
    promql:
      '1 - ((sum(rate(cha_access_nchf_charging_http_requests_errors_total{$filters}[5m])) / sum(rate(cha_access_nchf_charging_http_requests_total{$filters}[5m]))) / 0.001)',
    metricUsed:
      "cha_access_nchf_charging_http_requests_errors_total, cha_access_nchf_charging_http_requests_total",
    chartType: "gauge",
    thresholds: { warning: 0.5, critical: 0.1 },
  },
  {
    id: "sre-burn-rate",
    title: "Error Burn Rate (1h window)",
    description:
      "Multi-window burn rate: current error rate / error budget. >1 means burning faster than budget allows.",
    promql:
      '(sum(rate(cha_access_nchf_charging_http_requests_errors_total{$filters}[1h])) / sum(rate(cha_access_nchf_charging_http_requests_total{$filters}[1h]))) / 0.001',
    metricUsed:
      "cha_access_nchf_charging_http_requests_errors_total, cha_access_nchf_charging_http_requests_total",
    chartType: "timeseries",
    thresholds: { warning: 1, critical: 10 },
  },
  {
    id: "sre-core-balance-latency",
    title: "Core Balance Enquiry Latency",
    description: "Average latency for balance enquiry operations.",
    promql:
      'rate(cha_core_balance_enquiry_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_balance_enquiry_akka_request_duration_seconds_count{$filters}[5m])',
    metricUsed: "cha_core_balance_enquiry_akka_request_duration_seconds",
    chartType: "timeseries",
    unit: "ms",
  },
];
