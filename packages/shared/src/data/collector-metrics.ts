import type { Metric } from "../schemas/metric.js";

const DOC_REF = "698/1553-CSH 109 900 Uen";
const SECTION = "Charging Collector Metrics";
const COMPONENT = "collector";

export const collectorMetrics: Metric[] = [
  // ---------------------------------------------------------------------------
  // 1. Balance Enquiry
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_balance_enquiry_akka_requests_total",
    description:
      "Number of requests received for the balance enquiry service.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Balance enquiry operation type.",
        possibleValues: ["ExecuteBalanceSnapshot", "ReadBucketBalance"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_balance_enquiry_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_balance_enquiry_akka_requests_errors_total",
    description:
      "Number of failure responses sent for requests to the balance enquiry service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Balance enquiry operation type.",
        possibleValues: ["ExecuteBalanceSnapshot", "ReadBucketBalance"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_balance_enquiry_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_balance_enquiry_akka_request_duration_seconds",
    description:
      "Average time taken to process a request received for the balance enquiry service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Balance enquiry operation type.",
        possibleValues: ["ExecuteBalanceSnapshot", "ReadBucketBalance"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_balance_enquiry_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_balance_enquiry_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 2. Balance Adjustment
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_balance_adjustment_akka_requests_total",
    description:
      "Number of requests received for the balance adjustment service.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Balance adjustment operation type.",
        possibleValues: ["UpdateBucketBalance"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_balance_adjustment_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_balance_adjustment_akka_requests_errors_total",
    description:
      "Number of failure responses sent for requests to the balance adjustment service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Balance adjustment operation type.",
        possibleValues: ["UpdateBucketBalance"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_balance_adjustment_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_balance_adjustment_akka_request_duration_seconds",
    description:
      "Average time taken to process a request received for the balance adjustment service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Balance adjustment operation type.",
        possibleValues: ["UpdateBucketBalance"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_balance_adjustment_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_balance_adjustment_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 3. Balance Expiry Offset
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_balance_expiry_offset_akka_requests_total",
    description: "Number of Balance Expiry Offset Trigger requests received.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Balance expiry offset operation type.",
        possibleValues: ["BalanceExpiryOffsetTrigger"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_balance_expiry_offset_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_balance_expiry_offset_akka_requests_errors_total",
    description:
      "Number of Balance Expiry Offset Trigger requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Balance expiry offset operation type.",
        possibleValues: ["BalanceExpiryOffsetTrigger"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_balance_expiry_offset_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_balance_expiry_offset_akka_request_duration_seconds",
    description:
      "Average response time of a Balance Expiry Offset Trigger request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Balance expiry offset operation type.",
        possibleValues: ["BalanceExpiryOffsetTrigger"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_balance_expiry_offset_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_balance_expiry_offset_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 4. CIL Data Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_cil_data_mgmt_java_requests_total",
    description: "Number of CIL Data Management operations performed.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description:
          "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get", "put", "delete"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_cil_data_mgmt_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_cil_data_mgmt_java_requests_errors_total",
    description:
      "Number of CIL Data Management operations resulted in an error.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Internal Response Code to represent the reason of failure.",
      },
      {
        key: "customer_partition",
        description:
          "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get", "put", "delete"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_cil_data_mgmt_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_cil_data_mgmt_java_request_duration_seconds",
    description:
      "Time taken to perform the requested operation via CIL Data Management Service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "customer_partition",
        description:
          "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get", "put", "delete"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_cil_data_mgmt_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_cil_data_mgmt_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 5. RMCA Data Enquiry
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_rmca_data_enquiry_java_requests_total",
    description: "Number of RMCA Data Management requests executed.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "RMCA data enquiry operation type.",
        possibleValues: ["get"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_rmca_data_enquiry_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_rmca_data_enquiry_java_requests_errors_total",
    description:
      "Number of RMCA Data Management requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "RMCA data enquiry operation type.",
        possibleValues: ["get"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_rmca_data_enquiry_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_rmca_data_enquiry_java_request_duration_seconds",
    description:
      "Average response time of a RMCA Data Management request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "RMCA data enquiry operation type.",
        possibleValues: ["get"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_rmca_data_enquiry_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_rmca_data_enquiry_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 6. CPM Data Enquiry
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_cpm_data_enquiry_java_requests_total",
    description: "Number of CPM Data Enquiry requests executed.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "CPM data enquiry operation type.",
        possibleValues: [
          "getCustomer",
          "getPartyRole",
          "getEntitySpecifications",
          "getCustomerAndContract",
          "getPartyRoleAndContract",
          "getPartitionId",
          "getPartyRoleInvolvementGroup",
          "getResolvedContract",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_cpm_data_enquiry_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_cpm_data_enquiry_java_requests_errors_total",
    description:
      "Number of CPM Data Enquiry requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "CPM data enquiry operation type.",
        possibleValues: [
          "getCustomer",
          "getPartyRole",
          "getEntitySpecifications",
          "getCustomerAndContract",
          "getPartyRoleAndContract",
          "getPartitionId",
          "getPartyRoleInvolvementGroup",
          "getResolvedContract",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_cpm_data_enquiry_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_cpm_data_enquiry_java_request_duration_seconds",
    description:
      "Average response time of a CPM Data Enquiry request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "CPM data enquiry operation type.",
        possibleValues: [
          "getCustomer",
          "getPartyRole",
          "getEntitySpecifications",
          "getCustomerAndContract",
          "getPartyRoleAndContract",
          "getPartitionId",
          "getPartyRoleInvolvementGroup",
          "getResolvedContract",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_cpm_data_enquiry_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_cpm_data_enquiry_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 7. Purchase Charge
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_purchase_charge_akka_requests_total",
    description:
      "Number of requests received for the purchase charge service.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Purchase charge operation type.",
        possibleValues: [
          "CreateReservation",
          "CommitReservation",
          "CancelReservation",
          "BasketRateAndCharge",
          "BasketRateAndDeduct",
          "BasketRateAndExecute",
          "BasketRateAndAdvice",
          "CancelBasketRateAndChargeReservation",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_purchase_charge_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_purchase_charge_akka_requests_errors_total",
    description:
      "Number of failure responses sent for requests to the purchase charge service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Purchase charge operation type.",
        possibleValues: [
          "CreateReservation",
          "CommitReservation",
          "CancelReservation",
          "BasketRateAndCharge",
          "BasketRateAndDeduct",
          "BasketRateAndExecute",
          "BasketRateAndAdvice",
          "CancelBasketRateAndChargeReservation",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_purchase_charge_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_purchase_charge_akka_request_duration_seconds",
    description:
      "Average time taken to process a request received for the purchase charge service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Purchase charge operation type.",
        possibleValues: [
          "CreateReservation",
          "CommitReservation",
          "CancelReservation",
          "BasketRateAndCharge",
          "BasketRateAndDeduct",
          "BasketRateAndExecute",
          "BasketRateAndAdvice",
          "CancelBasketRateAndChargeReservation",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_purchase_charge_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_purchase_charge_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 8. Event Consumption
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_event_consumption_akka_requests_total",
    description: "Number of Customer Status Update requests received.",
    type: "counter",
    labels: [
      {
        key: "type",
        description: "Event consumption request type.",
        possibleValues: [
          "CustomerStatusUpdate",
          "ProductStatusNotificationAcknowledge",
        ],
      },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_event_consumption_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_event_consumption_akka_requests_errors_total",
    description:
      "Number of Customer Status Update requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "type",
        description: "Event consumption request type.",
        possibleValues: [
          "CustomerStatusUpdate",
          "ProductStatusNotificationAcknowledge",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_event_consumption_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_event_consumption_akka_request_duration_seconds",
    description:
      "Average response time of a Customer Status Update request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "type",
        description: "Event consumption request type.",
        possibleValues: [
          "CustomerStatusUpdate",
          "ProductStatusNotificationAcknowledge",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_event_consumption_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_event_consumption_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 9. Periodic Operation
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_periodic_operation_java_requests_total",
    description:
      "Number of customers/contracts/calendar entries evaluated, with recurrence configured, or with at least one due recurrence.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Periodic operation type.",
        possibleValues: [
          "Customers-Evaluated",
          "Customers-With-Periodic-Job",
          "Customers-With-Due-Periodic-Job",
          "Contracts-Evaluated",
          "Contracts-With-Periodic-Job",
          "Contracts-With-Due-Periodic-Job",
          "Calendar-Entries-Evaluated",
          "Calendar-Entries-Due",
          "Calendar-Entries-Speculation",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_periodic_operation_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_periodic_operation_java_requests_errors_total",
    description:
      "Number of customers/contracts/calendar entries experienced problem while executing recurrence or speculation.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "resource",
        description: "Resource that experienced the error.",
        possibleValues: ["Customer", "Contract", "Calendar-Entries"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_periodic_operation_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 10. Business Scheduler
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_business_scheduler_http_requests_total",
    description: "Number of Business Scheduler requests sent.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Business scheduler operation type.",
        possibleValues: [
          "CreateGenericCalendarEntry",
          "UpdateGenericCalendarEntry",
          "DeleteGenericCalendarEntry",
          "ReadGenericCalendarEntry",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_business_scheduler_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_business_scheduler_http_requests_errors_total",
    description:
      "Number of Business Scheduler requests resulted in a failure.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      {
        key: "operation",
        description: "Business scheduler operation type.",
        possibleValues: [
          "CreateGenericCalendarEntry",
          "UpdateGenericCalendarEntry",
          "DeleteGenericCalendarEntry",
          "ReadGenericCalendarEntry",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_business_scheduler_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_business_scheduler_http_request_duration_seconds",
    description:
      "Average response time of a Business Scheduler request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Business scheduler operation type.",
        possibleValues: [
          "CreateGenericCalendarEntry",
          "UpdateGenericCalendarEntry",
          "DeleteGenericCalendarEntry",
          "ReadGenericCalendarEntry",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_business_scheduler_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_business_scheduler_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 11. Provider Resources
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_provider_resources_akka_requests_total",
    description:
      "Number of Provider Resources Get/Update requests received.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Provider resource operation type.",
        possibleValues: ["get", "update"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_provider_resources_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_provider_resources_akka_requests_errors_total",
    description:
      "Number of Provider Resources Get/Update requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Provider resource operation type.",
        possibleValues: ["get", "update"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_provider_resources_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_provider_resources_akka_request_duration_seconds",
    description:
      "Average response time of a Provider Resource Get/Update request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Provider resource operation type.",
        possibleValues: ["get", "update"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_provider_resources_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_provider_resources_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 12. Balance Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_balance_management_akka_requests_total",
    description:
      "Number of requests received for the balance management service.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Balance management operation type.",
        possibleValues: [
          "MoveContract",
          "CancelMoveContract",
          "MoveCustomer",
          "CommitMoveCustomer",
          "CancelMoveCustomer",
          "BillingAccountBalanceExpiryOffsetTrigger",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_balance_management_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_balance_management_akka_requests_errors_total",
    description:
      "Number of failure responses sent for requests to the balance management service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Balance management operation type.",
        possibleValues: [
          "MoveContract",
          "CancelMoveContract",
          "MoveCustomer",
          "CommitMoveCustomer",
          "CancelMoveCustomer",
          "BillingAccountBalanceExpiryOffsetTrigger",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_balance_management_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_balance_management_akka_request_duration_seconds",
    description:
      "Average time taken to process a request received for the balance management service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Balance management operation type.",
        possibleValues: [
          "MoveContract",
          "CancelMoveContract",
          "MoveCustomer",
          "CommitMoveCustomer",
          "CancelMoveCustomer",
          "BillingAccountBalanceExpiryOffsetTrigger",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_balance_management_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_balance_management_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 13. Transfer Product Data
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_transfer_product_data_akka_requests_total",
    description: "Number of Transfer Product Data requests received.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Transfer product data operation type.",
        possibleValues: ["TransferProductData"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_transfer_product_data_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_transfer_product_data_akka_requests_errors_total",
    description: "Number of failure Transfer Product Data responses.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Transfer product data operation type.",
        possibleValues: ["TransferProductData"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_transfer_product_data_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_transfer_product_data_akka_request_duration_seconds",
    description:
      "Average response time of a Transfer Product Data request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Transfer product data operation type.",
        possibleValues: ["TransferProductData"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_transfer_product_data_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_transfer_product_data_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 14. CPM ID Translation
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_cpm_id_translation_java_requests_total",
    description: "Number of CPM ID Translation operations performed.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_cpm_id_translation_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_cpm_id_translation_java_requests_errors_total",
    description:
      "Number of CPM ID Translation operations resulted in an error.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Internal Response Code to represent the reason of failure.",
      },
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_cpm_id_translation_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_cpm_id_translation_java_request_duration_seconds",
    description:
      "Average time taken to perform the requested operation via CPM ID Translation Service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_cpm_id_translation_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_cpm_id_translation_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 15. COBA Data Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_coba_data_mgmt_java_requests_total",
    description: "Number of COBA Data Enquiry operations performed.",
    type: "counter",
    labels: [
      {
        key: "table",
        description: "Represents the COBA table data that has been retrieved.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_coba_data_mgmt_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_coba_data_mgmt_java_requests_errors_total",
    description:
      "Number of COBA Data Enquiry operations resulted in an error.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Internal Response Code to represent the reason of failure.",
      },
      {
        key: "table",
        description: "Represents the COBA table data that has been retrieved.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_coba_data_mgmt_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_coba_data_mgmt_java_request_duration_seconds",
    description:
      "Time taken to perform the requested operation via COBA Data Enquiry Service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "table",
        description: "Represents the COBA table data that has been retrieved.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_coba_data_mgmt_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_coba_data_mgmt_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 16. Recurrence
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_recurrence_akka_requests_total",
    description:
      "Number of requests received for the recurrence management service.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Recurrence management operation type.",
        possibleValues: [
          "ExecuteRecurrenceJob",
          "ReadRecurrenceJob",
          "ScheduledRecurrenceJob",
          "TrafficTriggeredRecurrenceJob",
          "RecurrenceNotificationOffsetTrigger",
          "PromotionTriggeredRecurrenceJob",
        ],
      },
      {
        key: "triggering_service",
        description:
          "Any traffic service which contains pre-traffic recurrence flow, or Internal if operation is not TrafficTriggeredRecurrenceJob.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_recurrence_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_recurrence_akka_requests_errors_total",
    description:
      "Number of failure responses sent for requests to the recurrence management service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Recurrence management operation type.",
        possibleValues: [
          "ExecuteRecurrenceJob",
          "ReadRecurrenceJob",
          "ScheduledRecurrenceJob",
          "TrafficTriggeredRecurrenceJob",
          "RecurrenceNotificationOffsetTrigger",
          "PromotionTriggeredRecurrenceJob",
        ],
      },
      {
        key: "triggering_service",
        description:
          "Any traffic service which contains pre-traffic recurrence flow, or Internal if operation is not TrafficTriggeredRecurrenceJob.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_recurrence_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_recurrence_akka_request_duration_seconds",
    description:
      "Average time taken to process a request received for the recurrence management service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Recurrence management operation type.",
        possibleValues: [
          "ExecuteRecurrenceJob",
          "ReadRecurrenceJob",
          "ScheduledRecurrenceJob",
          "TrafficTriggeredRecurrenceJob",
          "RecurrenceNotificationOffsetTrigger",
          "PromotionTriggeredRecurrenceJob",
        ],
      },
      {
        key: "triggering_service",
        description:
          "Any traffic service which contains pre-traffic recurrence flow, or Internal if operation is not TrafficTriggeredRecurrenceJob.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_recurrence_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_recurrence_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 17. Test Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_test_management_akka_requests_total",
    description:
      "Number of requests received for the test management service.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Test management operation type.",
        possibleValues: ["ExecuteEntityAdjustment"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_test_management_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_test_management_akka_requests_errors_total",
    description:
      "Number of failure responses sent for requests to the test management service.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "operation",
        description: "Test management operation type.",
        possibleValues: ["ExecuteEntityAdjustment"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_test_management_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_test_management_akka_request_duration_seconds",
    description:
      "Average time taken to process a request received for the test management service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Test management operation type.",
        possibleValues: ["ExecuteEntityAdjustment"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_test_management_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_test_management_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 18. DNS Lookup
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_dns_lookup_http_requests_total",
    description:
      "Number of DNS Lookup requests performed including retries.",
    type: "counter",
    labels: [
      {
        key: "endpoint",
        description: "Endpoint for connection to application.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_dns_lookup_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_dns_lookup_http_requests_errors_total",
    description:
      "Number of DNS Lookup failure responses received or Number of requests timed out.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "endpoint",
        description: "Endpoint for connection to application.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_dns_lookup_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_dns_lookup_http_request_duration_seconds",
    description:
      "Average response time of a DNS Lookup. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "endpoint",
        description: "Endpoint for connection to application.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_dns_lookup_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_dns_lookup_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 19. Duplicate Detection
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_duplicate_detection_java_total",
    description:
      "Number of duplicate requests received per service context.",
    type: "counter",
    labels: [
      {
        key: "service_context",
        description:
          "Represents Service Context configured in the System via CHA-GUI.",
      },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["ENG"],
    examples: [
      {
        promql: "rate(cha_collector_duplicate_detection_java_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 20. Deferred RAC - Customer
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_processed_deferred_rac_started_customer_total",
    description:
      "Number of mass resource customers that has started processing for the deferred rate and charge service.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description:
          "Represents the Partition ID where the customer belongs.",
      },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_processed_deferred_rac_started_customer_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_processed_deferred_rac_completed_customer_total",
    description:
      "Number of mass resource customers that has completed processing (both success and failure) for the deferred rate and charge service. A failed customer will normally be processed again.",
    type: "counter",
    labels: [
      { key: "code", description: "Result Code" },
      {
        key: "customer_partition",
        description:
          "Represents the Partition ID where the customer belongs.",
      },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_processed_deferred_rac_completed_customer_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_processed_deferred_rac_customer_duration_seconds",
    description:
      "Average time for processing a mass resource customer for the deferred rate and charge service.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "customer_partition",
        description:
          "Represents the Partition ID where the customer belongs.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_processed_deferred_rac_customer_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_processed_deferred_rac_customer_duration_seconds_count{$filters}[5m])",
        note: "Average customer processing duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 21. Deferred RAC - Batch
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_processed_deferred_rac_batch_total",
    description:
      "Number of batches processed for the deferred rate and charge service.",
    type: "counter",
    labels: [],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_processed_deferred_rac_batch_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_processed_deferred_rac_batch_errors_total",
    description:
      "Number of batches failed to process for the deferred rate and charge service.",
    type: "counter",
    labels: [{ key: "code", description: "Error code" }],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_processed_deferred_rac_batch_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_processed_deferred_rac_batch_duration_seconds",
    description:
      "Average time taken to process a batch for the deferred rate and charge service. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_processed_deferred_rac_batch_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_processed_deferred_rac_batch_duration_seconds_count{$filters}[5m])",
        note: "Average batch processing duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_processed_deferred_rac_events_per_batch_total",
    description: "Number of events per batch.",
    type: "summary",
    labels: [],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_processed_deferred_rac_events_per_batch_total_sum{$filters}[5m]) / rate(cha_collector_processed_deferred_rac_events_per_batch_total_count{$filters}[5m])",
        note: "Average events per batch over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 22. Deferred RAC - Event
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_processed_deferred_rac_event_total",
    description:
      "Number of events processed for the deferred rate and charge service.",
    type: "counter",
    labels: [],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_processed_deferred_rac_event_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_processed_deferred_rac_event_errors_total",
    description:
      "Number of events failed to process for the deferred rate and charge service.",
    type: "counter",
    labels: [{ key: "code", description: "Error code" }],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_processed_deferred_rac_event_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_processed_deferred_rac_event_duration_seconds",
    description:
      "Average time taken to process an event for the deferred rate and charge service.",
    unit: "seconds",
    type: "summary",
    labels: [],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_processed_deferred_rac_event_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_processed_deferred_rac_event_duration_seconds_count{$filters}[5m])",
        note: "Average event processing duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 23. Settlement Trigger
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_settlement_trigger_consumed_kafka_requests_total",
    description:
      "Number of successfully rated and charged settlement triggers.",
    type: "counter",
    labels: [
      {
        key: "party_role_involvement_group_ref",
        description: "Party Role Involvement Group Ref Id",
      },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_settlement_trigger_consumed_kafka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_settlement_trigger_consumed_kafka_requests_error_total",
    description:
      "Number of unsuccessfully rated and charged settlement triggers.",
    type: "counter",
    labels: [
      { key: "code", description: "Error code" },
      {
        key: "party_role_involvement_group_ref",
        description: "Party Role Involvement Group Ref Id",
      },
    ],
    category: "domain",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_settlement_trigger_consumed_kafka_requests_error_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 24. Partner Resources
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_partner_resources_akka_requests_total",
    description:
      "Number of Partner Resources update requests received.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Partner resource operation type.",
        possibleValues: ["update"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_partner_resources_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_partner_resources_akka_requests_errors_total",
    description:
      "Number of Partner Resources failed update requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "Error code" },
      {
        key: "operation",
        description: "Partner resource operation type.",
        possibleValues: ["update"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_partner_resources_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_partner_resources_akka_request_duration_seconds",
    description:
      "Average response time of a Partner Provider Resource update request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Partner resource operation type.",
        possibleValues: ["update"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_partner_resources_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_partner_resources_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 25. Internal Resource Statistics
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_internal_resource_statistics",
    description: "Counter for Charging Internal Statistics.",
    type: "gauge",
    labels: [
      {
        key: "type",
        description: "Statistic type.",
        possibleValues: ["regulation"],
      },
      {
        key: "entity",
        description:
          "Entity name, e.g. Rf-Core-Average-Latency.",
      },
    ],
    category: "health",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "cha_collector_internal_resource_statistics{$filters}",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 26. Event Creation (java_total)
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_event_creation_java_total",
    description: "Number of Event Records put in queue.",
    type: "counter",
    labels: [
      {
        key: "type",
        description:
          "Represents the event record type that is being created. Example: BalanceAdjustmentEvent, BucketMaintenanceEvent.",
      },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_event_creation_java_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_event_creation_java_errors_total",
    description: "Number of Event Records failed to put in queue.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Event Result Code to represent the reason of failure. Example: 3002.",
      },
      {
        key: "type",
        description:
          "Represents the event record type that is being created. Example: BalanceAdjustmentEvent, BucketMaintenanceEvent.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_event_creation_java_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 27. Event Posting (kafka_total)
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_event_posting_kafka_total",
    description:
      "Number of Event Records sent in the kafka interface.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description:
          "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "topic",
        description: "The kafka topic the event was sent to.",
      },
      {
        key: "type",
        description:
          "Represents the event record type that is being posted. Example: BalanceAdjustmentEvent, UsageChargeEvent.",
      },
      {
        key: "transport_layer",
        description: "Messaging mode.",
        possibleValues: ["CIL", "MSG"],
      },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_event_posting_kafka_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_event_posting_kafka_errors_total",
    description:
      "Number of Event Records failed to send in the kafka interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Event Result Code to represent the reason of failure. Example: 3002.",
      },
      {
        key: "customer_partition",
        description:
          "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "topic",
        description: "The kafka topic the event was sent to.",
      },
      {
        key: "type",
        description:
          "Represents the event record type that is being posted. Example: BalanceAdjustmentEvent, UsageChargeEvent.",
      },
      {
        key: "transport_layer",
        description: "Messaging mode.",
        possibleValues: ["CIL", "MSG"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_event_posting_kafka_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 28. Event Creation - Notification (java_requests_total)
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_event_creation_java_requests_total",
    description:
      "Number of Notification Events successfully put in queue.",
    type: "counter",
    labels: [
      {
        key: "type",
        description: "Notification Event.",
      },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_event_creation_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_event_creation_java_requests_errors_total",
    description:
      "Number of Notification Events failed to put in queue.",
    type: "counter",
    labels: [
      {
        key: "type",
        description: "Notification Event.",
      },
      { key: "code", description: "Error Code" },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_event_creation_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 29. Event Posting - Notification (kafka_requests_total)
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_event_posting_kafka_requests_total",
    description:
      "Number of Notification Events sent successfully.",
    type: "counter",
    labels: [
      {
        key: "type",
        description: "Notification Event.",
      },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_event_posting_kafka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_event_posting_kafka_requests_errors_total",
    description:
      "Number of Notification Events not sent due to a failure.",
    type: "counter",
    labels: [
      {
        key: "type",
        description: "Notification Event.",
      },
      { key: "code", description: "Error Code" },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_event_posting_kafka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 30. MNP Lookup
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_mnp_lookup_http_requests_total",
    description:
      "Number of number portability lookup requests sent including retries.",
    type: "counter",
    labels: [
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
      {
        key: "endpoint_type",
        description: "Endpoint type of an external server.",
        possibleValues: ["MAP"],
      },
      {
        key: "service_context",
        description:
          "Represents Service Context configured in the System via CHA-GUI.",
      },
      {
        key: "retransmitted",
        description: "Indicates whether the request is retransmitted.",
        possibleValues: ["Yes", "No"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_mnp_lookup_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_mnp_lookup_http_requests_errors_total",
    description:
      "Number of number portability lookup failures or timed out responses received.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "HTTP Status Code received in the HTTP failure response. If failure response is not received the default value NA is used.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
      {
        key: "endpoint_type",
        description: "Endpoint type of an external server.",
        possibleValues: ["MAP"],
      },
      {
        key: "service_context",
        description:
          "Represents Service Context configured in the System via CHA-GUI.",
      },
      {
        key: "fault_code",
        description:
          "Fault code received in the HTTP failure response. If failure response is not received the default value NA is used.",
        possibleValues: [
          "1000",
          "1001",
          "1002",
          "1003",
          "1005",
          "1008",
          "1009",
          "1010",
          "1011",
          "1013",
          "1014",
          "1",
          "34",
          "35",
          "36",
          "49",
          "NA",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: "rate(cha_collector_mnp_lookup_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_mnp_lookup_http_request_duration_seconds",
    description:
      "Average response time for a number portability lookup request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
      {
        key: "endpoint_type",
        description: "Endpoint type of an external server.",
        possibleValues: ["MAP"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_collector_mnp_lookup_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_collector_mnp_lookup_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 31. Log Streaming
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_logstreaming_tcp_requests_errors_total",
    description:
      "Number of requests that resulted in error when streaming the log events towards the log transformer.",
    type: "counter",
    labels: [
      {
        key: "appender_name",
        description:
          "The name of the appender which is used for streaming the log events.",
      },
    ],
    category: "logstreaming",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_logstreaming_tcp_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_logstreaming_tcp_queue_events_count",
    description:
      "Number of log events present in the streaming appender's queue which are yet to be sent to the log transformer.",
    type: "gauge",
    labels: [
      {
        key: "appender_name",
        description:
          "The name of the appender which is used for streaming the log events.",
      },
    ],
    category: "logstreaming",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "cha_collector_logstreaming_tcp_queue_events_count{$filters}",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 32. CHA Data Cache
  // ---------------------------------------------------------------------------
  {
    name: "cha_collector_cha_data_cache_total",
    description:
      "Number of times the individual cache of CHA customers is accessed.",
    type: "counter",
    labels: [
      {
        key: "outcome",
        description:
          "Cache access outcome. Stale is used when cache exists but is marked as stale and cannot be used.",
        possibleValues: ["hit", "miss", "stale"],
      },
    ],
    category: "health",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_cha_data_cache_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_collector_cha_data_cache_eviction_total",
    description: "Number of times a CHA data cache is removed.",
    type: "counter",
    labels: [
      {
        key: "reason",
        description:
          "Eviction reason. Notification is used in the replicate charging scenario when a cache is removed on passive application group due to a notification from active application group.",
        possibleValues: ["memory", "notification", "noSessions"],
      },
    ],
    category: "health",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: "rate(cha_collector_cha_data_cache_eviction_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
];
