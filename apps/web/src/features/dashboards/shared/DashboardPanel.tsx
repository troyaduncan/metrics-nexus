import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import { Spinner } from "@/components/ui/Spinner";
import { Info, AlertTriangle, Database } from "lucide-react";

export interface PanelTarget {
  expr: string;
  legendFormat?: string;
}

export interface PanelDefinition {
  id: string;
  title: string;
  description: string;
  promql: string;
  targets?: PanelTarget[];
  metricUsed: string;
  chartType: "timeseries" | "gauge" | "bar" | "stat";
  unit?: string;
  thresholds?: { warning: number; critical: number };
  stack?: boolean;
}

interface DashboardPanelProps {
  panel: PanelDefinition;
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  error?: string;
  hasData?: boolean;
  noSource?: boolean;
}

export function DashboardPanel({
  panel,
  children,
  isLoading,
  isError,
  error,
  hasData,
  noSource,
}: DashboardPanelProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-text-primary">
          {panel.title}
        </h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1 rounded hover:bg-surface-tertiary text-text-muted transition-colors"
          aria-label="Panel info"
        >
          <Info size={14} />
        </button>
      </div>

      {showInfo && (
        <div className="mb-3 rounded-lg bg-surface-secondary border border-border p-3 space-y-2">
          <p className="text-xs text-text-muted">{panel.description}</p>
          <div className="text-xs">
            <span className="text-text-muted">Metric: </span>
            <code className="text-magenta-400 font-mono">
              {panel.metricUsed}
            </code>
          </div>
          <div className="flex items-start gap-2">
            <code className="flex-1 text-[10px] font-mono text-text-secondary break-all">
              {panel.promql}
            </code>
            <CopyButton text={panel.promql} />
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
            <AlertTriangle size={20} className="text-orange-500" />
            <p className="text-xs">{error || "Failed to fetch data"}</p>
            <div className="mt-2 rounded bg-surface-secondary p-2">
              <code className="text-[10px] font-mono text-text-muted break-all">
                {panel.promql}
              </code>
            </div>
          </div>
        )}
        {noSource && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
            <Database size={20} className="text-text-muted opacity-40" />
            <p className="text-xs">Select a data source in the header</p>
          </div>
        )}
        {!noSource && !isLoading && !isError && !hasData && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-muted">
            <p className="text-xs">No data returned</p>
            <div className="mt-2 rounded bg-surface-secondary p-2">
              <code className="text-[10px] font-mono text-text-muted break-all">
                {panel.promql}
              </code>
            </div>
          </div>
        )}
        {!isLoading && !isError && hasData && children}
      </div>
    </Card>
  );
}
