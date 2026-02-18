import type { Metric } from "../schemas/metric.js";

const DOC_REF = "517/1553-CSH 109 900 Uen";
const SECTION = "Charging Core Metrics";
const COMPONENT = "core";

export const coreMetrics: Metric[] = [
  // ---------------------------------------------------------------------------
  // 1. Online Rate & Charge
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_online_rate_charge_akka_requests_total",
    description: "Number of requests received for the online rate and charge service.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "The service operation performed.",
        possibleValues: ["Immediate-Event", "Session", "Enquiry", "ReAuthorization"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_online_rate_charge_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_online_rate_charge_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the online rate and charge service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        possibleValues: ["Immediate-Event", "Session", "Enquiry", "ReAuthorization"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_online_rate_charge_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_online_rate_charge_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the online rate and charge service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        possibleValues: ["Immediate-Event", "Session", "Enquiry", "ReAuthorization"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_online_rate_charge_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_online_rate_charge_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 2. Rating (general)
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_rating_akka_requests_total",
    description: "Number of requests received or sent.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["Unknown", "Internal", "External", "MassResource", "NonProvisioned"] },
      { key: "direction", description: "Request direction IN to or OUT from Charging Function.", possibleValues: ["IN", "OUT"] },
      { key: "operation", possibleValues: ["Create", "Update", "Release", "Event", "Refund", "CheckBalance", "Notify", "Delete", "PostEvent"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_rating_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_rating_akka_requests_errors_total",
    description: "Number of failure responses sent or Number of requests resulted in a failure.",
    type: "counter",
    labels: [
      { key: "code", description: "Charging Internal Response Code to represent the reason of failure." },
      { key: "customer_type", possibleValues: ["Unknown", "Internal", "External", "MassResource", "NonProvisioned"] },
      { key: "direction", possibleValues: ["IN", "OUT"] },
      { key: "operation", possibleValues: ["Create", "Update", "Release", "Event", "Refund", "CheckBalance", "Notify", "Delete", "PostEvent"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_rating_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_rating_akka_request_duration_seconds",
    description: "Average time taken to receive a response. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "direction", possibleValues: ["IN", "OUT"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_rating_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_rating_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 3. Rating Session
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_rating_session_akka_requests_total",
    description: "Number of Converged Charging Service Session requests received.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["Unknown", "Internal", "External", "NonProvisioned"] },
      { key: "operation", possibleValues: ["Create", "Update", "Release", "Event", "Refund", "CheckBalance", "PostEvent"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_rating_session_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_rating_session_akka_requests_errors_total",
    description: "Number of Converged Charging Service Session requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Charging Internal Response Code to represent the reason of failure." },
      { key: "customer_type", possibleValues: ["Unknown", "Internal", "External", "NonProvisioned"] },
      { key: "operation", possibleValues: ["Create", "Update", "Release", "Event", "Refund", "CheckBalance", "PostEvent"] },
      { key: "session_type", description: "Type of the Session.", possibleValues: ["main", "service"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_rating_session_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 4. Toll-Free & Skip External Rating
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_tollfree_rating_session_requests_total",
    description: "Number of Converged Charging Service Session requests received resulted in toll-free.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["External"] },
      { key: "operation", possibleValues: ["Create"] },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_tollfree_rating_session_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_skip_external_rating_session_requests_total",
    description: "Number of Converged Charging Service Session requests received resulted in skipped external rating.",
    type: "counter",
    labels: [
      { key: "code_external_extension", description: "Code external extension description." },
      { key: "customer_type", possibleValues: ["External"] },
      { key: "operation", possibleValues: ["Create", "Update", "Release"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_skip_external_rating_session_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_tollfree_rating_session_responses_total",
    description: "Number of Converged Charging Service Session response received resulted in toll-free.",
    type: "counter",
    labels: [
      { key: "code_external", description: "Code external description." },
      { key: "customer_type", possibleValues: ["External"] },
      { key: "operation", possibleValues: ["Create", "Update", "Release", "Event", "Refund", "CheckBalance"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_tollfree_rating_session_responses_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_tollfree_service_responses_total",
    description: "Number of Converged Charging Service Session requests received which resulted in toll-free.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["Internal", "NonProvisioned"] },
      { key: "operation", possibleValues: ["Create", "Update", "Event"] },
      { key: "reason", description: "Reason for toll-free response.", possibleValues: ["FailureRule", "StartOfCall", "InsufficientFundsToAllow", "InsufficientFundsToContinue", "NoProductsFound"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_tollfree_service_responses_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 5. Fail-Open Rating
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_failopen_rating_requests_total",
    description: "Number of Converged Rate and Charge fail-open requests processed.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["External"] },
      { key: "direction", possibleValues: ["IN"] },
      { key: "operation", possibleValues: ["Create", "Update"] },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_failopen_rating_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_failopen_rating_requests_rejected_total",
    description: "Number of Converged Rate and Charge fail-open requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Represents the CHA Core internal response code." },
      { key: "customer_type", possibleValues: ["External"] },
      { key: "direction", possibleValues: ["OUT"] },
      { key: "operation", possibleValues: ["Create", "Update"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_failopen_rating_requests_rejected_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 6. Online Immediate Event
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_online_immediate_event_akka_requests_total",
    description: "Number of Immediate Charging Deduct requests received or Number of Charging Enquiry requests received.",
    type: "counter",
    labels: [
      { key: "type", possibleValues: ["deduct", "enquiry"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_online_immediate_event_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_online_immediate_event_akka_requests_errors_total",
    description: "Number of Immediate Charging Deduct or Enquiry requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "type", possibleValues: ["deduct", "enquiry"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_online_immediate_event_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 7. Offline Charging
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_offline_charging_akka_requests_total",
    description: "The number of Offline Consumption requests received.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["Internal", "External", "MassResource", "Unknown"] },
      { key: "external_service", possibleValues: ["offlinerateandchargebx", "offlinerateanddchargejsonfile"] },
      { key: "operation", possibleValues: ["ExecuteOffline"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_offline_charging_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_offline_charging_akka_requests_errors_total",
    description: "Number of Offline Consumption requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "customer_type", possibleValues: ["Internal", "External", "MassResource", "Unknown"] },
      { key: "external_service", possibleValues: ["offlinerateandchargebx", "offlinerateanddchargejsonfile"] },
      { key: "operation", possibleValues: ["ExecuteOffline"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_offline_charging_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_offline_charging_akka_request_duration_seconds",
    description: "Average response time of an Offline Consumption request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "customer_type", possibleValues: ["Internal", "External", "MassResource", "Unknown"] },
      { key: "external_service", possibleValues: ["offlinerateandchargebx", "offlinerateanddchargejsonfile"] },
      { key: "operation", possibleValues: ["ExecuteOffline"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_offline_charging_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_offline_charging_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 8. Post Event
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_post_event_requests_total",
    description: "Number of Post Event Charging requests for Offline Charging, Offline reporting and Offline mass event charging.",
    type: "counter",
    labels: [
      { key: "type", possibleValues: ["OfflineCharging", "OfflineReporting", "OfflineMassEventCharging"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_post_event_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_post_event_requests_errors_total",
    description: "Number of Post Event Charging error responses for Offline Charging, Offline reporting and Offline mass event charging.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "type", possibleValues: ["OfflineCharging", "OfflineReporting", "OfflineMassEventCharging"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_post_event_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 9. Balance Enquiry
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_balance_enquiry_akka_requests_total",
    description: "Number of requests received for the balance enquiry service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["ExecuteBalanceSnapshot", "ReadBucketBalance"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_balance_enquiry_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_balance_enquiry_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the balance enquiry service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["ExecuteBalanceSnapshot", "ReadBucketBalance"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_balance_enquiry_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_balance_enquiry_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the balance enquiry service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["ExecuteBalanceSnapshot", "ReadBucketBalance"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_balance_enquiry_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_balance_enquiry_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 10. Balance Adjustment
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_balance_adjustment_akka_requests_total",
    description: "Number of requests received for the balance adjustment service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["UpdateBucketBalance"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_balance_adjustment_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_balance_adjustment_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the balance adjustment service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["UpdateBucketBalance"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_balance_adjustment_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_balance_adjustment_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the balance adjustment service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["UpdateBucketBalance"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_balance_adjustment_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_balance_adjustment_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 11. Balance Expiry Offset
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_balance_expiry_offset_akka_requests_total",
    description: "Number of Balance Expiry Offset Trigger requests received.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["BalanceExpiryOffsetTrigger"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_balance_expiry_offset_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_balance_expiry_offset_akka_requests_errors_total",
    description: "Number of Balance Expiry Offset Trigger requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["BalanceExpiryOffsetTrigger"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_balance_expiry_offset_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_balance_expiry_offset_akka_request_duration_seconds",
    description: "Average response time of a Balance Expiry Offset Trigger request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["BalanceExpiryOffsetTrigger"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_balance_expiry_offset_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_balance_expiry_offset_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 12. Refill
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_refill_akka_requests_total",
    description: "Number of requests received for the refill service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["ExecuteRefill", "ReadRefillFraud", "UpdateRefillFraud"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_refill_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_refill_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the refill service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["ExecuteRefill", "ReadRefillFraud", "UpdateRefillFraud"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_refill_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_refill_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the refill service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["ExecuteRefill", "ReadRefillFraud", "UpdateRefillFraud"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_refill_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_refill_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 13. Schedule Enquiry
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_schedule_enquiry_akka_requests_total",
    description: "Number of requests received for the schedule enquiry service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["ReadPeriodicAction"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_schedule_enquiry_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_schedule_enquiry_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the schedule enquiry service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["ReadPeriodicAction"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_schedule_enquiry_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_schedule_enquiry_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the schedule enquiry service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["ReadPeriodicAction"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_schedule_enquiry_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_schedule_enquiry_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 14. CIL Data Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_cil_data_mgmt_java_requests_total",
    description: "Number of CIL Data Management operations performed.",
    type: "counter",
    labels: [
      { key: "customer_partition", description: "Represents the Partition ID where the customer belongs." },
      { key: "method", description: "The Service operation performed.", possibleValues: ["get", "put", "delete"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_cil_data_mgmt_java_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cil_data_mgmt_java_requests_errors_total",
    description: "Number of CIL Data Management operations resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Charging Internal Response Code to represent the reason of failure." },
      { key: "customer_partition", description: "Represents the Partition ID where the customer belongs." },
      { key: "method", possibleValues: ["get", "put", "delete"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_cil_data_mgmt_java_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cil_data_mgmt_java_request_duration_seconds",
    description: "Time taken to perform the requested operation via CIL Data Management Service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "customer_partition", description: "Represents the Partition ID where the customer belongs." },
      { key: "method", possibleValues: ["get", "put", "delete"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_cil_data_mgmt_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_cil_data_mgmt_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 15. RMCA Data Enquiry
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_rmca_data_enquiry_java_requests_total",
    description: "Number of RMCA Data Management requests executed.",
    type: "counter",
    labels: [{ key: "operation", possibleValues: ["get"] }],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_rmca_data_enquiry_java_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_rmca_data_enquiry_java_requests_errors_total",
    description: "Number of RMCA Data Management requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["get"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_rmca_data_enquiry_java_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_rmca_data_enquiry_java_request_duration_seconds",
    description: "Average response time of a RMCA Data Management request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [{ key: "operation", possibleValues: ["get"] }],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_rmca_data_enquiry_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_rmca_data_enquiry_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 16. CPM Data Enquiry
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_cpm_data_enquiry_java_requests_total",
    description: "Number of CPM Data Enquiry requests executed.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["getCustomer", "getPartyRole", "getEntitySpecifications", "getCustomerAndContract", "getPartyRoleAndContract", "getPartitionId", "getPartyRoleInvolvementGroup", "getResolvedContract"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_cpm_data_enquiry_java_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cpm_data_enquiry_java_requests_errors_total",
    description: "Number of CPM Data Enquiry requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["getCustomer", "getPartyRole", "getEntitySpecifications", "getCustomerAndContract", "getPartyRoleAndContract", "getPartitionId", "getPartyRoleInvolvementGroup", "getResolvedContract"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_cpm_data_enquiry_java_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cpm_data_enquiry_java_request_duration_seconds",
    description: "Average response time of a CPM Data Enquiry request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["getCustomer", "getPartyRole", "getEntitySpecifications", "getCustomerAndContract", "getPartyRoleAndContract", "getPartitionId", "getPartyRoleInvolvementGroup", "getResolvedContract"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_cpm_data_enquiry_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_cpm_data_enquiry_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 17. Policy Control
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_policy_control_akka_requests_total",
    description: "Number of Policy Control requests received or sent.",
    type: "counter",
    labels: [
      { key: "operation", description: "The Service operation that has been performed." },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_policy_control_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_policy_control_akka_requests_errors_total",
    description: "Number of Policy Control requests failed.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", description: "The Service operation that has been performed." },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_policy_control_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_policy_control_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the policy control service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", description: "The Service operation that has been performed." },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_policy_control_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_policy_control_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_policy_control_reevaluations_total",
    description: "Number of Policy Control requests received or Number of Policy Status Notification requests sent.",
    type: "counter",
    labels: [
      { key: "reason", description: "Reason for triggering the policy reevaluation." },
      { key: "triggering_service", description: "Represents the service which triggered the counter." },
      { key: "reevaluation_level", description: "Represents the reevaluation level triggered." },
      { key: "notification_sent", description: "Represents if the reevaluation sends an SNR." },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_policy_control_reevaluations_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 18. Policy Sessions
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_created_policy_sessions_total",
    description: "Number of Policy sessions created.",
    type: "counter",
    labels: [
      { key: "reason", possibleValues: ["Traffic", "Migration"] },
      { key: "service_context", description: "Service context associated with the session." },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_created_policy_sessions_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cleared_policy_sessions_total",
    description: "Number of Policy sessions cleared.",
    type: "counter",
    labels: [
      { key: "service_context", description: "Service context associated with the session." },
      { key: "reason", possibleValues: ["Expired", "Client-Terminated", "Old-Sessions", "SNR-Errors", "No-Available-Policy-Counters", "Too-many-sessions", "Failed-Migration"] },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_cleared_policy_sessions_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 19. Purchase Charge
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_purchase_charge_akka_requests_total",
    description: "Number of requests received for the purchase charge service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["CreateReservation", "CommitReservation", "CancelReservation", "BasketRateAndCharge", "BasketRateAndDeduct", "BasketRateAndExecute", "BasketRateAndAdvice", "CancelBasketRateAndChargeReservation"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_purchase_charge_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_purchase_charge_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the purchase charge service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["CreateReservation", "CommitReservation", "CancelReservation", "BasketRateAndCharge", "BasketRateAndDeduct", "BasketRateAndExecute", "BasketRateAndAdvice", "CancelBasketRateAndChargeReservation"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_purchase_charge_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_purchase_charge_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the purchase charge service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["CreateReservation", "CommitReservation", "CancelReservation", "BasketRateAndCharge", "BasketRateAndDeduct", "BasketRateAndExecute", "BasketRateAndAdvice", "CancelBasketRateAndChargeReservation"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_purchase_charge_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_purchase_charge_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 20. Event Consumption
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_event_consumption_akka_requests_total",
    description: "Number of Customer Status Update requests received.",
    type: "counter",
    labels: [
      { key: "type", possibleValues: ["CustomerStatusUpdate", "ProductStatusNotificationAcknowledge"] },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_event_consumption_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_event_consumption_akka_requests_errors_total",
    description: "Number of Customer Status Update requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "type", possibleValues: ["CustomerStatusUpdate", "ProductStatusNotificationAcknowledge"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_event_consumption_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_event_consumption_akka_request_duration_seconds",
    description: "Average response time of a Customer Status Update request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "type", possibleValues: ["CustomerStatusUpdate", "ProductStatusNotificationAcknowledge"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_event_consumption_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_event_consumption_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 21. Periodic Operation (Recurrence)
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_periodic_operation_java_requests_total",
    description: "Number of customers/contracts/calendar entries evaluated in recurrence.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["Customers-Evaluated", "Customers-With-Periodic-Job", "Customers-With-Due-Periodic-Job", "Contracts-Evaluated", "Contracts-With-Periodic-Job", "Contracts-With-Due-Periodic-Job", "Calendar-Entries-Evaluated", "Calendar-Entries-Due", "Calendar-Entries-Speculation"] },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_periodic_operation_java_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_periodic_operation_java_requests_errors_total",
    description: "Number of customers/contracts/calendar entries experienced problem while executing recurrence.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "resource", possibleValues: ["Customer", "Contract", "Calendar-Entries"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_periodic_operation_java_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 22. Voucher Server
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_voucher_server_http_requests_total",
    description: "Number of requests sent to reserve a voucher or Number of requests retransmitted to reserve a voucher.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["ReserveVoucher", "EndReservation"] },
      { key: "retransmitted", description: "Indicates whether the request is retransmitted.", possibleValues: ["Yes", "No"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_voucher_server_http_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_voucher_server_http_requests_errors_total",
    description: "Number of requests failed to reserve a voucher.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      { key: "operation", possibleValues: ["ReserveVoucher", "EndReservation"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_voucher_server_http_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_voucher_server_http_request_duration_seconds",
    description: "Average response time of a request to reserve a voucher. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["ReserveVoucher", "EndReservation"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_voucher_server_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_voucher_server_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 23. CPM Business Logic (Prolong Lifecycle)
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_cpm_business_logic_http_requests_total",
    description: "Number of prolong lifecycle requests or Number of prolong lifecycle requests retransmitted.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["UpdatePrePaidRefill"] },
      { key: "retransmitted", possibleValues: ["Yes", "No"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_cpm_business_logic_http_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cpm_business_logic_http_requests_errors_total",
    description: "Number of requests failed to prolong lifecycle.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      { key: "operation", possibleValues: ["UpdatePrePaidRefill"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_cpm_business_logic_http_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cpm_business_logic_http_request_duration_seconds",
    description: "Average response time of a request to prolong lifecycle. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["UpdatePrePaidRefill"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_cpm_business_logic_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_cpm_business_logic_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 24. Business Scheduler
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_business_scheduler_http_requests_total",
    description: "Number of Business Scheduler requests sent.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["CreateGenericCalendarEntry", "UpdateGenericCalendarEntry", "DeleteGenericCalendarEntry", "ReadGenericCalendarEntry"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_business_scheduler_http_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_business_scheduler_http_requests_errors_total",
    description: "Number of Business Scheduler requests resulted in a failure.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      { key: "operation", possibleValues: ["CreateGenericCalendarEntry", "UpdateGenericCalendarEntry", "DeleteGenericCalendarEntry", "ReadGenericCalendarEntry"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_business_scheduler_http_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_business_scheduler_http_request_duration_seconds",
    description: "Average response time of a Business Scheduler request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["CreateGenericCalendarEntry", "UpdateGenericCalendarEntry", "DeleteGenericCalendarEntry", "ReadGenericCalendarEntry"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_business_scheduler_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_business_scheduler_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 25. Provider Resources
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_provider_resources_akka_requests_total",
    description: "Number of Provider Resources Get/Update requests received.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["get", "update"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_provider_resources_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_provider_resources_akka_requests_errors_total",
    description: "Number of Provider Resources Get/Update requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["get", "update"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_provider_resources_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_provider_resources_akka_request_duration_seconds",
    description: "Average response time of a Provider Resource Get/Update request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["get", "update"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_provider_resources_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_provider_resources_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 26. Balance Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_balance_management_akka_requests_total",
    description: "Number of requests received for the balance management service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["MoveContract", "CancelMoveContract", "MoveCustomer", "CommitMoveCustomer", "CancelMoveCustomer", "BillingAccountBalanceExpiryOffsetTrigger"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_balance_management_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_balance_management_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the balance management service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["MoveContract", "CancelMoveContract", "MoveCustomer", "CommitMoveCustomer", "CancelMoveCustomer", "BillingAccountBalanceExpiryOffsetTrigger"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_balance_management_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_balance_management_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the balance management service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["MoveContract", "CancelMoveContract", "MoveCustomer", "CommitMoveCustomer", "CancelMoveCustomer", "BillingAccountBalanceExpiryOffsetTrigger"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_balance_management_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_balance_management_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 27. Transfer Product Data
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_transfer_product_data_akka_requests_total",
    description: "Number of Transfer Product Data requests received.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["TransferProductData"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_transfer_product_data_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_transfer_product_data_akka_requests_errors_total",
    description: "Number of failure Transfer Product Data responses.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["TransferProductData"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_transfer_product_data_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_transfer_product_data_akka_request_duration_seconds",
    description: "Average response time of a Transfer Product Data request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["TransferProductData"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_transfer_product_data_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_transfer_product_data_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 28. CPM ID Translation
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_cpm_id_translation_java_requests_total",
    description: "Number of CPM ID Translation operations performed.",
    type: "counter",
    labels: [
      { key: "method", description: "The Service operation performed.", possibleValues: ["get"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_cpm_id_translation_java_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cpm_id_translation_java_requests_errors_total",
    description: "Number of CPM ID Translation operations resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Charging Internal Response Code to represent the reason of failure." },
      { key: "method", possibleValues: ["get"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_cpm_id_translation_java_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cpm_id_translation_java_request_duration_seconds",
    description: "Average time taken to perform the requested operation via CPM ID Translation Service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "method", possibleValues: ["get"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_cpm_id_translation_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_cpm_id_translation_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 29. COBA Data Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_coba_data_mgmt_java_requests_total",
    description: "Number of COBA Data Enquiry operations performed.",
    type: "counter",
    labels: [
      { key: "table", description: "Represents the COBA table data that has been retrieved." },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_coba_data_mgmt_java_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_coba_data_mgmt_java_requests_errors_total",
    description: "Number of COBA Data Enquiry operations resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Charging Internal Response Code to represent the reason of failure." },
      { key: "table", description: "Represents the COBA table data that has been retrieved." },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_coba_data_mgmt_java_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_coba_data_mgmt_java_request_duration_seconds",
    description: "Time taken to perform the requested operation via COBA Data Enquiry Service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "table", description: "Represents the COBA table data that has been retrieved." },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_coba_data_mgmt_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_coba_data_mgmt_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 30. Recurrence Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_recurrence_akka_requests_total",
    description: "Number of requests received for the recurrence management service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["ExecuteRecurrenceJob", "ReadRecurrenceJob", "ScheduledRecurrenceJob", "TrafficTriggeredRecurrenceJob", "RecurrenceNotificationOffsetTrigger", "PromotionTriggeredRecurrenceJob"] },
      { key: "triggering_service", description: "Any traffic service which contain pre traffic recurrence flow or Internal." },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_recurrence_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_recurrence_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the recurrence management service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["ExecuteRecurrenceJob", "ReadRecurrenceJob", "ScheduledRecurrenceJob", "TrafficTriggeredRecurrenceJob", "RecurrenceNotificationOffsetTrigger", "PromotionTriggeredRecurrenceJob"] },
      { key: "triggering_service", description: "Any traffic service which contain pre traffic recurrence flow or Internal." },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_recurrence_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_recurrence_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the recurrence management service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["ExecuteRecurrenceJob", "ReadRecurrenceJob", "ScheduledRecurrenceJob", "TrafficTriggeredRecurrenceJob", "RecurrenceNotificationOffsetTrigger", "PromotionTriggeredRecurrenceJob"] },
      { key: "triggering_service", description: "Any traffic service which contain pre traffic recurrence flow or Internal." },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_recurrence_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_recurrence_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 31. Test Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_test_management_akka_requests_total",
    description: "Number of requests received for the test management service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["ExecuteEntityAdjustment"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_test_management_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_test_management_akka_requests_errors_total",
    description: "Number of failure responses sent for requests to the test management service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["ExecuteEntityAdjustment"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_test_management_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_test_management_akka_request_duration_seconds",
    description: "Average time taken to process a request received for the test management service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["ExecuteEntityAdjustment"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_test_management_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_test_management_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 32. DNS Lookup
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_dns_lookup_http_requests_total",
    description: "Number of DNS Lookup requests performed including retries.",
    type: "counter",
    labels: [
      { key: "endpoint", description: "Endpoint for connection to application." },
    ],
    category: "dependencies",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_dns_lookup_http_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_dns_lookup_http_requests_errors_total",
    description: "Number of DNS Lookup failure responses received or Number of requests timedout.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "endpoint", description: "Endpoint for connection to application." },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_dns_lookup_http_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_dns_lookup_http_request_duration_seconds",
    description: "Average response time of a DNS Lookup. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "endpoint", description: "Endpoint for connection to application." },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_dns_lookup_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_dns_lookup_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 33. Duplicate Detection
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_duplicate_detection_java_total",
    description: "Number of duplicate requests received per service context.",
    type: "counter",
    labels: [
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_duplicate_detection_java_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 34. Rating Main Sessions
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_created_rating_main_sessions_total",
    description: "Number of main sessions created.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["Unknown", "Internal", "External", "NonProvisioned"] },
      { key: "reason", possibleValues: ["Traffic", "Migration"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_created_rating_main_sessions_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cleared_rating_main_sessions_total",
    description: "Number of main sessions cleared.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["Unknown", "Internal", "External", "NonProvisioned"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
      { key: "reason", possibleValues: ["Expired", "Client-terminated", "Too-many-sessions", "Orig-state-id-mismatch", "Reauthorization-failure", "Abandoned", "Migration", "Failed-Migration", "SingleMscc", "Other"] },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_cleared_rating_main_sessions_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 35. Rating Service Sessions
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_created_rating_service_sessions_total",
    description: "Number of service sessions created.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["Unknown", "Internal", "External", "NonProvisioned"] },
      { key: "reason", possibleValues: ["Traffic", "Migration"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
      { key: "qmi", description: "Indicator if the supervised service session is an online or offline service session.", possibleValues: ["Online", "Offline"] },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_created_rating_service_sessions_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cleared_rating_service_sessions_total",
    description: "Number of service sessions cleared.",
    type: "counter",
    labels: [
      { key: "customer_type", possibleValues: ["Unknown", "Internal", "External", "NonProvisioned"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
      { key: "reason", possibleValues: ["Expired", "Client-terminated", "Too-many-sessions", "Orig-state-id-mismatch", "Reauthorization-failure", "Abandoned", "Migration", "Failed-Migration", "Other"] },
      { key: "qmi", possibleValues: ["Online", "Offline"] },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_cleared_rating_service_sessions_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 36. Settlement Trigger
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_settlement_trigger_produced_kafka_requests_total",
    description: "Number of successfully generated settlement triggers for partner settlement calculations.",
    type: "counter",
    labels: [
      { key: "party_role_involvement_group_ref", description: "Party Role Involvement Group Ref Id" },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_settlement_trigger_produced_kafka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_settlement_trigger_produced_kafka_requests_error_total",
    description: "Number of unsuccessfully generated settlement triggers for partner settlement calculations.",
    type: "counter",
    labels: [
      { key: "code", description: "Error code" },
      { key: "party_role_involvement_group_ref", description: "Party Role Involvement Group Ref Id" },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_settlement_trigger_produced_kafka_requests_error_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 37. Internal Resource Statistics
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_internal_resource_statistics",
    description: "Counter for Charging Internal Statistics.",
    type: "gauge",
    labels: [
      { key: "type", description: "Statistic type.", possibleValues: ["regulation"] },
      { key: "entity", description: "Entity name, e.g. Rf-Core-Average-Latency." },
    ],
    category: "health",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "cha_core_internal_resource_statistics{$filters}" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 38. Event Creation
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_event_creation_java_total",
    description: "Number of Event Records put in queue.",
    type: "counter",
    labels: [
      { key: "type", description: "Represents the event record type that is being created. Example: BalanceAdjustmentEvent, BucketMaintenanceEvent." },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_event_creation_java_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_event_creation_java_errors_total",
    description: "Number of Event Records failed to put in queue.",
    type: "counter",
    labels: [
      { key: "code", description: "Charging Event Result Code to represent the reason of failure. Example: 3002." },
      { key: "type", description: "Represents the event record type that is being created." },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_event_creation_java_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 39. Event Posting (Kafka)
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_event_posting_kafka_total",
    description: "Number of Event Records sent in the kafka interface.",
    type: "counter",
    labels: [
      { key: "customer_partition", description: "Represents the Partition ID where the customer belongs." },
      { key: "topic", description: "The kafka topic the event was sent to." },
      { key: "type", description: "Represents the event record type that is being posted." },
      { key: "transport_layer", description: "Messaging mode.", possibleValues: ["CIL", "MSG"] },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_event_posting_kafka_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_event_posting_kafka_errors_total",
    description: "Number of Event Records failed to send in the kafka interface.",
    type: "counter",
    labels: [
      { key: "code", description: "Charging Event Result Code to represent the reason of failure." },
      { key: "customer_partition", description: "Represents the Partition ID where the customer belongs." },
      { key: "topic", description: "The kafka topic the event was sent to." },
      { key: "type", description: "Represents the event record type that is being posted." },
      { key: "transport_layer", description: "Messaging mode.", possibleValues: ["CIL", "MSG"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_event_posting_kafka_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 40. Event Creation - Notification
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_event_creation_java_requests_total",
    description: "Number of Notification Events successfully put in queue.",
    type: "counter",
    labels: [
      { key: "type", description: "Notification Event." },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_event_creation_java_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_event_creation_java_requests_errors_total",
    description: "Number of Notification Events failed to put in queue.",
    type: "counter",
    labels: [
      { key: "type", description: "Notification Event." },
      { key: "code", description: "Error Code" },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_event_creation_java_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 41. Event Posting - Notification
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_event_posting_kafka_requests_total",
    description: "Number of Notification Events sent successfully.",
    type: "counter",
    labels: [
      { key: "type", description: "Notification Event." },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_event_posting_kafka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_event_posting_kafka_requests_errors_total",
    description: "Number of Notification Events not sent due to a failure.",
    type: "counter",
    labels: [
      { key: "type", description: "Notification Event." },
      { key: "code", description: "Error Code" },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_event_posting_kafka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 42. MNP Lookup
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_mnp_lookup_http_requests_total",
    description: "Number of number portability lookup requests sent including retries.",
    type: "counter",
    labels: [
      { key: "endpoint", description: "Endpoint of an external server." },
      { key: "endpoint_type", description: "Endpoint type of an external server.", possibleValues: ["MAP"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
      { key: "retransmitted", description: "Indicates whether the request is retransmitted.", possibleValues: ["Yes", "No"] },
    ],
    category: "dependencies",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_mnp_lookup_http_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_mnp_lookup_http_requests_errors_total",
    description: "Number of number portability lookup failures or timed out responses received.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Status Code received in the HTTP failure response. If failure response is not received the default value NA is used." },
      { key: "endpoint", description: "Endpoint of an external server." },
      { key: "endpoint_type", possibleValues: ["MAP"] },
      { key: "service_context", description: "Represents Service Context configured in the System via CHA-GUI." },
      { key: "fault_code", description: "Fault code received in the HTTP failure response.", possibleValues: ["1000", "1001", "1002", "1003", "1005", "1008", "1009", "1010", "1011", "1013", "1014", "1", "34", "35", "36", "49", "NA"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_mnp_lookup_http_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_mnp_lookup_http_request_duration_seconds",
    description: "Average response time for a number portability lookup request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "endpoint", description: "Endpoint of an external server." },
      { key: "endpoint_type", possibleValues: ["MAP"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_mnp_lookup_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_mnp_lookup_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 43. Converged Reauthorizations Suppressed
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_converged_reauthorizations_suppressed_total",
    description: "Number of Reauthorizations suppressed.",
    type: "counter",
    labels: [
      { key: "reason", description: "Reason for suppressing the RAR.", possibleValues: ["InPBInterval"] },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_converged_reauthorizations_suppressed_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 44. Log Streaming
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_logstreaming_tcp_requests_errors_total",
    description: "Number of requests that resulted in error when streaming the log events towards the log transformer.",
    type: "counter",
    labels: [
      { key: "appender_name", description: "The name of the appender which is used for streaming the log events." },
    ],
    category: "logstreaming",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_logstreaming_tcp_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_logstreaming_tcp_queue_events_count",
    description: "Number of log events present in the streaming appender's queue which are yet to be sent to the log transformer.",
    type: "gauge",
    labels: [
      { key: "appender_name", description: "The name of the appender which is used for streaming the log events." },
    ],
    category: "logstreaming",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "cha_core_logstreaming_tcp_queue_events_count{$filters}" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 45. Session Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_session_management_akka_requests_total",
    description: "Number of session migration requests received for the session management service.",
    type: "counter",
    labels: [
      { key: "operation", possibleValues: ["ChargingInternalSessionMigration", "PolicySessionCreation"] },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_session_management_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_session_migrations_total",
    description: "Number of migrated main sessions.",
    type: "counter",
    labels: [
      { key: "type", possibleValues: ["ChargingInternalSessionMigration", "PolicySessionCreation"] },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_session_migrations_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_session_management_akka_requests_errors_total",
    description: "Number of failure responses sent for session migration requests to the session management service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      { key: "operation", possibleValues: ["ChargingInternalSessionMigration", "PolicySessionCreation"] },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_session_management_akka_requests_errors_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_session_management_akka_request_duration_seconds",
    description: "Average time taken to process a session migration request received for the session management service. The unit of measurement is seconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      { key: "operation", possibleValues: ["ChargingInternalSessionMigration", "PolicySessionCreation"] },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_core_session_management_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_core_session_management_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 46. Internal Routing
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_internal_routing_akka_requests_total",
    description: "Number of requests received from or sent to Charging Access or Charging Core.",
    type: "counter",
    labels: [
      { key: "customer_partition", description: "Represents the customer partition used for routing. NA when not applicable.", possibleValues: ["NA"] },
      { key: "direction", description: "Request direction IN to CHA Core or OUT to CHA Access or CHA Core.", possibleValues: ["IN", "OUT"] },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [{ promql: "rate(cha_core_internal_routing_akka_requests_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 47. CHA Data Cache
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_cha_data_cache_total",
    description: "Number of times the individual cache of CHA customers is accessed.",
    type: "counter",
    labels: [
      { key: "outcome", description: "Cache access outcome. Stale is used when cache exists but is marked as stale and cannot be used.", possibleValues: ["hit", "miss", "stale"] },
    ],
    category: "health",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_cha_data_cache_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_core_cha_data_cache_eviction_total",
    description: "Number of times a CHA data cache is removed.",
    type: "counter",
    labels: [
      { key: "reason", description: "Eviction reason.", possibleValues: ["memory", "notification", "noSessions"] },
    ],
    category: "health",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_cha_data_cache_eviction_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 48. Replicate Charging
  // ---------------------------------------------------------------------------
  {
    name: "cha_core_replicate_charging_records_total",
    description: "Number of processed replicate charging records.",
    type: "counter",
    labels: [
      { key: "code", possibleValues: ["ok", "originalValueMismatch", "duplicateDetection"] },
      { key: "customer_partition", description: "Represents the partition ID where the customer belongs." },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [{ promql: "rate(cha_core_replicate_charging_records_total{$filters}[5m])" }],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
];
