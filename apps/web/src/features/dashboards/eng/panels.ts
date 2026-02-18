import type { PanelDefinition } from "../shared/DashboardPanel";

export const engPanels: PanelDefinition[] = [
  {
    id: "eng-access-requests-by-method",
    title: "Access Requests by Method",
    description:
      "Breakdown of NCHF Charging requests by HTTP method and operation.",
    promql:
      'sum by (method, operation)(rate(cha_access_nchf_charging_http_requests_total{$filters}[5m]))',
    metricUsed: "cha_access_nchf_charging_http_requests_total",
    chartType: "bar",
    unit: "req/s",
  },
  {
    id: "eng-errors-by-fault-code",
    title: "Errors by Fault Code",
    description:
      "CHA Access NCHF errors broken down by HTTP response code.",
    promql:
      'sum by (code)(rate(cha_access_nchf_charging_http_requests_errors_total{$filters}[5m]))',
    metricUsed: "cha_access_nchf_charging_http_requests_errors_total",
    chartType: "bar",
    unit: "errors/s",
  },
  {
    id: "eng-core-rating-by-operation",
    title: "Core Rating by Sub-Session",
    description:
      "Core rating requests broken down by sub_session_id dimension.",
    promql:
      'sum by (sub_session_id)(rate(cha_core_rating_akka_requests_total{$filters}[5m]))',
    metricUsed: "cha_core_rating_akka_requests_total",
    chartType: "timeseries",
    unit: "req/s",
  },
  {
    id: "eng-kafka-event-posting",
    title: "Kafka Event Posting Rate",
    description:
      "Event record posting rates to Kafka across Core, Access, and Collector.",
    promql:
      'sum(rate(cha_core_event_posting_kafka_total{$filters}[5m])) + sum(rate(cha_access_event_posting_kafka_total{$filters}[5m]))',
    metricUsed:
      "cha_core_event_posting_kafka_total, cha_access_event_posting_kafka_total",
    chartType: "timeseries",
    unit: "events/s",
  },
  {
    id: "eng-cil-data-mgmt",
    title: "CIL Data Management (Core)",
    description:
      "CIL data management request rate by method (get/put/delete).",
    promql:
      'sum by (method)(rate(cha_core_cil_data_mgmt_java_requests_total{$filters}[5m]))',
    metricUsed: "cha_core_cil_data_mgmt_java_requests_total",
    chartType: "bar",
    unit: "req/s",
  },
  {
    id: "eng-diameter-by-peer",
    title: "Access Diameter Requests by Peer",
    description:
      "Diameter rating requests broken down by diameter_peer label.",
    promql:
      'sum by (diameter_peer)(rate(cha_access_rating_diameter_requests_total{$filters}[5m]))',
    metricUsed: "cha_access_rating_diameter_requests_total",
    chartType: "bar",
    unit: "req/s",
  },
  {
    id: "eng-core-policy-sessions",
    title: "Policy Sessions (Created/Cleared)",
    description:
      "Rate of policy session creation and clearing in CHA Core.",
    promql:
      'rate(cha_core_created_policy_sessions_total{$filters}[5m])',
    metricUsed:
      "cha_core_created_policy_sessions_total, cha_core_cleared_policy_sessions_total",
    chartType: "timeseries",
    unit: "sessions/s",
  },
  {
    id: "eng-collector-deferred-rac",
    title: "Collector Deferred RAC Processing",
    description:
      "Deferred RAC batch processing rates in Collector.",
    promql:
      'rate(cha_collector_processed_deferred_rac_batch_total{$filters}[5m])',
    metricUsed: "cha_collector_processed_deferred_rac_batch_total",
    chartType: "timeseries",
    unit: "batches/s",
  },
];
