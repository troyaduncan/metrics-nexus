import { useCallback } from "react";
import { useTierStore } from "@/lib/stores/tier-store";
import { metricsCatalog } from "@metrics-nexus/shared/data/metrics-catalog.js";
import { Button } from "@/components/ui/Button";
import { Badge, categoryBadgeVariant } from "@/components/ui/Badge";
import { Download, Upload, Sparkles, Trash2, ArrowRight } from "lucide-react";
import type { TierLevel, TierConfig } from "@metrics-nexus/shared/schemas/tier.js";
import type { Metric } from "@metrics-nexus/shared/schemas/metric.js";

const TIER_META: Record<TierLevel, { label: string; desc: string; color: string }> = {
  tier1: {
    label: "Tier 1 — NOC",
    desc: "Availability, health, error spikes, saturation",
    color: "border-red-500/50",
  },
  tier2: {
    label: "Tier 2 — SRE",
    desc: "SLIs, latency, burn-rate candidates",
    color: "border-yellow-500/50",
  },
  tier3: {
    label: "Tier 3 — Engineering",
    desc: "Deep-dive, breakdowns, domain metrics",
    color: "border-blue-500/50",
  },
};

function getMetricByName(name: string): Metric | undefined {
  return metricsCatalog.find((m) => m.name === name);
}

function getSuggestedDefaults(): TierConfig {
  const tier1: string[] = [];
  const tier2: string[] = [];
  const tier3: string[] = [];

  for (const m of metricsCatalog) {
    if (
      m.category === "errors" ||
      m.category === "health" ||
      m.category === "saturation"
    ) {
      tier1.push(m.name);
    } else if (m.category === "latency" || m.category === "throughput") {
      tier2.push(m.name);
    } else {
      tier3.push(m.name);
    }
  }
  return { tier1, tier2, tier3 };
}

export function PriorityBuilderPage() {
  const { tiers, setTiers, removeFromTier, moveToTier, clearTiers } =
    useTierStore();

  const totalAssigned =
    tiers.tier1.length + tiers.tier2.length + tiers.tier3.length;

  const handleSuggest = useCallback(() => {
    setTiers(getSuggestedDefaults());
  }, [setTiers]);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(tiers, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tier-config.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [tiers]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const parsed = JSON.parse(text) as TierConfig;
        if (parsed.tier1 && parsed.tier2 && parsed.tier3) {
          setTiers(parsed);
        }
      } catch {
        // ignore invalid JSON
      }
    };
    input.click();
  }, [setTiers]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Priority Builder
          </h1>
          <p className="text-sm text-text-muted">
            {totalAssigned} of {metricsCatalog.length} metrics assigned to tiers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleSuggest}>
            <Sparkles size={14} />
            Suggest Defaults
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download size={14} />
            Export
          </Button>
          <Button variant="secondary" size="sm" onClick={handleImport}>
            <Upload size={14} />
            Import
          </Button>
          <Button variant="ghost" size="sm" onClick={clearTiers}>
            <Trash2 size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(["tier1", "tier2", "tier3"] as TierLevel[]).map((tier) => {
          const meta = TIER_META[tier];
          const nextTier =
            tier === "tier1" ? "tier2" : tier === "tier2" ? "tier3" : null;
          const prevTier =
            tier === "tier3" ? "tier2" : tier === "tier2" ? "tier1" : null;

          return (
            <div
              key={tier}
              className={`rounded-xl border-2 ${meta.color} bg-surface p-4`}
            >
              <div className="mb-3">
                <h2 className="text-sm font-bold text-text-primary">
                  {meta.label}
                </h2>
                <p className="text-xs text-text-muted">{meta.desc}</p>
                <p className="text-xs text-text-muted mt-1">
                  {tiers[tier].length} metrics
                </p>
              </div>
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
                {tiers[tier].map((name) => {
                  const m = getMetricByName(name);
                  return (
                    <div
                      key={name}
                      className="flex items-center gap-2 rounded-lg bg-surface-secondary border border-border px-2.5 py-1.5 group"
                    >
                      <span className="flex-1 text-xs font-mono text-text-primary truncate">
                        {name}
                      </span>
                      {m && (
                        <Badge
                          variant={categoryBadgeVariant(m.category)}
                          className="shrink-0"
                        >
                          {m.category}
                        </Badge>
                      )}
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {prevTier && (
                          <button
                            onClick={() => moveToTier(tier, prevTier, name)}
                            className="p-0.5 rounded text-text-muted hover:text-text-primary"
                            title={`Move to ${prevTier}`}
                          >
                            <ArrowRight size={12} className="rotate-180" />
                          </button>
                        )}
                        {nextTier && (
                          <button
                            onClick={() => moveToTier(tier, nextTier, name)}
                            className="p-0.5 rounded text-text-muted hover:text-text-primary"
                            title={`Move to ${nextTier}`}
                          >
                            <ArrowRight size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => removeFromTier(tier, name)}
                          className="p-0.5 rounded text-text-muted hover:text-red-500"
                          title="Remove"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {tiers[tier].length === 0 && (
                  <p className="text-xs text-text-muted text-center py-8">
                    No metrics assigned. Use the Catalog to add metrics or click
                    &quot;Suggest Defaults&quot;.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
