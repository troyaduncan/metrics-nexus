import { useRef, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Circle } from "lucide-react";
import { useQueryLogStore } from "@/lib/stores/query-log-store";
import type { QueryLogEntry } from "@/lib/stores/query-log-store";
import { clsx } from "clsx";

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function StatusBadge({ entry }: { entry: QueryLogEntry }) {
  if (entry.status === "pending") {
    return (
      <span className="flex items-center gap-1 text-yellow-400">
        <Circle size={8} className="animate-pulse fill-yellow-400" />
        pending
      </span>
    );
  }
  if (entry.status === "error") {
    return (
      <span className="flex items-center gap-1 text-red-400 font-medium">
        <Circle size={8} className="fill-red-400" />
        error
      </span>
    );
  }
  if (entry.status === "no-data") {
    return (
      <span className="flex items-center gap-1 text-text-muted">
        <Circle size={8} className="fill-text-muted" />
        no data
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-green-400">
      <Circle size={8} className="fill-green-400" />
      ok
    </span>
  );
}

function KindBadge({ kind }: { kind: QueryLogEntry["kind"] }) {
  const styles = {
    instant: "bg-blue-500/15 text-blue-400",
    range: "bg-purple-500/15 text-purple-400",
    labels: "bg-slate-500/15 text-slate-400",
  };
  return (
    <span className={clsx("px-1.5 py-0.5 rounded text-[10px] font-mono font-medium", styles[kind])}>
      {kind}
    </span>
  );
}

function LogRow({ entry }: { entry: QueryLogEntry }) {
  const rowClass = clsx(
    "grid items-center gap-2 px-3 py-1.5 text-xs border-b border-border/50 hover:bg-surface-secondary/50 transition-colors",
    "grid-cols-[80px_52px_36px_1fr_64px_40px_52px_32px]",
    entry.status === "error" && "bg-red-500/5",
    entry.status === "no-data" && "bg-yellow-500/5",
    entry.status === "pending" && "opacity-70"
  );

  const ds = entry.datasourceId ? `ds:${entry.datasourceId}` : "global";

  // strip the base from endpoint for display
  const endpointShort = entry.endpoint
    .replace(/^.*\/api\/(datasources\/\d+\/)?prom\//, "")
    .replace(/^.*\/api\/prom\//, "");

  return (
    <div className={rowClass}>
      {/* Time */}
      <span className="font-mono text-text-muted tabular-nums">{formatTime(entry.timestamp)}</span>

      {/* Kind */}
      <KindBadge kind={entry.kind} />

      {/* Datasource */}
      <span className="font-mono text-text-muted text-[10px] truncate" title={entry.endpoint}>
        {ds}
      </span>

      {/* PromQL / label name */}
      <span
        className="font-mono text-text-primary truncate"
        title={entry.promql}
      >
        {entry.promql}
      </span>

      {/* Status */}
      <StatusBadge entry={entry} />

      {/* HTTP status */}
      <span
        className={clsx(
          "font-mono tabular-nums text-center",
          entry.httpStatus && entry.httpStatus >= 400 ? "text-red-400" : "text-text-muted"
        )}
      >
        {entry.httpStatus ?? "—"}
      </span>

      {/* Duration */}
      <span
        className={clsx(
          "font-mono tabular-nums text-right",
          entry.durationMs !== undefined && entry.durationMs > 1000
            ? "text-yellow-400"
            : "text-text-muted"
        )}
      >
        {entry.durationMs !== undefined ? `${entry.durationMs}ms` : "—"}
      </span>

      {/* Result count */}
      <span
        className={clsx(
          "font-mono tabular-nums text-center",
          entry.resultCount === 0 ? "text-yellow-400" : "text-text-muted"
        )}
      >
        {entry.resultCount !== undefined ? entry.resultCount : "—"}
      </span>
    </div>
  );
}

export function QueryLogPanel() {
  const entries = useQueryLogStore((s) => s.entries);
  const clear = useQueryLogStore((s) => s.clear);
  const [open, setOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, autoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 40);
  };

  const errorCount = entries.filter((e) => e.status === "error").length;
  const noDataCount = entries.filter((e) => e.status === "no-data").length;

  return (
    <div className="mt-6 rounded-xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-surface-secondary cursor-pointer select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-text-primary">Request Log</span>
          <span className="text-xs text-text-muted">{entries.length} entries</span>
          {errorCount > 0 && (
            <span className="text-xs text-red-400 font-medium">{errorCount} error{errorCount !== 1 ? "s" : ""}</span>
          )}
          {noDataCount > 0 && (
            <span className="text-xs text-yellow-400 font-medium">{noDataCount} no-data</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); clear(); }}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors"
            title="Clear log"
          >
            <Trash2 size={12} />
            Clear
          </button>
          {open ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
        </div>
      </div>

      {open && (
        <>
          {/* Column headers */}
          <div className="grid gap-2 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted border-b border-border bg-surface-secondary/50 grid-cols-[80px_52px_36px_1fr_64px_40px_52px_32px]">
            <span>Time</span>
            <span>Type</span>
            <span>DS</span>
            <span>Query / Label</span>
            <span>Status</span>
            <span className="text-center">HTTP</span>
            <span className="text-right">Latency</span>
            <span className="text-center">#</span>
          </div>

          {/* Log rows */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-72 overflow-y-auto font-mono"
          >
            {entries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-text-muted">
                No requests yet — interact with the dashboard to see logs.
              </div>
            ) : (
              entries.map((entry) => <LogRow key={entry.id} entry={entry} />)
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-3 py-1.5 border-t border-border bg-surface-secondary/30 text-[10px] text-text-muted">
            <span>
              Legend:&nbsp;
              <span className="text-green-400">ok</span> = data returned&nbsp;·&nbsp;
              <span className="text-yellow-400">no-data</span> = 200 but 0 series&nbsp;·&nbsp;
              <span className="text-red-400">error</span> = request failed&nbsp;·&nbsp;
              <span className="text-text-muted"># = series count</span>
            </span>
            {!autoScroll && (
              <button
                onClick={() => {
                  setAutoScroll(true);
                  if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }}
                className="text-magenta-500 hover:underline"
              >
                ↓ Jump to latest
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
