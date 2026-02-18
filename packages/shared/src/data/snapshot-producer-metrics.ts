import type { Metric } from "../schemas/metric.js";

export const snapshotProducerMetrics: Metric[] = [
  {
    name: "cha_snapshot_producer_internal_resource_statistics",
    description: "Counter for Charging Internal Statistics.",
    type: "gauge",
    labels: [
      {
        key: "type",
        description: "Type of statistic.",
        possibleValues: ["regulation"],
      },
      {
        key: "entity",
        description: "The entity being measured.",
        possibleValues: ["Rf-Core-Average-Latency"],
      },
    ],
    category: "health",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'cha_snapshot_producer_internal_resource_statistics{$filters}',
        note: "Current internal resource statistics",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_cil_data_mgmt_java_requests_total",
    description: "Number of CIL Data Management operations performed.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get", "put", "delete"],
      },
    ],
    category: "throughput",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_cil_data_mgmt_java_requests_total{$filters}[5m])',
        note: "CIL data management request rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_cil_data_mgmt_java_requests_errors_total",
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
        description: "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get", "put", "delete"],
      },
    ],
    category: "errors",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_cil_data_mgmt_java_requests_errors_total{$filters}[5m])',
        note: "CIL data management error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_cil_data_mgmt_java_request_duration_seconds",
    description:
      "Time taken to perform the requested operation via CIL Data Management Service. The unit of measurement is milliseconds.",
    unit: "milliseconds",
    type: "summary",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "method",
        description: "The Service operation that has been performed.",
        possibleValues: ["get", "put", "delete"],
      },
    ],
    category: "latency",
    component: "snapshot_producer",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_cil_data_mgmt_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_snapshot_producer_cil_data_mgmt_java_request_duration_seconds_count{$filters}[5m])',
        note: "Average CIL data management request duration",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_coba_data_mgmt_java_requests_total",
    description: "Number of COBA Data Enquiry operations performed.",
    type: "counter",
    labels: [
      {
        key: "table",
        description: "Represents the COBA table data that has been retrieved.",
      },
    ],
    category: "throughput",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_coba_data_mgmt_java_requests_total{$filters}[5m])',
        note: "COBA data enquiry request rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_coba_data_mgmt_java_requests_errors_total",
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
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_coba_data_mgmt_java_requests_errors_total{$filters}[5m])',
        note: "COBA data enquiry error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_coba_data_mgmt_java_request_duration_seconds",
    description:
      "Time taken to perform the requested operation via COBA Data Enquiry Service. The unit of measurement is milliseconds.",
    unit: "milliseconds",
    type: "summary",
    labels: [
      {
        key: "table",
        description: "Represents the COBA table data that has been retrieved.",
      },
    ],
    category: "latency",
    component: "snapshot_producer",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_coba_data_mgmt_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_snapshot_producer_coba_data_mgmt_java_request_duration_seconds_count{$filters}[5m])',
        note: "Average COBA data enquiry duration",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_rmca_data_enquiry_java_requests_total",
    description: "Number of RMCA Data Management requests executed.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "The operation performed.",
        possibleValues: ["get"],
      },
    ],
    category: "throughput",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_rmca_data_enquiry_java_requests_total{$filters}[5m])',
        note: "RMCA data enquiry request rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_rmca_data_enquiry_java_requests_errors_total",
    description:
      "Number of RMCA Data Management requests resulted in an error.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Internal Response Code to represent the reason of failure.",
      },
      {
        key: "operation",
        description: "The operation performed.",
        possibleValues: ["get"],
      },
    ],
    category: "errors",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_rmca_data_enquiry_java_requests_errors_total{$filters}[5m])',
        note: "RMCA data enquiry error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_rmca_data_enquiry_java_request_duration_seconds",
    description:
      "Average response time of a RMCA Data Management request. The unit of measurement is milliseconds.",
    unit: "milliseconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "The operation performed.",
        possibleValues: ["get"],
      },
    ],
    category: "latency",
    component: "snapshot_producer",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_rmca_data_enquiry_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_snapshot_producer_rmca_data_enquiry_java_request_duration_seconds_count{$filters}[5m])',
        note: "Average RMCA data enquiry duration",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_cpm_data_enquiry_java_requests_total",
    description: "Number of CPM Data Enquiry requests executed.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "The operation performed.",
        possibleValues: ["getCustomerAndContract", "getPartyRoleAndContract"],
      },
    ],
    category: "throughput",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_cpm_data_enquiry_java_requests_total{$filters}[5m])',
        note: "CPM data enquiry request rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_cpm_data_enquiry_java_requests_errors_total",
    description:
      "Number of CPM Data Enquiry requests resulted in an error.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Internal Response Code to represent the reason of failure.",
      },
      {
        key: "operation",
        description: "The operation performed.",
        possibleValues: ["getCustomerAndContract", "getPartyRoleAndContract"],
      },
    ],
    category: "errors",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_cpm_data_enquiry_java_requests_errors_total{$filters}[5m])',
        note: "CPM data enquiry error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_cpm_data_enquiry_java_request_duration_seconds",
    description:
      "Average response time of a CPM Data Enquiry request. The unit of measurement is milliseconds.",
    unit: "milliseconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "The operation performed.",
        possibleValues: ["getCustomerAndContract", "getPartyRoleAndContract"],
      },
    ],
    category: "latency",
    component: "snapshot_producer",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_cpm_data_enquiry_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_snapshot_producer_cpm_data_enquiry_java_request_duration_seconds_count{$filters}[5m])',
        note: "Average CPM data enquiry duration",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_event_posting_kafka_total",
    description:
      "Number of Event Records sent in the kafka interface.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "topic",
        description: "The kafka topic the event was sent to.",
      },
      {
        key: "type",
        description:
          "Represents the event record type that is being posted.",
        possibleValues: ["BalanceSnapshotEvent"],
      },
      {
        key: "transport_layer",
        description: "Messaging mode.",
        possibleValues: ["CIL", "MSG"],
      },
    ],
    category: "events",
    component: "snapshot_producer",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_event_posting_kafka_total{$filters}[5m])',
        note: "Event posting rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_event_posting_kafka_errors_total",
    description:
      "Number of Event Records failed to send in the kafka interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Event Result Code to represent the reason of failure.",
      },
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "topic",
        description: "The kafka topic the event was sent to.",
      },
      {
        key: "type",
        description:
          "Represents the event record type that is being posted.",
        possibleValues: ["BalanceSnapshotEvent"],
      },
      {
        key: "transport_layer",
        description: "Messaging mode.",
        possibleValues: ["CIL", "MSG"],
      },
    ],
    category: "errors",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_event_posting_kafka_errors_total{$filters}[5m])',
        note: "Event posting error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_customer_balance_snapshot_requests_total",
    description:
      "Number of customers evaluated for balance information of billing account buckets during snapshot execution.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
    ],
    category: "throughput",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_customer_balance_snapshot_requests_total{$filters}[5m])',
        note: "Customer balance snapshot rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_customer_balance_snapshot_requests_errors_total",
    description:
      "Number of customers failed to evaluate for balance information of billing account buckets during snapshot execution.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "reason",
        description: "The failure reason during snapshot execution.",
      },
    ],
    category: "errors",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_customer_balance_snapshot_requests_errors_total{$filters}[5m])',
        note: "Customer balance snapshot error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_contract_balance_snapshot_requests_total",
    description:
      "Number of contracts evaluated for balance information of product buckets during snapshot execution.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
    ],
    category: "throughput",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_contract_balance_snapshot_requests_total{$filters}[5m])',
        note: "Contract balance snapshot rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_contract_balance_snapshot_requests_errors_total",
    description:
      "Number of contracts failed to evaluate for balance information of product buckets during snapshot execution.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "reason",
        description: "The failure reason during snapshot execution.",
      },
    ],
    category: "errors",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_contract_balance_snapshot_requests_errors_total{$filters}[5m])',
        note: "Contract balance snapshot error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_partner_balance_snapshot_requests_total",
    description:
      "Number of partners evaluated for balance information of settlement account buckets during snapshot execution.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
    ],
    category: "throughput",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_partner_balance_snapshot_requests_total{$filters}[5m])',
        note: "Partner balance snapshot rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_partner_balance_snapshot_requests_errors_total",
    description:
      "Number of partners failed to evaluate for balance information of settlement account buckets during snapshot execution.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Represents the Partition ID where the customer belongs.",
      },
      {
        key: "reason",
        description: "The failure reason during snapshot execution.",
      },
    ],
    category: "errors",
    component: "snapshot_producer",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_partner_balance_snapshot_requests_errors_total{$filters}[5m])',
        note: "Partner balance snapshot error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_logstreaming_tcp_requests_errors_total",
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
    component: "snapshot_producer",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_snapshot_producer_logstreaming_tcp_requests_errors_total{$filters}[5m])',
        note: "Log streaming error rate",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_snapshot_producer_logstreaming_tcp_queue_events_count",
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
    component: "snapshot_producer",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'cha_snapshot_producer_logstreaming_tcp_queue_events_count{$filters}',
        note: "Current log queue depth",
      },
    ],
    sourceRef: {
      docName: "839/1553-CSH 109 900 Uen",
      section: "Charging Snapshot Producer Metrics",
    },
    confidence: "high",
  },
];
