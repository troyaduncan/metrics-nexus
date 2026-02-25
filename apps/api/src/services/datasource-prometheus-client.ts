import https from "https";
import http from "http";
import { URL } from "url";
import type {
  Datasource,
  ExtendedMetricInfo,
  DiscoveryMetricType,
  MetricsProgress,
  ConnectionTestResult,
} from "@metrics-nexus/shared";

interface PrometheusApiResponse<T> {
  status: "success" | "error";
  data: T;
  errorType?: string;
  error?: string;
}

interface MetricMetadata {
  type: string;
  help: string;
  unit: string;
}

// Shared agent pool per datasource id — reuses TLS connections and limits
// concurrent sockets to avoid overwhelming Prometheus with a thundering herd.
const agentCache = new Map<number, https.Agent | http.Agent>();

function getOrCreateAgent(datasource: Datasource): https.Agent | http.Agent {
  const existing = agentCache.get(datasource.id);
  if (existing) return existing;

  const isHttps = datasource.url.startsWith("https://");
  let agent: https.Agent | http.Agent;

  if (isHttps) {
    const agentOptions: https.AgentOptions = {
      rejectUnauthorized: !datasource.skipVerify,
      keepAlive: true,
      maxSockets: 20,
    };

    if (datasource.authType === "tls") {
      if (datasource.tlsClientCert) agentOptions.cert = datasource.tlsClientCert;
      if (datasource.tlsClientKey) agentOptions.key = datasource.tlsClientKey;
      if (datasource.caCert) agentOptions.ca = datasource.caCert;
    }

    agent = new https.Agent(agentOptions);
  } else {
    agent = new http.Agent({ keepAlive: true, maxSockets: 8 });
  }

  agentCache.set(datasource.id, agent);
  return agent;
}

export class DatasourcePrometheusClient {
  private baseUrl: string;
  private agent: https.Agent | http.Agent;
  private authHeader: string | undefined;
  private isHttps: boolean;

  constructor(private datasource: Datasource) {
    this.baseUrl = datasource.url.replace(/\/$/, "");
    this.isHttps = this.baseUrl.startsWith("https://");
    this.agent = getOrCreateAgent(datasource);
    this.setupAuth();
  }

  private setupAuth(): void {
    // Agent is now created via the shared pool — only set auth header here
  }

  private fetch<T>(path: string): Promise<T> {
    const url = new URL(path, this.baseUrl);

    return new Promise((resolve, reject) => {
      const options: https.RequestOptions | http.RequestOptions = {
        hostname: url.hostname,
        port: url.port || (this.isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: "GET",
        agent: this.agent,
        headers: {
          Accept: "application/json",
        },
      };

      if (this.authHeader) {
        options.headers = {
          ...options.headers,
          Authorization: this.authHeader,
        };
      }

      const requestFn = this.isHttps ? https.request : http.request;
      const req = requestFn(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(new Error(`Failed to parse response: ${e}`));
            }
          } else if (res.statusCode === 401) {
            reject(new Error("Authentication failed: Invalid credentials"));
          } else if (res.statusCode === 403) {
            reject(new Error("Authorization failed: Access denied"));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on("error", (e) => {
        if (e.message.includes("ECONNREFUSED")) {
          reject(new Error(`Connection refused: Unable to reach ${this.baseUrl}`));
        } else if (e.message.includes("ENOTFOUND")) {
          reject(new Error(`Host not found: ${url.hostname}`));
        } else if (e.message.includes("CERT")) {
          reject(new Error(`TLS certificate error: ${e.message}`));
        } else {
          reject(new Error(`Connection error: ${e.message}`));
        }
      });

      req.setTimeout(60000, () => {
        req.destroy();
        reject(new Error("Request timeout: Server did not respond within 60 seconds"));
      });

      req.end();
    });
  }

  // --- Proxy methods for forwarding PromQL queries ---

  async query(promql: string, time?: string): Promise<unknown> {
    const params = new URLSearchParams({ query: promql });
    if (time) params.set("time", time);
    return this.fetch<unknown>(`/api/v1/query?${params}`);
  }

  async queryRange(promql: string, start: string, end: string, step: string): Promise<unknown> {
    const params = new URLSearchParams({ query: promql, start, end, step });
    return this.fetch<unknown>(`/api/v1/query_range?${params}`);
  }

  async labelValues(label: string): Promise<unknown> {
    return this.fetch<unknown>(`/api/v1/label/${encodeURIComponent(label)}/values`);
  }

  // --- Metrics discovery methods ---

  async getMetricNames(): Promise<string[]> {
    const response = await this.fetch<PrometheusApiResponse<string[]>>(
      "/api/v1/label/__name__/values"
    );

    if (response.status !== "success") {
      throw new Error(response.error || "Failed to fetch metric names");
    }

    return response.data;
  }

  async getMetadata(): Promise<Map<string, MetricMetadata>> {
    const response = await this.fetch<PrometheusApiResponse<Record<string, MetricMetadata[]>>>(
      "/api/v1/metadata"
    );

    if (response.status !== "success") {
      throw new Error(response.error || "Failed to fetch metadata");
    }

    const metadataMap = new Map<string, MetricMetadata>();
    for (const [name, metadataList] of Object.entries(response.data)) {
      if (metadataList && metadataList.length > 0) {
        metadataMap.set(name, metadataList[0]);
      }
    }

    return metadataMap;
  }

  async getSeriesInfo(metricName: string): Promise<{ labels: string[]; count: number }> {
    try {
      const response = await this.fetch<PrometheusApiResponse<Array<Record<string, string>>>>(
        `/api/v1/series?match[]=${encodeURIComponent(metricName)}`
      );

      if (response.status !== "success" || !response.data || response.data.length === 0) {
        return { labels: [], count: 0 };
      }

      const labelSet = new Set<string>();
      for (const series of response.data) {
        for (const label of Object.keys(series)) {
          if (label !== "__name__") {
            labelSet.add(label);
          }
        }
      }

      return {
        labels: Array.from(labelSet).sort(),
        count: response.data.length,
      };
    } catch {
      return { labels: [], count: 0 };
    }
  }

  async getExtendedMetrics(): Promise<ExtendedMetricInfo[]> {
    const [metricNames, metadata] = await Promise.all([
      this.getMetricNames(),
      this.getMetadata(),
    ]);

    const metrics: ExtendedMetricInfo[] = [];
    const batchSize = 10;

    for (let i = 0; i < metricNames.length; i += batchSize) {
      const batch = metricNames.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (name) => {
          const meta = metadata.get(name);
          const { labels, count } = await this.getSeriesInfo(name);
          return {
            name,
            type: this.normalizeMetricType(meta?.type),
            help: meta?.help || "",
            labels,
            sampleCount: count,
          };
        })
      );
      metrics.push(...batchResults);
    }

