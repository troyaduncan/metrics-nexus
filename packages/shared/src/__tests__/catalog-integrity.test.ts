import { describe, it, expect } from "vitest";
import { MetricSchema } from "../schemas/metric.js";
import { metricsCatalog, metricsByComponent, metricsByName } from "../data/metrics-catalog.js";

describe("Metrics Catalog Integrity", () => {
  it("should have metrics for all 7 components", () => {
    const components = new Set(metricsCatalog.map((m) => m.component));
    expect(components).toContain("core");
    expect(components).toContain("access");
    expect(components).toContain("collector");
    expect(components).toContain("snapshot_producer");
    expect(components).toContain("dlb");
    expect(components).toContain("bca");
    expect(components).toContain("nfreg");
    expect(components.size).toBe(7);
  });

  it("should have at least 300 total metrics", () => {
    expect(metricsCatalog.length).toBeGreaterThanOrEqual(300);
  });

  it("should have unique metric names", () => {
    const names = metricsCatalog.map((m) => m.name);
    const uniqueNames = new Set(names);
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    expect(duplicates).toEqual([]);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("should have all metrics start with 'cha_' prefix", () => {
    for (const metric of metricsCatalog) {
      expect(metric.name).toMatch(/^cha_/);
    }
  });

  it("should have component-matching prefix for each metric", () => {
    const prefixMap: Record<string, string> = {
      core: "cha_core_",
      access: "cha_access_",
      collector: "cha_collector_",
      snapshot_producer: "cha_snapshot_producer_",
      dlb: "cha_dlb_",
      bca: "cha_bca_",
      nfreg: "cha_nfreg_",
    };
    for (const metric of metricsCatalog) {
      const prefix = prefixMap[metric.component];
      expect(metric.name.startsWith(prefix)).toBe(true);
    }
  });

  it("should validate every metric against the zod schema", () => {
    for (const metric of metricsCatalog) {
      const result = MetricSchema.safeParse(metric);
      if (!result.success) {
        throw new Error(
          `Metric "${metric.name}" failed validation: ${result.error.message}`
        );
      }
    }
  });

  it("should have metricsByComponent with correct counts", () => {
    expect(metricsByComponent.size).toBe(7);
    let total = 0;
    for (const [, metrics] of metricsByComponent) {
      total += metrics.length;
    }
    expect(total).toBe(metricsCatalog.length);
  });

  it("should have metricsByName map with same count as catalog", () => {
    expect(metricsByName.size).toBe(metricsCatalog.length);
  });

  it("should have valid metric types", () => {
    const validTypes = new Set(["counter", "gauge", "histogram", "summary", "unknown"]);
    for (const metric of metricsCatalog) {
      expect(validTypes.has(metric.type)).toBe(true);
    }
  });

  it("should have valid audience members", () => {
    const validAudiences = new Set(["NOC", "SRE", "ENG"]);
    for (const metric of metricsCatalog) {
      for (const aud of metric.audience) {
        expect(validAudiences.has(aud)).toBe(true);
      }
    }
  });

  it("should have high confidence for all metrics", () => {
    for (const metric of metricsCatalog) {
      expect(metric.confidence).toBe("high");
    }
  });

  it("should have labels defined for most metrics", () => {
    const withLabels = metricsCatalog.filter((m) => m.labels.length > 0);
    // At least 90% of metrics should have labels
    expect(withLabels.length / metricsCatalog.length).toBeGreaterThanOrEqual(0.9);
  });
});
