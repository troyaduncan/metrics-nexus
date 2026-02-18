import type { TierConfig } from "@metrics-nexus/shared/schemas/tier.js";
import type { Metric } from "@metrics-nexus/shared/schemas/metric.js";

function buildGrafanaPanel(
  metric: Metric,
  index: number,
  gridPos: { h: number; w: number; x: number; y: number }
) {
  const promql = metric.examples?.[0]?.promql || `${metric.name}`;
  const query = promql.replace(/\{\$filters\}/g, "{$cluster, $region, $service, $instance, $pod}");

  return {
    type:
      metric.type === "gauge"
        ? "gauge"
        : "timeseries",
    title: metric.name.replace(/^cha_/, "").replace(/_/g, " "),
    description: metric.description || "",
    gridPos,
    id: index + 1,
    targets: [
      {
        datasource: { type: "prometheus", uid: "${DS_PROMETHEUS}" },
        expr: query,
        legendFormat: "{{__name__}}",
        refId: "A",
      },
    ],
    fieldConfig: {
      defaults: {
        unit: metric.unit === "milliseconds" ? "ms" : "short",
        thresholds: {
          mode: "absolute",
          steps: [
            { value: null, color: "green" },
            { value: 0.01, color: "orange" },
            { value: 0.05, color: "red" },
          ],
        },
      },
      overrides: [],
    },
  };
}

export function generateGrafanaJson(
  tiers: TierConfig,
  catalog: Metric[]
): string {
  const metricMap = new Map(catalog.map((m) => [m.name, m]));

  const panels: ReturnType<typeof buildGrafanaPanel>[] = [];
  let panelIndex = 0;
  let yPos = 0;

  for (const [tierKey, tierLabel] of [
    ["tier1", "Tier 1 — NOC"],
    ["tier2", "Tier 2 — SRE"],
    ["tier3", "Tier 3 — Engineering"],
  ] as const) {
    const metricNames = tiers[tierKey];
    if (metricNames.length === 0) continue;

    // Row header
    panels.push({
      type: "row",
      title: tierLabel,
      description: "",
      gridPos: { h: 1, w: 24, x: 0, y: yPos },
      id: panelIndex + 1,
      targets: [],
      fieldConfig: { defaults: { unit: "", thresholds: { mode: "", steps: [] } }, overrides: [] },
    } as ReturnType<typeof buildGrafanaPanel>);
    panelIndex++;
    yPos += 1;

    // Panels in this tier
    for (let i = 0; i < metricNames.length; i++) {
      const metric = metricMap.get(metricNames[i]);
      if (!metric) continue;

      const col = (i % 3) * 8;
      const row = yPos + Math.floor(i / 3) * 8;

      panels.push(
        buildGrafanaPanel(metric, panelIndex, {
          h: 8,
          w: 8,
          x: col,
          y: row,
        })
      );
      panelIndex++;
    }
    yPos += Math.ceil(metricNames.length / 3) * 8;
  }

  const dashboard = {
    __inputs: [
      {
        name: "DS_PROMETHEUS",
        label: "Prometheus",
        type: "datasource",
        pluginId: "prometheus",
      },
    ],
    annotations: { list: [] },
    editable: true,
    fiscalYearStartMonth: 0,
    graphTooltip: 1,
    id: null,
    links: [],
    panels,
    schemaVersion: 39,
    tags: ["cha", "metrics-nexus"],
    templating: {
      list: [
        { name: "cluster", type: "query", query: "label_values(cluster)", datasource: { type: "prometheus", uid: "${DS_PROMETHEUS}" }, multi: false, includeAll: true },
        { name: "region", type: "query", query: "label_values(region)", datasource: { type: "prometheus", uid: "${DS_PROMETHEUS}" }, multi: false, includeAll: true },
        { name: "service", type: "query", query: "label_values(service)", datasource: { type: "prometheus", uid: "${DS_PROMETHEUS}" }, multi: false, includeAll: true },
        { name: "instance", type: "query", query: "label_values(instance)", datasource: { type: "prometheus", uid: "${DS_PROMETHEUS}" }, multi: false, includeAll: true },
        { name: "pod", type: "query", query: "label_values(pod)", datasource: { type: "prometheus", uid: "${DS_PROMETHEUS}" }, multi: false, includeAll: true },
      ],
    },
    time: { from: "now-1h", to: "now" },
    title: "CHA Metrics Dashboard (Metrics Nexus)",
    uid: "metrics-nexus-cha",
    version: 1,
  };

  return JSON.stringify(dashboard, null, 2);
}