    return metrics.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getExtendedMetricsWithProgress(
    onProgress?: (progress: MetricsProgress) => void
  ): Promise<ExtendedMetricInfo[]> {
    const startTime = Date.now();

    const [metricNames, metadata] = await Promise.all([
      this.getMetricNames(),
      this.getMetadata(),
    ]);

    const totalMetrics = metricNames.length;
    const metrics: ExtendedMetricInfo[] = [];
    let processedCount = 0;

    const batchSize = totalMetrics > 1000 ? 20 : totalMetrics > 500 ? 15 : 10;

    for (let i = 0; i < metricNames.length; i += batchSize) {
      const batch = metricNames.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(async (name) => {
          const meta = metadata.get(name);
          const { labels, count } = await this.getSeriesInfo(name);
          return {
            name,
            type: this.normalizeMetricType(meta?.type),
            help: meta?.help || "",
            labels,
            sampleCount: count,
          };
        })
      );

      metrics.push(...batchResults);
      processedCount += batch.length;

      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const rate = processedCount / elapsedSeconds;
      const remaining = totalMetrics - processedCount;
      const etaSeconds = remaining / rate;

      if (onProgress) {
        onProgress({
          processed: processedCount,
          total: totalMetrics,
          percentage: Math.round((processedCount / totalMetrics) * 100),
          currentMetric: batchResults[batchResults.length - 1]?.name || "",
          rate: Math.round(rate * 10) / 10,
          elapsed: Math.round(elapsedSeconds),
          eta: Math.round(etaSeconds),
          batchSize,
        });
      }
    }

    return metrics.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getBasicMetrics(): Promise<ExtendedMetricInfo[]> {
    const [metricNames, metadata] = await Promise.all([
      this.getMetricNames(),
      this.getMetadata(),
    ]);

    return metricNames
      .map((name) => {
        const meta = metadata.get(name);
        return {
          name,
          type: this.normalizeMetricType(meta?.type),
          help: meta?.help || "",
          labels: [],
          sampleCount: 0,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private normalizeMetricType(type: string | undefined): DiscoveryMetricType {
    if (!type) return "unknown";
    const normalized = type.toLowerCase();
    if (["counter", "gauge", "histogram", "summary"].includes(normalized)) {
      return normalized as DiscoveryMetricType;
    }
    return "unknown";
  }

  async testConnection(): Promise<ConnectionTestResult> {
    try {
      const metricNames = await this.getMetricNames();
      return {
        success: true,
        metricCount: metricNames.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export function metricsToCSV(metrics: ExtendedMetricInfo[]): string {
  const headers = ["name", "type", "help", "labels", "sampleCount"];
  const rows = metrics.map((m) => [
    escapeCsvField(m.name),
    escapeCsvField(m.type),
    escapeCsvField(m.help),
    escapeCsvField(m.labels.join(", ")),
    m.sampleCount.toString(),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function escapeCsvField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}
