import type { PanelDefinition } from "../shared/DashboardPanel";

/**
 * Traffic Metrics Dashboard — converted from Grafana JSON export.
 * Original dashboard: "Traffic Metrics Dashboard" (id: 91)
 *
 * All panels use multi-target definitions (targets[]) with Grafana-style
 * legendFormat interpolation ({{label}}).
 *
 * $filters placeholders are injected for DrillDownBar integration:
 *   - {$filters}         → standalone label matcher
 *   - {existing, $filters} → appended inside existing matchers
 */
export const trafficPanels: PanelDefinition[] = [
  // ── Row 1 ──────────────────────────────────────────────────────
  {
    id: "traffic-incoming-tps",
    title: "Total Incoming Traffic TPS",
    description:
      "Incoming Traffic of NCHF Charging, NCHF Policy, Diameter Gy, Diameter Sy, SCAPv2 and Diameter VoLTE",
    promql: 'sum(increase(cha_access_nchf_charging_http_requests_total{$filters}[1m])) / 60',
    metricUsed:
      "cha_access_nchf_charging_http_requests_total, cha_access_nchf_policy_http_requests_total, cha_access_rating_diameter_requests_total, cha_access_policy_sy_diameter_requests_total",
    chartType: "timeseries",
    unit: "TPS",
    stack: true,
    targets: [
      { expr: 'sum(increase(cha_access_nchf_charging_http_requests_total{$filters}[1m])) / 60', legendFormat: "NCHF Charging" },
      { expr: 'sum(increase(cha_access_nchf_policy_http_requests_total{$filters}[1m])) / 60', legendFormat: "NCHF Policy" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{requestname=~"EricssonCharging-Ro-Gy-Gy-CCR-.*", $filters}[1m])) / 60', legendFormat: "Diameter Gy" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{service_context="EricssonCharging-Ro-Gy", $filters}[1m])) / 60', legendFormat: "Diameter Gy (sc)" },
      { expr: 'sum(increase(cha_access_policy_sy_diameter_requests_total{requestname=~".*", $filters}[1m])) / 60', legendFormat: "Diameter Sy" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{requestname=~"EricssonCharging-SCAPv2-.*", $filters}[1m])) / 60', legendFormat: "SCAPv2" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{service_context="EricssonCharging-SCAPv2", $filters}[1m])) / 60', legendFormat: "SCAPv2 (sc)" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{requestname=~"EricssonCharging-Ro-VoLTE-MMTel-Ro-CCR-.*", $filters}[1m])) / 60', legendFormat: "Diameter VoLTE" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{service_context=~"EricssonCharging-Ro-VoLTE.*", $filters}[1m])) / 60', legendFormat: "Diameter VoLTE (sc)" },
    ],
  },
  {
    id: "traffic-outgoing-errors-tps",
    title: "Total Outgoing Errors TPS",
    description:
      "Outgoing Errors of NCHF Charging, NCHF Policy, Diameter Gy, Diameter Sy, SCAPv2 and Diameter VoLTE",
    promql: 'sum(increase(cha_access_nchf_charging_http_requests_errors_total{$filters}[1m])) / 60',
    metricUsed:
      "cha_access_nchf_charging_http_requests_errors_total, cha_access_nchf_policy_http_requests_errors_total, cha_access_rating_diameter_requests_errors_total, cha_access_policy_sy_diameter_requests_errors_total",
    chartType: "timeseries",
    unit: "TPS",
    stack: true,
    targets: [
      { expr: 'sum(increase(cha_access_nchf_charging_http_requests_errors_total{$filters}[1m])) / 60', legendFormat: "NCHF Charging Errors" },
      { expr: 'sum(increase(cha_access_nchf_policy_http_requests_errors_total{$filters}[1m])) / 60', legendFormat: "NCHF Policy Errors" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_errors_total{requestname=~"EricssonCharging-Ro-Gy-Gy-CCR-.*", $filters}[1m])) / 60', legendFormat: "Diameter Gy Errors" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_errors_total{service_context="EricssonCharging-Ro-Gy", $filters}[1m])) / 60', legendFormat: "Diameter Gy Errors (sc)" },
      { expr: 'sum(increase(cha_access_policy_sy_diameter_requests_errors_total{requestname=~".*", $filters}[1m])) / 60', legendFormat: "Diameter Sy Errors" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_errors_total{requestname=~"EricssonCharging-Ro-VoLTE-MMTel-Ro-CCR-.*", $filters}[1m])) / 60', legendFormat: "Diameter VoLTE Errors" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_errors_total{service_context=~"EricssonCharging-Ro-VoLTE.*", $filters}[1m])) / 60', legendFormat: "Diameter VoLTE Errors (sc)" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_errors_total{requestname=~"EricssonCharging-SCAPv2-.*", $filters}[1m])) / 60', legendFormat: "SCAPv2 Errors" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_errors_total{service_context="EricssonCharging-SCAPv2", $filters}[1m])) / 60', legendFormat: "SCAPv2 Errors (sc)" },
    ],
  },

  // ── Row 2 ──────────────────────────────────────────────────────
  {
    id: "traffic-sbi-rate",
    title: "Rate And Charge SBI",
    description: "NCHF total request rate per instance",
    promql: 'sum by (instanceName) (irate(cha_access_nchf_charging_http_requests_total{$filters}[5m]))',
    metricUsed: "cha_access_nchf_charging_http_requests_total",
    chartType: "timeseries",
    targets: [
      { expr: 'sum by (instanceName) (irate(cha_access_nchf_charging_http_requests_total{$filters}[5m]))', legendFormat: "NCHF Total" },
      { expr: 'irate(cha_access_nchf_charging_http_requests_total{$filters}[5m])', legendFormat: "{{instanceName}} | {{kubernetes_name}} | {{operation}}" },
    ],
  },
  {
    id: "traffic-total-access",
    title: "Total Access Traffic",
    description:
      "Total access traffic of NCHF Charging, NCHF Policy, Diameter Gy, Diameter Sy, SCAPv2, Diameter VoLTE, External SDP SBI CIR and External SDP CIR",
    promql: 'sum(increase(cha_access_nchf_charging_http_requests_total{$filters}[1m])) / 60',
    metricUsed:
      "cha_access_nchf_charging_http_requests_total, cha_access_nchf_policy_http_requests_total, cha_access_rating_diameter_requests_total, cha_access_external_rating_diameter_requests_total",
    chartType: "timeseries",
    targets: [
      { expr: 'sum(increase(cha_access_nchf_charging_http_requests_total{$filters}[1m])) / 60', legendFormat: "NCHF Charging" },
      { expr: 'sum(increase(cha_access_nchf_policy_http_requests_total{$filters}[1m])) / 60', legendFormat: "NCHF Policy" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{requestname=~"EricssonCharging-Ro-Gy-Gy-CCR-.*", $filters}[1m])) / 60', legendFormat: "Diameter Gy" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{service_context="EricssonCharging-Ro-Gy", $filters}[1m])) / 60', legendFormat: "Diameter Gy (sc)" },
      { expr: 'sum(increase(cha_access_policy_sy_diameter_requests_total{requestname=~".*", $filters}[1m])) / 60', legendFormat: "Diameter Sy" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{requestname=~"EricssonCharging-Ro-VoLTE-MMTel-Ro-CCR-.*", $filters}[1m])) / 60', legendFormat: "Diameter VoLTE" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{service_context=~"EricssonCharging-Ro-VoLTE.*", $filters}[1m])) / 60', legendFormat: "Diameter VoLTE (sc)" },
      { expr: 'sum(increase(cha_access_external_rating_diameter_requests_total{requestname=~"SBI_.*_CIR", $filters}[1m])) / 60', legendFormat: "External SDP SBI CIR" },
      { expr: 'sum(increase(cha_access_external_rating_diameter_requests_total{requestname!~"SBI_.*|sdp.*", $filters}[1m])) / 60', legendFormat: "External SDP CIR (Gy+VoLTE+SCAPv2)" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{requestname=~"EricssonCharging-SCAPv2-.*", $filters}[1m])) / 60', legendFormat: "SCAPv2" },
      { expr: 'sum(increase(cha_access_rating_diameter_requests_total{service_context="EricssonCharging-SCAPv2", $filters}[1m])) / 60', legendFormat: "SCAPv2 (sc)" },
    ],
  },

  // ── Row 3 ──────────────────────────────────────────────────────
  {
    id: "traffic-diameter-rate",
    title: "Rate And Charge Diameter",
    description: "Diameter rating request rate per instance and request name",
    promql: 'irate(cha_access_rating_diameter_requests_total{$filters}[5m])',
    metricUsed: "cha_access_rating_diameter_requests_total",
    chartType: "timeseries",
    targets: [
      { expr: 'irate(cha_access_rating_diameter_requests_total{$filters}[5m])', legendFormat: "{{instanceName}} | {{kubernetes_name}} | {{requestname}}" },
    ],
  },
  {
    id: "traffic-sbi-errors-tps",
    title: "Rate And Charge SBI ERRORS TPS",
    description: "NCHF and NCHF Policy errors by code and operation",
    promql: 'sum by (code,operation) (increase(cha_access_nchf_charging_http_requests_errors_total{$filters}[1m])) / 60',
    metricUsed:
      "cha_access_nchf_charging_http_requests_errors_total, cha_access_nchf_policy_http_requests_errors_total",
    chartType: "timeseries",
    targets: [
      { expr: 'sum by (code,operation) (increase(cha_access_nchf_charging_http_requests_errors_total{$filters}[1m])) / 60', legendFormat: "TPS NCHF ERRORS | {{operation}} | {{code}}" },
      { expr: 'sum by (code,operation) (increase(cha_access_nchf_charging_http_requests_errors_total{$filters}[5m]))', legendFormat: "NCHF ERRORS | {{operation}} | {{code}}" },
      { expr: 'sum by (code,operation) (increase(cha_access_nchf_policy_http_requests_errors_total{$filters}[5m]))', legendFormat: "NCHF POLICY ERRORS | {{operation}} | {{code}}" },
    ],
  },

  // ── Row 4 ──────────────────────────────────────────────────────
  {
    id: "traffic-external-rating-tps",
    title: "External Rating - TPS",
    description: "External rating and policy Diameter request rates",
    promql: 'sum by (endpoint,requestname) (irate(cha_access_external_rating_diameter_requests_total{$filters}[5m]))',
    metricUsed:
      "cha_access_external_rating_diameter_requests_total, cha_access_external_policy_diameter_requests_total, cha_access_external_policy_diameter_requests_errors_total",
    chartType: "timeseries",
    targets: [
      { expr: 'sum by (endpoint,requestname) (irate(cha_access_external_rating_diameter_requests_total{$filters}[5m]))', legendFormat: "SUCCESS | {{endpoint}} | {{requestname}}" },
      { expr: 'sum by (endpoint,requestname) (irate(cha_access_external_policy_diameter_requests_total{$filters}[5m]))', legendFormat: "SUCCESS POLICY | {{endpoint}} | {{requestname}}" },
      { expr: 'sum by (endpoint,requestname,code) (irate(cha_access_external_policy_diameter_requests_errors_total{$filters}[5m]))', legendFormat: "ERROR POLICY | {{endpoint}} | {{requestname}} | {{code}}" },
    ],
  },
  {
    id: "traffic-diameter-errors",
    title: "Rate And Charge Diameter ERRORS",
    description: "Diameter rating request errors by code, operation and request name",
    promql: 'sum by (code,operation,requestname) (increase(cha_access_rating_diameter_requests_errors_total{$filters}[1m]))',
    metricUsed: "cha_access_rating_diameter_requests_errors_total",
    chartType: "timeseries",
    targets: [
      { expr: 'sum by (code,operation,requestname) (increase(cha_access_rating_diameter_requests_errors_total{$filters}[1m]))', legendFormat: "Diameter ERRORS | {{operation}} | {{requestname}} | {{code}}" },
    ],
  },

  // ── Row 5 ──────────────────────────────────────────────────────
  {
    id: "traffic-external-rating-latency",
    title: "External Rating - Latency",
    description: "CHA-access external rating Diameter request duration",
    promql: 'max by (endpoint,quantile) (cha_access_external_rating_diameter_request_duration_seconds{$filters})',
    metricUsed: "cha_access_external_rating_diameter_request_duration_seconds",
    chartType: "timeseries",
    unit: "s",
    targets: [
      { expr: 'max by (endpoint,quantile) (cha_access_external_rating_diameter_request_duration_seconds{$filters})', legendFormat: "{{endpoint}} | p{{quantile}}" },
    ],
  },
  {
    id: "traffic-core-akka-errors",
    title: "CHA-Core - Akka Internal Errors",
    description: "CHA-core akka internal errors and CHA-access routing internal errors",
    promql: 'increase(cha_core_rating_akka_requests_errors_total{$filters}[1m])',
    metricUsed: "cha_core_rating_akka_requests_errors_total",
    chartType: "timeseries",
    targets: [
      { expr: 'increase(cha_core_rating_akka_requests_errors_total{$filters}[1m])', legendFormat: "{{operation}} | {{code}}" },
    ],
  },

  // ── Row 6 ──────────────────────────────────────────────────────
  {
    id: "traffic-external-dlb-tps",
    title: "External Rating Request DLB - TPS",
    description: "External rating latency percentiles and DLB load balancer rates",
    promql: 'avg by (requestname,quantile) (cha_access_external_rating_diameter_request_duration_seconds{$filters})',
    metricUsed:
      "cha_access_external_rating_diameter_request_duration_seconds, cha_dlb_loadbalancer_diameter_total",
    chartType: "timeseries",
    targets: [
      { expr: 'avg by (requestname,quantile) (cha_access_external_rating_diameter_request_duration_seconds{$filters})', legendFormat: "{{requestname}} | p{{quantile}}" },
      { expr: 'avg by (requestname,quantile) (cha_access_external_rating_diameter_request_duration_seconds{quantile="0.95", $filters})', legendFormat: "p95 | {{requestname}}" },
      { expr: 'sum by (instance,type) (increase(cha_dlb_loadbalancer_diameter_total{$filters}[1m])) / 60', legendFormat: "DLB {{type}} | {{instance}}" },
    ],
  },
  {
    id: "traffic-core-session-akka-errors",
    title: "CHA-Core - Session Akka Internal Errors",
    description: "CHA-core Session Akka internal errors and CHA-access Akka internal routing errors",
    promql: 'increase(cha_core_rating_session_akka_requests_errors_total{$filters}[1m])',
    metricUsed: "cha_core_rating_session_akka_requests_errors_total",
    chartType: "timeseries",
    targets: [
      { expr: 'increase(cha_core_rating_session_akka_requests_errors_total{$filters}[1m])', legendFormat: "{{instance}} | {{session_type}} | {{code}}" },
    ],
  },

  // ── Row 7 ──────────────────────────────────────────────────────
  {
    id: "traffic-access-akka-tps",
    title: "CHA-Access - Akka Internal - TPS",
    description: "CHA-Access Akka internal requests and errors",
    promql: 'increase(cha_access_internal_routing_akka_requests_total{$filters}[1m]) / 60',
    metricUsed: "cha_access_internal_routing_akka_requests_total",
    chartType: "timeseries",
    targets: [
      { expr: 'increase(cha_access_internal_routing_akka_requests_total{$filters}[1m]) / 60', legendFormat: "Part-{{customer_partition}} | {{instanceName}} | {{requestname}}" },
    ],
  },
  {
    id: "traffic-events-created",
    title: "Events Created And Processed",
    description:
      "CHA-access Event, EDM CFE Fetched, EDM CNFE Fetched, EDM Recovery Fetched, CHA-core Event and EDM CCE Fetched",
    promql: 'sum by (instanceName) (irate(cha_access_event_creation_java_total{$filters}[5m]))',
    metricUsed:
      "cha_access_event_creation_java_total, edm_pub_consume_java_cfe_fetched_total, edm_pub_consume_java_cnfe_fetched_total, edm_pub_recy_java_fetched_success_total, cha_core_event_creation_java_total, edm_pub_consume_java_cce_fetched_total",
    chartType: "timeseries",
    targets: [
      { expr: 'sum by (instanceName) (irate(cha_access_event_creation_java_total{$filters}[5m]))', legendFormat: "CHA Access Event" },
      { expr: 'sum by (instanceName) (irate(edm_pub_consume_java_cfe_fetched_total{$filters}[5m]))', legendFormat: "EDM CFE Fetched" },
      { expr: 'sum by (instanceName) (irate(edm_pub_consume_java_cnfe_fetched_total{$filters}[5m]))', legendFormat: "EDM CNFE Fetched" },
      { expr: 'sum by (instanceName) (irate(edm_pub_recy_java_fetched_success_total{$filters}[5m]))', legendFormat: "EDM Recovery Fetched" },
      { expr: 'sum by (instanceName) (irate(cha_core_event_creation_java_total{$filters}[5m]))', legendFormat: "CHA Core Event" },
      { expr: 'sum by (instanceName) (irate(edm_pub_consume_java_cce_fetched_total{$filters}[5m]))', legendFormat: "EDM CCE Fetched" },
    ],
  },

  // ── Row 8 ──────────────────────────────────────────────────────
  {
    id: "traffic-sbi-response-time",
    title: "Rate And Charge SBI - Response Time",
    description: "CHA-access NCHF charging request duration percentiles",
    promql: 'cha_access_nchf_charging_http_request_duration_seconds{$filters}',
    metricUsed: "cha_access_nchf_charging_http_request_duration_seconds",
    chartType: "timeseries",
    unit: "s",
    targets: [
      { expr: 'cha_access_nchf_charging_http_request_duration_seconds{$filters}', legendFormat: "{{instance}} | {{operation}} | p{{quantile}}" },
    ],
  },
  {
    id: "traffic-edm-consolidation",
    title: "EDM Consolidation vs CHA Generation (EPS)",
    description:
      "CHA access/core event generation, EDM CFE/CNFE/CCE Fetched and consolidated rates (5min window / 300s)",
    promql: 'sum by (instanceName) (increase(cha_access_event_creation_java_total{$filters}[5m])) / 300',
    metricUsed:
      "cha_access_event_creation_java_total, edm_pub_consume_java_cfe_fetched_total, edm_pub_consume_java_cnfe_fetched_total, edm_pub_asn1consol_sftp_cfe_total, edm_pub_asn1consol_sftp_cnfe_total, edm_pub_recy_java_fetched_success_total, cha_core_event_creation_java_total, edm_pub_consume_java_cce_fetched_total, edm_pub_asn1consol_sftp_cce_total",
    chartType: "timeseries",
    targets: [
      { expr: 'sum by (instanceName) (increase(cha_access_event_creation_java_total{$filters}[5m])) / 300', legendFormat: "CHA Access Event" },
      { expr: 'sum by (instanceName) (increase(edm_pub_consume_java_cfe_fetched_total{$filters}[5m])) / 300', legendFormat: "EDM CFE Fetched" },
      { expr: 'sum by (instanceName) (increase(edm_pub_consume_java_cnfe_fetched_total{$filters}[5m])) / 300', legendFormat: "EDM CNFE Fetched" },
      { expr: 'sum by (instanceName) (increase(edm_pub_asn1consol_sftp_cfe_total{$filters}[5m])) / 300', legendFormat: "EDM CFE Consolidated" },
      { expr: 'sum by (instanceName) (increase(edm_pub_asn1consol_sftp_cnfe_total{$filters}[5m])) / 300', legendFormat: "EDM CNFE Consolidated" },
      { expr: 'sum by (instanceName) (increase(edm_pub_recy_java_fetched_success_total{$filters}[5m])) / 300', legendFormat: "EDM Recovery Fetched" },
      { expr: 'sum by (instanceName) (increase(cha_core_event_creation_java_total{$filters}[5m])) / 300', legendFormat: "CHA Core Event" },
      { expr: 'sum by (instanceName) (increase(edm_pub_consume_java_cce_fetched_total{$filters}[5m])) / 300', legendFormat: "EDM CCE Fetched" },
      { expr: 'sum by (instanceName) (increase(edm_pub_asn1consol_sftp_cce_total{$filters}[5m])) / 300', legendFormat: "EDM CCE Consolidated" },
    ],
  },

  // ── Row 9 ──────────────────────────────────────────────────────
  {
    id: "traffic-diameter-response-time",
    title: "Diameter - Response Time",
    description: "NCHF charging and Diameter response time percentiles",
    promql: 'cha_access_rating_diameter_request_duration_seconds{$filters}',
    metricUsed: "cha_access_rating_diameter_request_duration_seconds",
    chartType: "timeseries",
    unit: "s",
    targets: [
      { expr: 'cha_access_rating_diameter_request_duration_seconds{$filters}', legendFormat: "{{instance}} | {{requestname}} | p{{quantile}}" },
    ],
  },
  {
    id: "traffic-edm-transferred-success",
    title: "Total EDM Events Transferred - Success",
    description: "EDM CFE, EDM CNFE and EDM CCE successful event transfers",
    promql: 'increase(edm_pub_transfer_sftp_success_total{$filters}[5m])',
    metricUsed:
      "edm_pub_transfer_sftp_success_total, edm_pub_transfer_sftp_failure_total, edm_pub_asn1trans_sftp_cfe_total, edm_pub_asn1trans_sftp_cnfe_total, edm_pub_asn1trans_sftp_cce_total, edm_pub_asn1consol_sftp_cfe_total, edm_pub_asn1consol_sftp_cnfe_total, edm_pub_asn1consol_sftp_cce_total",
    chartType: "timeseries",
    targets: [
      { expr: 'increase(edm_pub_transfer_sftp_success_total{$filters}[5m])', legendFormat: "SFTP Success | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_transfer_sftp_failure_total{$filters}[5m])', legendFormat: "SFTP Failure | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1trans_sftp_cfe_total{$filters}[5m])', legendFormat: "CFE Trans | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1trans_sftp_cnfe_total{$filters}[5m])', legendFormat: "CNFE Trans | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1trans_sftp_cce_total{$filters}[5m])', legendFormat: "CCE Trans | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1trans_sftp_cfe_alternateformat_total{$filters}[5m])', legendFormat: "CFE Alt | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1trans_sftp_cnfe_alternateformat_total{$filters}[5m])', legendFormat: "CNFE Alt | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1trans_sftp_cce_alternateformat_total{$filters}[5m])', legendFormat: "CCE Alt | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1consol_sftp_cfe_total{$filters}[5m])', legendFormat: "CFE Consol | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1consol_sftp_cnfe_total{$filters}[5m])', legendFormat: "CNFE Consol | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1consol_sftp_cce_total{$filters}[5m])', legendFormat: "CCE Consol | {{instanceName}} | {{instance}}" },
    ],
  },

  // ── Row 10 ─────────────────────────────────────────────────────
  {
    id: "traffic-translation-response-time",
    title: "Average Translation 95,99 - Response Time",
    description: "CPM ID translation request duration percentiles",
    promql: 'avg by (quantile) (cha_access_cpm_id_translation_java_request_duration_seconds{$filters})',
    metricUsed: "cha_access_cpm_id_translation_java_request_duration_seconds",
    chartType: "timeseries",
    unit: "s",
    targets: [
      { expr: 'avg by (quantile) (cha_access_cpm_id_translation_java_request_duration_seconds{$filters})', legendFormat: "p{{quantile}}" },
    ],
  },
  {
    id: "traffic-edm-consolidated-tps",
    title: "EDM Consolidated - TPS",
    description: "EDM CNFE and EDM CCE consolidated rates",
    promql: 'increase(edm_pub_asn1consol_sftp_cnfe_total{$filters}[10m]) / 600',
    metricUsed: "edm_pub_asn1consol_sftp_cnfe_total, edm_pub_asn1consol_sftp_cce_total",
    chartType: "timeseries",
    targets: [
      { expr: 'increase(edm_pub_asn1consol_sftp_cnfe_total{$filters}[10m]) / 600', legendFormat: "CNFE | {{instanceName}} | {{instance}}" },
      { expr: 'increase(edm_pub_asn1consol_sftp_cce_total{$filters}[10m]) / 600', legendFormat: "CCE | {{instanceName}} | {{instance}}" },
    ],
  },

  // ── Row 11 ─────────────────────────────────────────────────────
  {
    id: "traffic-access-cil-response-time",
    title: "Average CHA-access CIL - Response Time",
    description: "CHA-access CIL data management request duration by method and percentile",
    promql: 'avg by (instance,quantile,method) (cha_access_cil_data_mgmt_java_request_duration_seconds{$filters})',
    metricUsed: "cha_access_cil_data_mgmt_java_request_duration_seconds",
    chartType: "timeseries",
    unit: "s",
    targets: [
      { expr: 'avg by (instance,quantile,method) (cha_access_cil_data_mgmt_java_request_duration_seconds{$filters})', legendFormat: "{{method}} | {{instance}} | p{{quantile}}" },
    ],
  },
  {
    id: "traffic-edm-transferred-failure",
    title: "Total EDM Events Transferred - Failure",
    description: "EDM Event Publishing failed events",
    promql: 'EDMEventPublishing_EventsTransferredFailure_total{$filters}',
    metricUsed: "EDMEventPublishing_EventsTransferredFailure_total",
    chartType: "timeseries",
    targets: [
      { expr: 'EDMEventPublishing_EventsTransferredFailure_total{$filters}', legendFormat: "{{kubernetes_pod_name}}" },
    ],
  },

  // ── Row 12 ─────────────────────────────────────────────────────
  {
    id: "traffic-core-converged",
    title: "Core - Charging Converged Rate And Charge",
    description: "CHA-core rating Akka request rates and errors",
    promql: 'increase(cha_core_rating_akka_requests_total{direction="OUT", $filters}[1m]) / 60',
    metricUsed:
      "cha_core_rating_akka_request_total, cha_core_rating_akka_requests_total, cha_core_rating_akka_requests_errors_total",
    chartType: "timeseries",
    targets: [
      { expr: 'increase(cha_core_rating_akka_request_total{job="eric-bss-cha-core", $filters}[5m])', legendFormat: "{{instanceName}} | {{kubernetes_name}} | {{instance}}" },
      { expr: 'increase(cha_core_rating_akka_requests_total{direction="OUT", $filters}[1m]) / 60', legendFormat: "{{instance}} | {{direction}} | {{operation}}" },
      { expr: 'sum by (code) (increase(cha_core_rating_akka_requests_errors_total{$filters}[1m])) / 60', legendFormat: "ERROR | {{code}}" },
    ],
  },
  {
    id: "traffic-cpm-dns-tps",
    title: "CPM DNS - TPS",
    description: "MSISDN and IMSI Provisioning total, success and failed rates",
    promql: 'increase(cpm_provision_msisdn_dns_requests_total{$filters}[1m]) / 60',
    metricUsed:
      "cpm_provision_msisdn_dns_requests_total, cpm_provision_msisdn_dns_requests_success_total, cpm_provision_imsi_dns_requests_total, cpm_provision_imsi_dns_requests_success_total, cpm_provision_msisdn_dns_requests_failed_total",
    chartType: "timeseries",
    targets: [
      { expr: 'increase(cpm_provision_msisdn_dns_requests_total{$filters}[1m]) / 60', legendFormat: "MSISDN Total | {{instanceName}} | {{instance}}" },
      { expr: 'increase(cpm_provision_msisdn_dns_requests_success_total{$filters}[1m]) / 60', legendFormat: "MSISDN Success | {{instanceName}} | {{instance}}" },
      { expr: 'increase(cpm_provision_imsi_dns_requests_total{$filters}[1m]) / 60', legendFormat: "IMSI Total | {{instanceName}} | {{instance}}" },
      { expr: 'increase(cpm_provision_imsi_dns_requests_success_total{$filters}[1m]) / 60', legendFormat: "IMSI Success | {{instanceName}} | {{instance}}" },
      { expr: 'increase(cpm_provision_msisdn_dns_requests_failed_total{$filters}[1m]) / 60', legendFormat: "MSISDN Failed | {{instanceName}} | {{instance}}" },
    ],
  },

  // ── Row 13 ─────────────────────────────────────────────────────
  {
    id: "traffic-core-converged-response-time",
    title: "Core - Converged Rate And Charge - Response Time",
    description: "CHA-core rating Akka request duration percentiles",
    promql: 'cha_core_rating_akka_request_duration_seconds{$filters}',
    metricUsed: "cha_core_rating_akka_request_duration_seconds",
    chartType: "timeseries",
    unit: "s",
    targets: [
      { expr: 'cha_core_rating_akka_request_duration_seconds{$filters}', legendFormat: "{{instance}} | p{{quantile}}" },
    ],
  },
  {
    id: "traffic-cpm-dns-response-time",
    title: "CPM DNS - Response Time (max)",
    description: "MSISDN and IMSI Provisioning latency",
    promql: 'cpm_provision_msisdn_dns_response_duration_seconds_max{$filters}',
    metricUsed:
      "cpm_provision_msisdn_dns_response_duration_seconds_max, cpm_provision_imsi_dns_response_duration_seconds_max",
    chartType: "timeseries",
    unit: "s",
    targets: [
      { expr: 'cpm_provision_msisdn_dns_response_duration_seconds_max{$filters}', legendFormat: "MSISDN Latency | {{instanceName}} | {{instance}}" },
      { expr: 'cpm_provision_imsi_dns_response_duration_seconds_max{$filters}', legendFormat: "IMSI Latency | {{instanceName}} | {{instance}}" },
    ],
  },

  // ── Row 14 ─────────────────────────────────────────────────────
  {
    id: "traffic-core-cil-response-time",
    title: "Average CHA-core CIL - Response Time",
    description: "CHA-core CIL data management request duration by method and percentile",
    promql: 'avg by (instance,method,quantile) (cha_core_cil_data_mgmt_java_request_duration_seconds{$filters})',
    metricUsed: "cha_core_cil_data_mgmt_java_request_duration_seconds",
    chartType: "timeseries",
    unit: "s",
    targets: [
      { expr: 'avg by (instance,method,quantile) (cha_core_cil_data_mgmt_java_request_duration_seconds{$filters})', legendFormat: "{{method}} | {{instance}} | p{{quantile}}" },
    ],
  },
  {
    id: "traffic-nrf-registration",
    title: "Total Charging NRF Registration Requests",
    description: "CHA NRF registration request deltas",
    promql: 'idelta(cha_nfreg_nrf_registration_http_requests_total{$filters}[5m])',
    metricUsed: "cha_nfreg_nrf_registration_http_requests_total",
    chartType: "timeseries",
    targets: [
      { expr: 'idelta(cha_nfreg_nrf_registration_http_requests_total{$filters}[5m])', legendFormat: "{{method}} | {{operation}} | {{instance}}" },
    ],
  },

  // ── Row 15 ─────────────────────────────────────────────────────
  {
    id: "traffic-cil-reject",
    title: "CIL Reject",
    description: "Cassandra ECOP rejections",
    promql: 'increase(cassandra_ecop_rejections_total{$filters}[60s]) / 60',
    metricUsed: "cassandra_ecop_rejections_total",
    chartType: "timeseries",
    targets: [
      { expr: 'increase(cassandra_ecop_rejections_total{$filters}[60s]) / 60', legendFormat: "{{kubernetes_pod_name}}-{{mechanism}}" },
    ],
  },
];
