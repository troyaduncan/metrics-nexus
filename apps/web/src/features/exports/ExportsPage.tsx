import { useState, useMemo } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Download } from "lucide-react";
import { useTierStore } from "@/lib/stores/tier-store";
import { metricsCatalog } from "@metrics-nexus/shared/data/metrics-catalog.js";
import { generateGrafanaJson } from "./generators/grafana-json";
import { generateAlertRulesYaml } from "./generators/alert-rules-yaml";

const TABS = [
  { id: "grafana", label: "Grafana Dashboard" },
  { id: "alerts", label: "Alert Rules" },
];

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportsPage() {
  const [activeTab, setActiveTab] = useState("grafana");
  const { tiers } = useTierStore();

  const tierMetrics = useMemo(() => {
    const allTierNames = [...tiers.tier1, ...tiers.tier2, ...tiers.tier3];
    return metricsCatalog.filter((m) => allTierNames.includes(m.name));
  }, [tiers]);

  const grafanaJson = useMemo(
    () => generateGrafanaJson(tiers, metricsCatalog),
    [tiers]
  );
  const alertYaml = useMemo(
    () => generateAlertRulesYaml(tiers, metricsCatalog),
    [tiers]
  );

  const content = activeTab === "grafana" ? grafanaJson : alertYaml;
  const filename =
    activeTab === "grafana"
      ? "cha-dashboard.json"
      : "cha-alert-rules.yml";
  const mimeType =
    activeTab === "grafana" ? "application/json" : "text/yaml";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Exports</h1>
        <p className="text-sm text-text-muted">
          {tierMetrics.length} metrics in tiers. Assign metrics in the Priority
          Builder to generate exports.
        </p>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-4 flex gap-2 mb-4">
        <Button
          variant="primary"
          size="sm"
          onClick={() => downloadFile(content, filename, mimeType)}
        >
          <Download size={14} />
          Download {activeTab === "grafana" ? "JSON" : "YAML"}
        </Button>
        <CopyButton text={content} />
      </div>

      <div className="rounded-xl border border-border bg-surface-secondary overflow-hidden">
        <pre className="p-4 text-xs font-mono text-text-primary overflow-auto max-h-[60vh] whitespace-pre">
          {content}
        </pre>
      </div>
    </div>
  );
}
