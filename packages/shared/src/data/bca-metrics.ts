import type { Metric } from "../schemas/metric.js";

export const bcaMetrics: Metric[] = [
  {
    name: "cha_bca_business_config_http_requests_total",
    description: "Number of Business Configuration requests received.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "HTTP method.",
        possibleValues: ["GET", "PUT", "POST", "PATCH", "DELETE"],
      },
      {
        key: "resource",
        description: "The resource being configured.",
        possibleValues: [
          "ChfLoadBalancerConfig",
          "DiameterInterface",
          "EventMessaging",
          "ExportConfiguration",
          "ExternalRating",
          "FetchConfiguration",
          "ImportConfiguration",
          "MapConverterServer",
          "NfConfig",
          "NfProfile",
          "NfProfileConfig",
          "NumberPortabilityDatabaseServer",
          "ScpServerConfig",
          "VoucherServer",
        ],
      },
    ],
    category: "throughput",
    component: "bca",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_bca_business_config_http_requests_total{$filters}[5m])',
        note: "Request rate per second",
      },
      {
        promql:
          'sum by (resource)(rate(cha_bca_business_config_http_requests_total{$filters}[5m]))',
        note: "Request rate by resource",
      },
    ],
    sourceRef: {
      docName: "520/1553-CSH 109 900 Uen",
      section: "Charging BCA Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_bca_business_config_http_requests_errors_total",
    description: "Number of Business Configuration requests failed.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Error Code." },
      {
        key: "method",
        description: "HTTP method.",
        possibleValues: ["GET", "PUT", "POST", "PATCH", "DELETE"],
      },
      {
        key: "resource",
        description: "The resource being configured.",
        possibleValues: [
          "ChfLoadBalancerConfig",
          "DiameterInterface",
          "EventMessaging",
          "ExportConfiguration",
          "ExternalRating",
          "FetchConfiguration",
          "ImportConfiguration",
          "MapConverterServer",
          "NfConfig",
          "NfProfile",
          "NfProfileConfig",
          "NumberPortabilityDatabaseServer",
          "ScpServerConfig",
          "VoucherServer",
        ],
      },
    ],
    category: "errors",
    component: "bca",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_bca_business_config_http_requests_errors_total{$filters}[5m])',
        note: "Error rate per second",
      },
      {
        promql:
          'sum(rate(cha_bca_business_config_http_requests_errors_total{$filters}[5m])) / sum(rate(cha_bca_business_config_http_requests_total{$filters}[5m]))',
        note: "Error ratio",
      },
    ],
    sourceRef: {
      docName: "520/1553-CSH 109 900 Uen",
      section: "Charging BCA Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_bca_business_config_http_request_duration_seconds",
    description:
      "Average time taken to process a Business Configuration request. The unit of measurement is milliseconds.",
    unit: "milliseconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "HTTP method.",
        possibleValues: ["GET", "PUT", "POST", "PATCH", "DELETE"],
      },
      {
        key: "resource",
        description: "The resource being configured.",
        possibleValues: [
          "ChfLoadBalancerConfig",
          "DiameterInterface",
          "EventMessaging",
          "ExportConfiguration",
          "ExternalRating",
          "FetchConfiguration",
          "ImportConfiguration",
          "MapConverterServer",
          "NfConfig",
          "NfProfile",
          "NfProfileConfig",
          "NumberPortabilityDatabaseServer",
          "ScpServerConfig",
          "VoucherServer",
        ],
      },
    ],
    category: "latency",
    component: "bca",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_bca_business_config_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_bca_business_config_http_request_duration_seconds_count{$filters}[5m])',
        note: "Average request duration",
      },
    ],
    sourceRef: {
      docName: "520/1553-CSH 109 900 Uen",
      section: "Charging BCA Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_bca_capabilities_http_requests_total",
    description: "Number of Capabilities requests received.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: ["capabilities"],
      },
    ],
    category: "throughput",
    component: "bca",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_bca_capabilities_http_requests_total{$filters}[5m])',
        note: "Capabilities request rate",
      },
    ],
    sourceRef: {
      docName: "520/1553-CSH 109 900 Uen",
      section: "Charging BCA Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_bca_capabilities_http_requests_errors_total",
    description: "Number of Capabilities requests resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code." },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: ["capabilities"],
      },
    ],
    category: "errors",
    component: "bca",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_bca_capabilities_http_requests_errors_total{$filters}[5m])',
        note: "Capabilities error rate",
      },
    ],
    sourceRef: {
      docName: "520/1553-CSH 109 900 Uen",
      section: "Charging BCA Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_bca_capabilities_http_request_duration_seconds",
    description:
      "Average response time of a Capabilities request. The unit of measurement is milliseconds.",
    unit: "milliseconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: ["capabilities"],
      },
    ],
    category: "latency",
    component: "bca",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_bca_capabilities_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_bca_capabilities_http_request_duration_seconds_count{$filters}[5m])',
        note: "Average capabilities request duration",
      },
    ],
    sourceRef: {
      docName: "520/1553-CSH 109 900 Uen",
      section: "Charging BCA Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_bca_logstreaming_tcp_requests_errors_total",
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
    component: "bca",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: 'rate(cha_bca_logstreaming_tcp_requests_errors_total{$filters}[5m])',
        note: "Log streaming error rate",
      },
    ],
    sourceRef: {
      docName: "520/1553-CSH 109 900 Uen",
      section: "Charging BCA Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_bca_logstreaming_tcp_queue_events_count",
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
    component: "bca",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: 'cha_bca_logstreaming_tcp_queue_events_count{$filters}',
        note: "Current log queue depth",
      },
    ],
    sourceRef: {
      docName: "520/1553-CSH 109 900 Uen",
      section: "Charging BCA Metrics",
    },
    confidence: "high",
  },
];
