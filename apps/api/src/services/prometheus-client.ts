const PROM_URL = process.env.PROM_URL || "http://localhost:9090";
const TIMEOUT_MS = 30_000;

export class PrometheusError extends Error {
  constructor(
    message: string,
    public statusCode: number = 502
  ) {
    super(message);
    this.name = "PrometheusError";
  }
}

async function promFetch(path: string, params: Record<string, string>) {
  const url = new URL(path, PROM_URL);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    const body = (await res.json()) as Record<string, unknown>;

    if (!res.ok) {
      throw new PrometheusError(
        (body?.error as string) || `Prometheus returned ${res.status}`,
        res.status
      );
    }

    return body;
  } catch (err: unknown) {
    if (err instanceof PrometheusError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new PrometheusError("Prometheus request timed out", 504);
    }
    throw new PrometheusError(
      `Failed to connect to Prometheus: ${err instanceof Error ? err.message : String(err)}`,
      502
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function query(promql: string, time?: string) {
  const params: Record<string, string> = { query: promql };
  if (time) params.time = time;
  return promFetch("/api/v1/query", params);
}

export async function queryRange(
  promql: string,
  start: string,
  end: string,
  step: string
) {
  return promFetch("/api/v1/query_range", {
    query: promql,
    start,
    end,
    step,
  });
}

export async function labelValues(label: string) {
  return promFetch(`/api/v1/label/${encodeURIComponent(label)}/values`, {});
}
