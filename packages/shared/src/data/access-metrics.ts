import type { Metric } from "../schemas/metric.js";

const DOC_REF = "518/1553-CSH 109 900 Uen";
const SECTION = "Charging Access Metrics";
const COMPONENT = "access";

export const accessMetrics: Metric[] = [
  // ---------------------------------------------------------------------------
  // 1. Balance Enquiry
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_balance_enquiry_http_requests_total",
    description:
      "Number of requests received over the balance enquiry external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "customer",
          "contract",
          "product",
          "balanceSnapshot",
          "partyRole",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_enquiry_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_balance_enquiry_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the balance enquiry external interface.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "customer",
          "contract",
          "product",
          "balanceSnapshot",
          "partyRole",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_enquiry_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_balance_enquiry_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the balance enquiry external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "customer",
          "contract",
          "product",
          "balanceSnapshot",
          "partyRole",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_enquiry_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_balance_enquiry_http_request_duration_seconds_count{$filters}[5m])",
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
    name: "cha_access_balance_adjustment_http_requests_total",
    description:
      "Number of requests received over the balance adjustment external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "PUT"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "billingAccountBucket",
          "billingAccountBucketSpecification",
          "customer",
          "productBucket",
          "productBucketSpecification",
          "settlementAccountBucket",
          "settlementAccountBucketSpecification",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_adjustment_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_balance_adjustment_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the balance adjustment external interface.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "PUT"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "billingAccountBucket",
          "billingAccountBucketSpecification",
          "customer",
          "productBucket",
          "productBucketSpecification",
          "settlementAccountBucket",
          "settlementAccountBucketSpecification",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_adjustment_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_balance_adjustment_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the balance adjustment external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "PUT"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "billingAccountBucket",
          "billingAccountBucketSpecification",
          "customer",
          "productBucket",
          "productBucketSpecification",
          "settlementAccountBucket",
          "settlementAccountBucketSpecification",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_adjustment_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_balance_adjustment_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 3. Refill
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_refill_http_requests_total",
    description:
      "Number of requests received over the refill external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "operation",
        description: "Refill operation type.",
        possibleValues: [
          "refillFraud",
          "voucherBasedRefill",
          "voucherlessRefill",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_refill_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_refill_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the refill external interface.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Error Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "operation",
        description: "Refill operation type.",
        possibleValues: [
          "refillFraud",
          "voucherBasedRefill",
          "voucherlessRefill",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_refill_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_refill_http_request_duration_seconds",
    description:
      "Average time taken to process requests received over the refill external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "operation",
        description: "Refill operation type.",
        possibleValues: [
          "refillFraud",
          "voucherBasedRefill",
          "voucherlessRefill",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_refill_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_refill_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 4. Purchase Charge
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_purchase_charge_http_requests_total",
    description:
      "Number of requests received over the purchase charge external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "DELETE"],
      },
      {
        key: "operation",
        description: "Purchase charge operation type.",
        possibleValues: [
          "reservation",
          "deduction",
          "basketRateAndChargeReservation",
          "basketRateAndAdvice",
          "basketRateAndReserve",
          "basketRateAndDeduct",
          "basketRateAndExecute",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_purchase_charge_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_purchase_charge_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the purchase charge external interface.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Error Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "DELETE"],
      },
      {
        key: "operation",
        description: "Purchase charge operation type.",
        possibleValues: [
          "reservation",
          "deduction",
          "basketRateAndChargeReservation",
          "basketRateAndAdvice",
          "basketRateAndReserve",
          "basketRateAndDeduct",
          "basketRateAndExecute",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_purchase_charge_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_purchase_charge_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the purchase charge external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "DELETE"],
      },
      {
        key: "operation",
        description: "Purchase charge operation type.",
        possibleValues: [
          "reservation",
          "deduction",
          "basketRateAndChargeReservation",
          "basketRateAndAdvice",
          "basketRateAndReserve",
          "basketRateAndDeduct",
          "basketRateAndExecute",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_purchase_charge_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_purchase_charge_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 5. Offline Rating SFTP
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_offline_rating_sftp_requests_total",
    description:
      "Request counter for various operations in offline rate and charge.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Offline rating SFTP operation type.",
        possibleValues: [
          "FileFetched",
          "FileProcessed",
          "DuplicateDetected",
          "DuplicateDetectionRead",
          "DuplicateDetectionWrite",
          "ResultFileWrite",
          "ResultFileProduced",
          "ResultFileTransferred",
        ],
      },
      {
        key: "cdr_format",
        description: "CDR format.",
        possibleValues: ["BX", "JSON"],
      },
      {
        key: "endpoint",
        description: "Location the files are fetched from.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_offline_rating_sftp_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_offline_rating_sftp_requests_errors_total",
    description:
      "Response result counter for various operations in offline rate and charge.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Offline rating SFTP operation type.",
        possibleValues: [
          "FileFetched",
          "FileProcessed",
          "DuplicateDetected",
          "DuplicateDetectionRead",
          "DuplicateDetectionWrite",
          "ResultFileWrite",
          "ResultFileProduced",
          "ResultFileTransferred",
        ],
      },
      {
        key: "cdr_format",
        description: "CDR format.",
        possibleValues: ["BX", "JSON"],
      },
      {
        key: "endpoint",
        description: "Location the files are fetched from.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_offline_rating_sftp_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_offline_rating_sftp_request_duration_seconds",
    description:
      "Counter to capture average response time for various operations in offline rate and charge. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Offline rating SFTP operation type.",
        possibleValues: [
          "FileFetched",
          "FileProcessed",
          "DuplicateDetected",
          "DuplicateDetectionRead",
          "DuplicateDetectionWrite",
          "ResultFileWrite",
          "ResultFileProduced",
          "ResultFileTransferred",
        ],
      },
      {
        key: "cdr_format",
        description: "CDR format.",
        possibleValues: ["BX", "JSON"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_offline_rating_sftp_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_offline_rating_sftp_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 6. Offline Rating CDR
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_offline_rating_cdr_requests_total",
    description:
      "Request counter for various operations in offline rate and charge.",
    type: "counter",
    labels: [
      {
        key: "cdr_format",
        description: "CDR format.",
        possibleValues: ["BX", "JSON"],
      },
      {
        key: "record_type",
        description: "CDR record type.",
        possibleValues: [
          "MOcall",
          "MOsms",
          "MTcall",
          "MTsms",
          "SGSNsmo",
          "SGSNsmt",
          "mMO1SRecord",
          "mMR1AFRecord",
          "pGWRecord",
          "PreRatedCharged",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_offline_rating_cdr_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_offline_rating_cdr_requests_errors_total",
    description:
      "Response result counter for various operations in offline rate and charge.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "cdr_format",
        description: "CDR format.",
        possibleValues: ["BX", "JSON"],
      },
      {
        key: "record_type",
        description: "CDR record type.",
        possibleValues: [
          "MOcall",
          "MOsms",
          "MTcall",
          "MTsms",
          "SGSNsmo",
          "SGSNsmt",
          "mMO1SRecord",
          "mMR1AFRecord",
          "pGWRecord",
          "PreRatedCharged",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_offline_rating_cdr_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_offline_rating_cdr_request_duration_seconds",
    description:
      "Counter to capture average response time for various operations in offline rate and charge. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "cdr_format",
        description: "CDR format.",
        possibleValues: ["BX", "JSON"],
      },
      {
        key: "record_type",
        description: "CDR record type.",
        possibleValues: [
          "MOcall",
          "MOsms",
          "MTcall",
          "MTsms",
          "SGSNsmo",
          "SGSNsmt",
          "mMO1SRecord",
          "mMR1AFRecord",
          "pGWRecord",
          "PreRatedCharged",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_offline_rating_cdr_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_offline_rating_cdr_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 7. Rating Diameter (Online Charging Ro)
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_rating_diameter_requests_total",
    description:
      "Number of requests received over the Online Charging Ro external interface.",
    type: "counter",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
      {
        key: "service_context",
        description:
          "Denotes name of the service context. In some error scenarios, service context name may not be available, then the value NA is set.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_rating_diameter_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_rating_diameter_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the Online Charging Ro external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure.",
      },
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "retargeted",
        description:
          "Represents the response has retarget information.",
        possibleValues: ["Yes", "No"],
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
      {
        key: "service_context",
        description:
          "Denotes name of the service context. In some error scenarios, service context name may not be available, then the value NA is set.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_rating_diameter_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_rating_diameter_svc_requests_total",
    description:
      "Number of service session requests received over the Online Charging Ro external interface.",
    type: "counter",
    labels: [
      {
        key: "sub_session_id",
        description:
          "Represents Rating-Group or Service-Identifier based on the context.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_rating_diameter_svc_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_rating_diameter_svc_requests_errors_total",
    description:
      "Number of service session failure responses sent over the Online Charging Ro external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure.",
      },
      {
        key: "sub_session_id",
        description:
          "Represents Rating-Group or Service-Identifier based on the context.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_rating_diameter_svc_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_rating_diameter_request_duration_seconds",
    description:
      "Average time taken to process a request received over the Online Charging Ro external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
      {
        key: "service_context",
        description:
          "Denotes name of the service context. In some error scenarios, service context name may not be available, then the value NA is set.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_rating_diameter_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_rating_diameter_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 8. Online Rating CIPIP (Diameter)
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_online_rating_cipip_rating_diameter_requests_total",
    description:
      "Number of requests received over the Online Charging CIPIP external interface.",
    type: "counter",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_online_rating_cipip_rating_diameter_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_online_rating_cipip_rating_diameter_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the Online Charging CIPIP external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure.",
      },
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_online_rating_cipip_rating_diameter_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_online_rating_cipip_rating_diameter_svc_requests_total",
    description:
      "Number of service session requests received over the Online Charging CIPIP external interface.",
    type: "counter",
    labels: [
      {
        key: "sub_session_id",
        description: "Represents service-session-Id.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_online_rating_cipip_rating_diameter_svc_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_online_rating_cipip_rating_diameter_svc_requests_errors_total",
    description:
      "Number of service session failure responses sent over the Online Charging CIPIP external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure.",
      },
      {
        key: "sub_session_id",
        description: "Represents service-session-Id.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_online_rating_cipip_rating_diameter_svc_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_online_rating_cipip_rating_diameter_request_duration_seconds",
    description:
      "Average time taken to process a request received over the Online Charging CIPIP external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_online_rating_cipip_rating_diameter_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_online_rating_cipip_rating_diameter_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 9. Policy Sy (Diameter)
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_policy_sy_diameter_requests_total",
    description:
      "Number of requests received over the Policy Control Sy external interface.",
    type: "counter",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_policy_sy_diameter_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_policy_sy_diameter_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the Policy Control Sy external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure.",
      },
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_policy_sy_diameter_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_policy_sy_diameter_request_duration_seconds",
    description:
      "Average time taken to process a request received over the Policy Control Sy external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_policy_sy_diameter_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_policy_sy_diameter_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 10. Policy ESy (Diameter)
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_policy_esy_diameter_requests_total",
    description:
      "Number of requests received over the Policy Control ESy external interface.",
    type: "counter",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_policy_esy_diameter_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_policy_esy_diameter_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the Policy Control ESy external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure.",
      },
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_policy_esy_diameter_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_policy_esy_diameter_request_duration_seconds",
    description:
      "Average time taken to process a request received over the Policy Control ESy external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_policy_esy_diameter_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_policy_esy_diameter_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 11. CPM ID Translation
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_cpm_id_translation_java_requests_total",
    description: "Number of Customer ID Translation operations performed.",
    type: "counter",
    labels: [
      {
        key: "operation",
        description: "Operation performed towards CPM.",
        possibleValues: ["TranslateId"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_cpm_id_translation_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_cpm_id_translation_java_requests_errors_total",
    description: "Number of Customer ID Translation operations failed.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Error code to denote failure of Number Normalization or CPM Id Translation.",
      },
      {
        key: "operation",
        description: "Operation performed towards CPM.",
        possibleValues: ["TranslateId"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_cpm_id_translation_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_cpm_id_translation_java_request_duration_seconds",
    description:
      "Average time taken to perform a Customer ID Translation operation. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "operation",
        description: "Operation performed towards CPM.",
        possibleValues: ["TranslateId"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_cpm_id_translation_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_cpm_id_translation_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 12. Internal Routing Akka
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_internal_routing_akka_requests_total",
    description:
      "Number of requests sent/received between Charging Access and Charging Core or Charging Collector.",
    type: "counter",
    labels: [
      {
        key: "customer_partition",
        description: "Customer Partition Id.",
      },
      {
        key: "direction",
        description:
          "The request received IN to Charging Function or sent OUT from Charging Function.",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "target_service",
        description:
          "The service the request was sent to (direction OUT) or received from (direction IN).",
        possibleValues: ["Core", "Collector", "NA"],
      },
    ],
    category: "dependencies",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_internal_routing_akka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_internal_routing_akka_requests_errors_total",
    description:
      "Number of requests sent/received between Charging Access and Charging Core or Charging Collector failed.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "customer_partition",
        description: "Customer Partition Id.",
      },
      {
        key: "direction",
        description:
          "The request received IN to Charging Function or sent OUT from Charging Function.",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "target_service",
        description:
          "The service the request was sent to (direction OUT) or received from (direction IN).",
        possibleValues: ["Core", "Collector", "NA"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_internal_routing_akka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_internal_routing_akka_request_duration_seconds",
    description:
      "Average time taken to receive the responses from Access or Core/Collector for the request sent by Core/Collector or Access respectively. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "customer_partition",
        description: "Customer Partition Id.",
      },
      {
        key: "direction",
        description:
          "The request received IN to Charging Function or sent OUT from Charging Function.",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "target_service",
        description:
          "The service the request was sent to (direction OUT) or received from (direction IN).",
        possibleValues: ["Core", "Collector", "NA"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_internal_routing_akka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_internal_routing_akka_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 13. CIL Data Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_cil_data_mgmt_java_requests_total",
    description: "Number of CIL Data Management operations performed.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "Method of CIL operation.",
        possibleValues: ["get", "put"],
      },
      {
        key: "type",
        description: "Type or Classification of data being handled.",
        possibleValues: [
          "OfflineFileNames",
          "SessionIdTranslation",
          "Events",
          "SessionMetadata",
        ],
      },
      {
        key: "partition",
        description:
          "Customer or region partition based on the context.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_cil_data_mgmt_java_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_cil_data_mgmt_java_requests_errors_total",
    description: "Number of CIL Data Management operations failed.",
    type: "counter",
    labels: [
      { key: "code", description: "ErrorCode of an operation." },
      {
        key: "method",
        description: "Method of CIL operation.",
        possibleValues: ["get", "put"],
      },
      {
        key: "type",
        description: "Type or Classification of data being handled.",
        possibleValues: [
          "OfflineFileNames",
          "SessionIdTranslation",
          "Events",
          "SessionMetadata",
        ],
      },
      {
        key: "partition",
        description:
          "Customer or region partition based on the context.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_cil_data_mgmt_java_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_cil_data_mgmt_java_request_duration_seconds",
    description:
      "Average time taken by CIL Data Management service to process a request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "Method of CIL operation.",
        possibleValues: ["get", "put"],
      },
      {
        key: "type",
        description: "Type or Classification of data being handled.",
        possibleValues: [
          "OfflineFileNames",
          "SessionIdTranslation",
          "Events",
          "SessionMetadata",
        ],
      },
      {
        key: "partition",
        description:
          "Customer or region partition based on the context.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_cil_data_mgmt_java_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_cil_data_mgmt_java_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 14. Event Consumption Kafka
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_event_consumption_kafka_requests_total",
    description: "Number of events received.",
    type: "counter",
    labels: [
      {
        key: "type",
        description:
          "Event Name received/sent. Example: CustomerDataUpdateEvent.",
      },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_event_consumption_kafka_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_event_consumption_kafka_requests_errors_total",
    description:
      "Number of event processing failures or timeouts for Product Status Change Events, Product Status Change Acknowledgement Events, Customer Data Update Events, Characteristic Value Update Notification Acknowledgement Events, or Contract Status Change Events.",
    type: "counter",
    labels: [
      { key: "code", description: "Error Code" },
      {
        key: "type",
        description:
          "Event Name received/sent. Example: CustomerDataUpdateEvent.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_event_consumption_kafka_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_event_consumption_kafka_request_duration_seconds",
    description:
      "Average time taken to process events. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "type",
        description:
          "Event Name received/sent. Example: CustomerDataUpdateEvent.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_event_consumption_kafka_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_event_consumption_kafka_request_duration_seconds_count{$filters}[5m])",
        note: "Average event processing duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 15. Online Rate Charge (HTTP/REST)
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_online_rate_charge_http_requests_total",
    description:
      "Number of requests received over the online rate and charge rest external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["DELETE", "GET", "PUT", "POST"],
      },
      {
        key: "operation",
        description: "Online rate and charge operation type.",
        possibleValues: [
          "adviceOfCharge",
          "adviceOfEligibleServiceUnits",
          "deduction",
          "reservation",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_online_rate_charge_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_online_rate_charge_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the online rate and charge rest external interface.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["DELETE", "GET", "PUT", "POST"],
      },
      {
        key: "operation",
        description: "Online rate and charge operation type.",
        possibleValues: [
          "adviceOfCharge",
          "adviceOfEligibleServiceUnits",
          "deduction",
          "reservation",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_online_rate_charge_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_online_rate_charge_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the online rate and charge rest external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["DELETE", "GET", "PUT", "POST"],
      },
      {
        key: "operation",
        description: "Online rate and charge operation type.",
        possibleValues: [
          "adviceOfCharge",
          "adviceOfEligibleServiceUnits",
          "deduction",
          "reservation",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_online_rate_charge_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_online_rate_charge_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 16. Move Contract
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_move_contract_http_requests_total",
    description: "Number of requests received.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Move contract operation type.",
        possibleValues: ["moveContract", "cancelMoveContract"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_move_contract_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_move_contract_http_requests_errors_total",
    description: "Number of requests failed.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Move contract operation type.",
        possibleValues: ["moveContract", "cancelMoveContract"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_move_contract_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_move_contract_http_request_duration_seconds",
    description:
      "Average time taken to process a request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Move contract operation type.",
        possibleValues: ["moveContract", "cancelMoveContract"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_move_contract_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_move_contract_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 17. Transfer Product Data
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_transfer_product_data_http_requests_total",
    description: "Number of TransferProductData requests received.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Transfer product data operation type.",
        possibleValues: ["transferProductData"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_transfer_product_data_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_transfer_product_data_http_requests_errors_total",
    description: "Number of TransferProductData requests failed.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Error Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Transfer product data operation type.",
        possibleValues: ["transferProductData"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_transfer_product_data_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_transfer_product_data_http_request_duration_seconds",
    description:
      "Average time taken to process a request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Transfer product data operation type.",
        possibleValues: ["transferProductData"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_transfer_product_data_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_transfer_product_data_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 18. Recurrence
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_recurrence_http_requests_total",
    description: "Number of requests received.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "resource",
        description: "Recurrence resource type.",
        possibleValues: [
          "contract",
          "executeRecurrenceJob",
          "product",
          "recurrenceProductOfferingPrice",
          "recurrenceNotificationOffsetTrigger",
        ],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_recurrence_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_recurrence_http_requests_errors_total",
    description: "Number of requests failed.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Error Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "resource",
        description: "Recurrence resource type.",
        possibleValues: [
          "contract",
          "executeRecurrenceJob",
          "product",
          "recurrenceProductOfferingPrice",
          "recurrenceNotificationOffsetTrigger",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_recurrence_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_recurrence_http_request_duration_seconds",
    description:
      "Average time taken to process a request. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["GET", "POST"],
      },
      {
        key: "resource",
        description: "Recurrence resource type.",
        possibleValues: [
          "contract",
          "executeRecurrenceJob",
          "product",
          "recurrenceProductOfferingPrice",
          "recurrenceNotificationOffsetTrigger",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_recurrence_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_recurrence_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 19. Nchf Charging
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_nchf_charging_http_requests_total",
    description:
      "Number of requests received over the converged charging nchf external interface.",
    type: "counter",
    labels: [
      {
        key: "direction",
        description:
          "The request received IN to Charging Function (Create, Create-IEC, Create-PEC, Update, Release) or sent OUT from Charging Function (Notify).",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: [
          "Create-IEC",
          "Create-PEC",
          "Create",
          "Update",
          "Release",
          "Notify",
        ],
      },
      {
        key: "endpoint",
        description:
          "Endpoint of an external server, when available. For sent notifications, it is the host address of the SCP, if used, otherwise the host address of the notification receiver. Default value is: NA.",
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
        promql:
          "rate(cha_access_nchf_charging_http_requests_total{$filters}[5m])",
      },
      {
        promql:
          'sum by (operation) (rate(cha_access_nchf_charging_http_requests_total{$filters, direction="IN"}[5m]))',
        note: "Incoming request rate broken down by operation",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_nchf_charging_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the converged charging nchf external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "The Error Response code to represent the reason of failure. Possible Values: HTTP Response Code (3xx, 4xx, 5xx).",
      },
      {
        key: "delivery_status",
        description:
          "Indicates whether client closed the connection or not before CHA Access responds back.",
        possibleValues: ["Delivered", "ConnectionResetByClient"],
      },
      {
        key: "direction",
        description:
          "The request received IN to Charging Function (Create, Create-IEC, Create-PEC, Update, Release) or sent OUT from Charging Function (Notify).",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: [
          "Create-IEC",
          "Create-PEC",
          "Create",
          "Update",
          "Release",
          "Notify",
        ],
      },
      {
        key: "endpoint",
        description:
          "Endpoint of an external server, when available. For sent notifications, it is the host address of the SCP, if used, otherwise the host address of the notification receiver. Default value is: NA.",
      },
      {
        key: "retransmitted",
        description: "Indicates whether the request is retransmitted.",
        possibleValues: ["Yes", "No"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_nchf_charging_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_nchf_charging_http_svc_requests_total",
    description:
      "Number of service sessions received in request over the converged charging nchf external interface.",
    type: "counter",
    labels: [
      {
        key: "sub_session_id",
        description:
          "Represents Rating-Group or Service-Identifier based on the context.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_nchf_charging_http_svc_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_nchf_charging_http_svc_requests_errors_total",
    description:
      "Number of failure responses for service session sent for requests over the converged charging nchf external interface. In addition, in cases where a service response is not applicable--such as during a Release--the response count will remain unchanged and will not be incremented.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "The Error Response Code to represent the reason of failure. Possible Values: According to the 3GPP Spec.",
      },
      {
        key: "sub_session_id",
        description:
          "Represents Rating-Group or Service-Identifier based on the context.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_nchf_charging_http_svc_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_nchf_charging_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the converged charging nchf external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "direction",
        description:
          "The request received IN to Charging Function (Create, Create-IEC, Create-PEC, Update, Release) or sent OUT from Charging Function (Notify).",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: [
          "Create-IEC",
          "Create-PEC",
          "Create",
          "Update",
          "Release",
          "Notify",
        ],
      },
      {
        key: "endpoint",
        description:
          "Endpoint of an external server, when available. For sent notifications, it is the host address of the SCP, if used, otherwise the host address of the notification receiver. Default value is: NA.",
      },
      {
        key: "retransmitted",
        description: "Indicates whether the request is retransmitted.",
        possibleValues: ["Yes", "No"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_nchf_charging_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_nchf_charging_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 20. Overload Reporting gRPC
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_overload_reporting_grpc_requests_total",
    description:
      "Number of overload reporting requests sent to NFReg.",
    type: "counter",
    labels: [],
    category: "saturation",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_overload_reporting_grpc_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_overload_reporting_grpc_requests_errors_total",
    description:
      "Number of overload reporting requests sent to NFReg that resulted in an error.",
    type: "counter",
    labels: [
      { key: "code", description: "GRPC Status Response Code" },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_overload_reporting_grpc_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_overload_reporting_grpc_request_duration_seconds",
    description:
      "Average response time of an overload reporting request towards NFReg. The unit of measurement is seconds.",
    unit: "seconds",
    type: "summary",
    labels: [],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_overload_reporting_grpc_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_overload_reporting_grpc_request_duration_seconds_count{$filters}[5m])",
        note: "Average overload reporting request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_overload_responses_percentage_per_evaluation",
    description:
      "Evaluated overload ratio as percentage during an overload evaluation window.",
    type: "summary",
    labels: [],
    category: "saturation",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "cha_access_overload_responses_percentage_per_evaluation{$filters}",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 21. External Rating Diameter
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_external_rating_diameter_requests_total",
    description:
      "Number of requests received over the External Rating CIPIP external interface.",
    type: "counter",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Represents the external rating system realm.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_external_rating_diameter_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_external_rating_diameter_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the External Rating CIPIP external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure.",
      },
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Represents the external rating system realm.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_external_rating_diameter_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_external_rating_diameter_svc_requests_total",
    description:
      "Number of service session requests received over the External Rating CIPIP external interface.",
    type: "counter",
    labels: [
      {
        key: "sub_session_id",
        description:
          "Represents Rating-Group or Service-Identifier based on the context.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_external_rating_diameter_svc_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_external_rating_diameter_svc_requests_errors_total",
    description:
      "Number of service session failure responses sent over the External Rating CIPIP external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure. Example: 5002.",
      },
      {
        key: "sub_session_id",
        description:
          "Represents Rating-Group or Service-Identifier based on the context.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_external_rating_diameter_svc_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_external_rating_diameter_request_duration_seconds",
    description:
      "Average time taken to process a request received over the External Rating CIPIP external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Represents the external rating system realm.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_external_rating_diameter_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_external_rating_diameter_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 22. Nchf Policy (Spending Limit Control)
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_nchf_policy_http_requests_total",
    description:
      "Number of requests received over the spending limit control nchf external interface.",
    type: "counter",
    labels: [
      {
        key: "direction",
        description:
          "The request received IN to Charging Function (Subscribe) or sent OUT from Charging Function (Notify).",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "DELETE"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["Subscribe", "Notify"],
      },
      {
        key: "endpoint",
        description:
          "Endpoint of an external server, when available. For sent notifications, it is the host address of the SCP, if used, otherwise the host address of the notification receiver. Default value is: NA.",
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
        promql:
          "rate(cha_access_nchf_policy_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_nchf_policy_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the spending limit control nchf external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "The Error Response code to represent the reason of failure. Possible Values: HTTP Response Code (3xx, 4xx, 5xx).",
      },
      {
        key: "delivery_status",
        description:
          "Indicates whether client closed the connection or not before CHA Access responds back.",
        possibleValues: ["Delivered", "ConnectionResetByClient"],
      },
      {
        key: "direction",
        description:
          "The request received IN to Charging Function (Subscribe) or sent OUT from Charging Function (Notify).",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "DELETE"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["Subscribe", "Notify"],
      },
      {
        key: "endpoint",
        description:
          "Endpoint of an external server, when available. For sent notifications, it is the host address of the SCP, if used, otherwise the host address of the notification receiver. Default value is: NA.",
      },
      {
        key: "retransmitted",
        description: "Indicates whether the request is retransmitted.",
        possibleValues: ["Yes", "No"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_nchf_policy_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_nchf_policy_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the spending limit control nchf external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "direction",
        description:
          "The request received IN to Charging Function (Subscribe) or sent OUT from Charging Function (Notify).",
        possibleValues: ["IN", "OUT"],
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "DELETE"],
      },
      {
        key: "operation",
        description: "The Service operation that has been performed.",
        possibleValues: ["Subscribe", "Notify"],
      },
      {
        key: "endpoint",
        description:
          "Endpoint of an external server, when available. For sent notifications, it is the host address of the SCP, if used, otherwise the host address of the notification receiver. Default value is: NA.",
      },
      {
        key: "retransmitted",
        description: "Indicates whether the request is retransmitted.",
        possibleValues: ["Yes", "No"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_nchf_policy_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_nchf_policy_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 23. External Policy Diameter
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_external_policy_diameter_requests_total",
    description:
      "Number of requests received over the External Policy Control Sy external interface.",
    type: "counter",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_external_policy_diameter_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_external_policy_diameter_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the External Policy Control Sy external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Diameter Result Code to represent the reason of failure. Example: 5002.",
      },
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_external_policy_diameter_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_external_policy_diameter_request_duration_seconds",
    description:
      "Average time taken to process a request received over the External Policy Control Sy interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "requestname",
        description:
          "Represents the RequestName that is prescribed in the configured diameter dictionary.",
      },
      {
        key: "endpoint",
        description: "Endpoint of an external server.",
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_external_policy_diameter_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_external_policy_diameter_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 24. Balance Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_balance_management_http_requests_total",
    description:
      "Number of requests received over the balance management external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PATCH", "POST"],
      },
      {
        key: "operation",
        description: "Balance management operation type.",
        possibleValues: ["balanceExpiryOffsetTrigger", "moveCustomer"],
      },
      {
        key: "resource",
        description: "Balance management resource type.",
        possibleValues: ["BA", "PB", "NA"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_management_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_balance_management_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the balance management external interface.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PATCH", "POST"],
      },
      {
        key: "operation",
        description: "Balance management operation type.",
        possibleValues: ["balanceExpiryOffsetTrigger", "moveCustomer"],
      },
      {
        key: "resource",
        description: "Balance management resource type.",
        possibleValues: ["BA", "PB", "NA"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_management_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_balance_management_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the balance management external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PATCH", "POST"],
      },
      {
        key: "operation",
        description: "Balance management operation type.",
        possibleValues: ["balanceExpiryOffsetTrigger", "moveCustomer"],
      },
      {
        key: "resource",
        description: "Balance management resource type.",
        possibleValues: ["BA", "PB", "NA"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_balance_management_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_balance_management_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 25. Test Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_test_management_http_requests_total",
    description:
      "Number of requests received over the test management external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Test management operation type.",
        possibleValues: ["entityAdjustment"],
      },
      {
        key: "resource",
        description: "Test management resource type.",
        possibleValues: ["contract", "customer"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_test_management_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_test_management_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the test management external interface.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Test management operation type.",
        possibleValues: ["entityAdjustment"],
      },
      {
        key: "resource",
        description: "Test management resource type.",
        possibleValues: ["contract", "customer"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_test_management_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_test_management_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the test management external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST"],
      },
      {
        key: "operation",
        description: "Test management operation type.",
        possibleValues: ["entityAdjustment"],
      },
      {
        key: "resource",
        description: "Test management resource type.",
        possibleValues: ["contract", "customer"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_test_management_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_test_management_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 26. Internal Resource Statistics
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_internal_resource_statistics",
    description: "Counter for Charging Internal Statistics.",
    type: "gauge",
    labels: [
      {
        key: "type",
        description: "Statistic type.",
        possibleValues: ["Latency", "OverloadCounter", "QueueSize"],
      },
      {
        key: "entity",
        description:
          "Entity name, e.g. Admin, InternalInterface, Offline, Online, etc.",
      },
    ],
    category: "health",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "cha_access_internal_resource_statistics{$filters}",
      },
      {
        promql:
          'cha_access_internal_resource_statistics{$filters, type="QueueSize"}',
        note: "Monitor queue sizes across entities",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 27. Event Creation
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_event_creation_java_total",
    description: "Number of Event Records put in queue.",
    type: "counter",
    labels: [
      {
        key: "type",
        description:
          "Represents the event record type that is being created. Example: ChargingNetworkFunctionEvent.",
      },
    ],
    category: "events",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_event_creation_java_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_event_creation_java_errors_total",
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
          "Represents the event record type that is being created. Example: ChargingNetworkFunctionEvent.",
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_event_creation_java_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 28. Event Posting Kafka
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_event_posting_kafka_total",
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
          "Represents the event record type that is being created. Example: ChargingNetworkFunctionEvent.",
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
        promql:
          "rate(cha_access_event_posting_kafka_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_event_posting_kafka_errors_total",
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
          "Represents the event record type that is being created. Example: ChargingNetworkFunctionEvent.",
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
        promql:
          "rate(cha_access_event_posting_kafka_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 29. Customer Information Update
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_customer_information_update_http_requests_total",
    description:
      "Number of requests received over the customer information update external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PUT"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: ["customer"],
      },
    ],
    category: "throughput",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_customer_information_update_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_customer_information_update_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the customer information update external interface.",
    type: "counter",
    labels: [
      {
        key: "code",
        description:
          "Charging Event Result Code to represent the reason of failure. Example: 3002.",
      },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PUT"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: ["customer"],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_customer_information_update_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_customer_information_update_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the customer information update external interface. The unit of measurement is milliseconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["PUT"],
      },
      {
        key: "resource",
        description: "Resource on which the operation is performed.",
        possibleValues: ["customer"],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_customer_information_update_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_customer_information_update_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 30. Log Streaming
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_logstreaming_tcp_requests_errors_total",
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
        promql:
          "rate(cha_access_logstreaming_tcp_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_logstreaming_tcp_queue_events_count",
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
        promql:
          "cha_access_logstreaming_tcp_queue_events_count{$filters}",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },

  // ---------------------------------------------------------------------------
  // 31. Session Management
  // ---------------------------------------------------------------------------
  {
    name: "cha_access_session_management_http_requests_total",
    description:
      "Number of requests received over the session management external interface.",
    type: "counter",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "PUT", "DELETE"],
      },
      {
        key: "operation",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "createPolicySession",
          "moveChargingSessionToInternal",
          "deleteSession",
        ],
      },
    ],
    category: "sessions",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_session_management_http_requests_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_session_management_http_requests_errors_total",
    description:
      "Number of failure responses sent for requests over the session management external interface.",
    type: "counter",
    labels: [
      { key: "code", description: "HTTP Response Code" },
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "PUT", "DELETE"],
      },
      {
        key: "operation",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "createPolicySession",
          "moveChargingSessionToInternal",
          "deleteSession",
        ],
      },
      {
        key: "sub_status",
        description: "Sub-status of the error.",
        possibleValues: [
          "sbiInternalCreate",
          "sbiExternalDelete",
          "dccaInternalCreate",
          "dccaExternalDelete",
          "N/A",
        ],
      },
    ],
    category: "errors",
    component: COMPONENT,
    audience: ["NOC", "SRE"],
    examples: [
      {
        promql:
          "rate(cha_access_session_management_http_requests_errors_total{$filters}[5m])",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
  {
    name: "cha_access_session_management_http_request_duration_seconds",
    description:
      "Average time taken to process a request received over the session management external interface. The unit of measurement is seconds.",
    unit: "seconds",
    type: "summary",
    labels: [
      {
        key: "method",
        description: "The HTTP Verb.",
        possibleValues: ["POST", "PUT", "DELETE"],
      },
      {
        key: "operation",
        description: "Resource on which the operation is performed.",
        possibleValues: [
          "createPolicySession",
          "moveChargingSessionToInternal",
          "deleteSession",
        ],
      },
    ],
    category: "latency",
    component: COMPONENT,
    audience: ["SRE", "ENG"],
    examples: [
      {
        promql:
          "rate(cha_access_session_management_http_request_duration_seconds_sum{$filters}[5m]) / rate(cha_access_session_management_http_request_duration_seconds_count{$filters}[5m])",
        note: "Average request duration over 5 minutes",
      },
    ],
    sourceRef: { docName: DOC_REF, section: SECTION },
    confidence: "high",
  },
];
