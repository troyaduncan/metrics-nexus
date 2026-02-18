import { useEffect, useState, useRef } from "react";
import { Dialog, DialogFooter } from "@/components/ui/Dialog";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  AlertCircle,
  Download,
  X,
} from "lucide-react";
import type { ExportProgressState, ProgressActivity } from "@metrics-nexus/shared";

interface ExportProgressDialogProps {
  open: boolean;
  onClose: () => void;
  state: ExportProgressState;
  datasourceName: string;
  onCancel: () => void;
  onDownload: (format: "json" | "csv") => void;
}

export function ExportProgressDialog({
  open,
  onClose,
  state,
  datasourceName,
  onCancel,
  onDownload,
}: ExportProgressDialogProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.activities, autoScroll]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getActivityIcon = (type: ProgressActivity["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (state.status) {
      case "connecting":
        return <Badge variant="outline">Connecting...</Badge>;
      case "processing":
        return <Badge variant="blue">Processing</Badge>;
      case "complete":
        return <Badge variant="green">Complete</Badge>;
      case "error":
        return <Badge variant="red">Error</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Export Metrics: ${datasourceName}`}
      description="Exporting extended metrics with labels and sample counts"
      maxWidth="2xl"
    >
      <div className="flex items-center gap-2 -mt-4 mb-4">{getStatusBadge()}</div>

      <div className="space-y-4">
        {/* Progress Bar */}
        {state.progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">
                Progress: {state.progress.processed} / {state.progress.total}{" "}
                metrics
              </span>
              <span className="font-medium text-text-primary">
                {state.progress.percentage}%
              </span>
            </div>
            <ProgressBar value={state.progress.percentage} />
          </div>
        )}

        {/* Current Operation */}
        {state.progress && state.status === "processing" && (
          <Card className="!p-3 bg-surface-secondary/50">
            <div className="text-sm">
              <div className="font-medium text-text-primary">
                Current:{" "}
                <span className="font-mono text-magenta-500">
                  {state.progress.currentMetric}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Statistics Grid */}
        {state.progress && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="!p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" />
                <div>
                  <div className="text-xs text-text-muted">Elapsed</div>
                  <div className="text-lg font-semibold text-text-primary">
                    {formatTime(state.progress.elapsed)}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="!p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-text-muted" />
                <div>
                  <div className="text-xs text-text-muted">Rate</div>
                  <div className="text-lg font-semibold text-text-primary">
                    {state.progress.rate} /sec
                  </div>
                </div>
              </div>
            </Card>
            <Card className="!p-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" />
                <div>
                  <div className="text-xs text-text-muted">ETA</div>
                  <div className="text-lg font-semibold text-text-primary">
                    {state.status === "processing"
                      ? formatTime(state.progress.eta)
                      : "\u2014"}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Activity Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-text-primary">
              Activity Log
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
            >
              Auto-scroll: {autoScroll ? "On" : "Off"}
            </Button>
          </div>
          <div
            ref={scrollRef}
            className="h-[200px] overflow-y-auto rounded-lg border border-border p-3"
          >
            <div className="space-y-2">
              {state.activities.length === 0 ? (
                <div className="text-sm text-text-muted text-center py-4">
                  No activity yet...
                </div>
              ) : (
                state.activities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-text-primary break-words">
                        {activity.message}
                      </div>
                      <div className="text-xs text-text-muted">
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {state.error && (
          <Card className="!p-3 border-red-500/30 bg-red-500/10">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-red-500">Export Failed</div>
                <div className="text-sm text-text-muted mt-1">
                  {state.error}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <DialogFooter className="gap-2">
        {state.status === "complete" && state.result ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onDownload("json")} className="gap-2">
              <Download className="w-4 h-4" />
              Download JSON
            </Button>
            <Button onClick={() => onDownload("csv")} className="gap-2">
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
          </>
        ) : state.status === "error" ? (
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        ) : (
          <Button variant="secondary" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel Export
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}
