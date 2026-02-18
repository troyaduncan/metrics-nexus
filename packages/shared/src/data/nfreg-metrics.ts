import type { Metric } from "../schemas/metric.js";

export const nfregMetrics: Metric[] = [
  {
    name: "cha_nfreg_nrf_registration_http_requests_total",
    description:
      "Number of requests sent to a NRF server or Number of requests retransmitted to a NRF server.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PUT", "PATCH", "DELETE"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["Register", "Update", "Heart-Beat", "Deregister"],
      },
      {
        key: "retransmitted",
        description: "Indicates whether the request is retransmitted.",
        possibleValues: ["Yes", "No"],
      },
    ],
    category: "throughput",
    component: "nfreg",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_nfreg_nrf_registration_http_requests_total{$filters}[5m])',
        note: "NRF registration request rate",
      },
      {
        promql:
          'sum by (operation)(rate(cha_nfreg_nrf_registration_http_requests_total{$filters}[5m]))',
        note: "Request rate by operation",
      },
    ],
    sourceRef: {
      docName: "521/1553-CSH 109 900 Uen",
      section: "Charging NF Registrator Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_nfreg_nrf_registration_http_requests_errors_total",
    description: "Number of requests failed.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "The Error Response code to represent the reason of failure. Possible Values: HTTP Response Code (3xx, 4xx, 5xx).",
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PUT", "PATCH", "DELETE"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["Register", "Update", "Heart-Beat", "Deregister"],
      },
    ],
    category: "errors",
    component: "nfreg",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          'rate(cha_nfreg_nrf_registration_http_requests_errors_total{$filters}[5m])',
        note: "NRF registration error rate",
      },
      {
        promql:
          'sum(rate(cha_nfreg_nrf_registration_http_requests_errors_total{$filters}[5m])) / sum(rate(cha_nfreg_nrf_registration_http_requests_total{$filters}[5m]))',
        note: "NRF registration error ratio",
      },
    ],
    sourceRef: {
      docName: "521/1553-CSH 109 900 Uen",
      section: "Charging NF Registrator Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_nfreg_nrf_registration_http_request_duration_seconds",
    description:
      "Average time taken to process a request. The unit of measurement is milliseconds.",
    unit: "milliseconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PUT", "PATCH", "DELETE"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["Register", "Update", "Heart-Beat", "Deregister"],
      },
    ],
    category: "latency",
    component: "nfreg",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_nfreg_nrf_registration_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_nfreg_nrf_registration_http_request_duration_seconds_count{$filters}[5m])',
        note: "Average NRF registration request duration",
      },
    ],
    sourceRef: {
      docName: "521/1553-CSH 109 900 Uen",
      section: "Charging NF Registrator Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_nfreg_authz_http_requests_total",
    description:
      "Number of OAuth requests sent or retransmitted to a NRF OAuth server.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["AccessTokenRequest"],
      },
      {
        key: "retransmitted",
        description: "Indicates whether the request is retransmitted.",
        possibleValues: ["Yes", "No"],
      },
    ],
    category: "throughput",
    component: "nfreg",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_nfreg_authz_http_requests_total{$filters}[5m])',
        note: "OAuth request rate",
      },
    ],
    sourceRef: {
      docName: "521/1553-CSH 109 900 Uen",
      section: "Charging NF Registrator Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_nfreg_authz_http_requests_errors_total",
    description: "Number of requests failed.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "The Error Response code to represent the reason of failure. Possible Values: HTTP Response Code (3xx, 4xx, 5xx).",
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["AccessTokenRequest"],
      },
    ],
    category: "errors",
    component: "nfreg",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_nfreg_authz_http_requests_errors_total{$filters}[5m])',
        note: "OAuth error rate",
      },
      {
        promql:
          'sum(rate(cha_nfreg_authz_http_requests_errors_total{$filters}[5m])) / sum(rate(cha_nfreg_authz_http_requests_total{$filters}[5m]))',
        note: "OAuth error ratio",
      },
    ],
    sourceRef: {
      docName: "521/1553-CSH 109 900 Uen",
      section: "Charging NF Registrator Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_nfreg_authz_http_request_duration_seconds",
    description:
      "Average time taken to process a request. The unit of measurement is milliseconds.",
    unit: "milliseconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["AccessTokenRequest"],
      },
    ],
    category: "latency",
    component: "nfreg",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          'rate(cha_nfreg_authz_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_nfreg_authz_http_request_duration_seconds_count{$filters}[5m])',
        note: "Average OAuth request duration",
      },
    ],
    sourceRef: {
      docName: "521/1553-CSH 109 900 Uen",
      section: "Charging NF Registrator Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_nfreg_logstreaming_tcp_requests_errors_total",
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
    component: "nfreg",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: 'rate(cha_nfreg_logstreaming_tcp_requests_errors_total{$filters}[5m])',
        note: "Log streaming error rate",
      },
    ],
    sourceRef: {
      docName: "521/1553-CSH 109 900 Uen",
      section: "Charging NF Registrator Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_nfreg_logstreaming_tcp_queue_events_count",
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
    component: "nfreg",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: 'cha_nfreg_logstreaming_tcp_queue_events_count{$filters}',
        note: "Current log queue depth",
      },
    ],
    sourceRef: {
      docName: "521/1553-CSH 109 900 Uen",
      section: "Charging NF Registrator Metrics",
    },
    confidence: "high",
  },
];
