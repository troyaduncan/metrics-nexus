import type { Metric } from "../schemas/metric.js";

export const dlbMetrics: Metric[] = [
  {
    name: "cha_dlb_loadbalancing_diameter_requests_total",
    description: "Number of Diameter requests load balanced.",
    type: "counter",
    labels: [
      {
        key: "direction",
        description: "The direction of the request.",
        possibleValues: ["Ingress", "Egress"],
      },
      {
        key: "endpoint",
        description:
          "Name of the Diameter endpoint handling the traffic.",
      },
    ],
    category: "throughput",
    component: "dlb",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_dlb_loadbalancing_diameter_requests_total{$filters}[5m])',
        note: "Request rate per second",
      },
      {
        promql:
          'sum by (direction)(rate(cha_dlb_loadbalancing_diameter_requests_total{$filters}[5m]))',
        note: "Request rate by direction",
      },
    ],
    sourceRef: {
      docName: "519/1553-CSH 109 900 Uen",
      section: "Charging DLB Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_dlb_loadbalancing_diameter_requests_errors_total",
    description: "Number of Diameter requests that resulted in an error.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "The Diameter Error Response Code to represent the reason of failure.",
      },
      {
        key: "direction",
        description: "The direction of the request.",
        possibleValues: ["Ingress", "Egress"],
      },
      {
        key: "endpoint",
        description:
          "Name of the Diameter endpoint handling the traffic.",
      },
    ],
    category: "errors",
    component: "dlb",
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql: 'rate(cha_dlb_loadbalancing_diameter_requests_errors_total{$filters}[5m])',
        note: "Error rate per second",
      },
      {
        promql:
          'sum(rate(cha_dlb_loadbalancing_diameter_requests_errors_total{$filters}[5m])) / sum(rate(cha_dlb_loadbalancing_diameter_requests_total{$filters}[5m]))',
        note: "Error ratio",
      },
    ],
    sourceRef: {
      docName: "519/1553-CSH 109 900 Uen",
      section: "Charging DLB Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_dlb_logstreaming_tcp_requests_errors_total",
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
    component: "dlb",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: 'rate(cha_dlb_logstreaming_tcp_requests_errors_total{$filters}[5m])',
        note: "Log streaming error rate",
      },
    ],
    sourceRef: {
      docName: "519/1553-CSH 109 900 Uen",
      section: "Charging DLB Metrics",
    },
    confidence: "high",
  },
  {
    name: "cha_dlb_logstreaming_tcp_queue_events_count",
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
    component: "dlb",
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql: 'cha_dlb_logstreaming_tcp_queue_events_count{$filters}',
        note: "Current log queue depth",
      },
    ],
    sourceRef: {
      docName: "519/1553-CSH 109 900 Uen",
      section: "Charging DLB Metrics",
    },
    confidence: "high",
  },
];
