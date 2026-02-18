import { useState, useCallback, useRef, useEffect } from "react";
import type {
  ExportProgressState,
  MetricsProgress,
  ProgressActivity,
  ExtendedMetricInfo,
} from "@metrics-nexus/shared";
import { datasourceApi } from "@/lib/api/datasources";

interface UseMetricsExportSSEOptions {
  datasourceId: number;
  onComplete?: (metrics: ExtendedMetricInfo[]) => void;
  onError?: (error: string) => void;
}

export function useMetricsExportSSE({
  datasourceId,
  onComplete,
  onError,
}: UseMetricsExportSSEOptions) {
  const [state, setState] = useState<ExportProgressState>({
    status: "idle",
    progress: null,
    activities: [],
    error: null,
    result: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  const startExport = useCallback(() => {
    setState({
      status: "connecting",
      progress: null,
      activities: [
        {
          timestamp: Date.now(),
          message: "Connecting to server...",
          type: "info",
        },
      ],
      error: null,
      result: null,
    });

    const eventSource = new EventSource(
      datasourceApi.getExportStreamUrl(datasourceId)
    );
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("open", () => {
      setState((prev) => ({
        ...prev,
        status: "processing",
        activities: [
          ...prev.activities,
          {
            timestamp: Date.now(),
            message: "Connected. Starting export...",
            type: "info" as const,
          },
        ],
      }));
    });

    eventSource.addEventListener("progress", (e) => {
      const progress = JSON.parse(e.data) as MetricsProgress;
      setState((prev) => ({ ...prev, progress }));
    });

    eventSource.addEventListener("activity", (e) => {
      const activity = JSON.parse(e.data) as ProgressActivity;
      setState((prev) => ({
        ...prev,
        activities: [...prev.activities, activity].slice(-100),
      }));
    });

    eventSource.addEventListener("complete", (e) => {
      const { metrics } = JSON.parse(e.data);
      setState((prev) => ({
        ...prev,
        status: "complete",
        result: metrics,
        activities: [
          ...prev.activities,
          {
            timestamp: Date.now(),
            message: `Export completed! ${metrics.length} metrics exported.`,
            type: "success" as const,
          },
        ],
      }));
      eventSource.close();
      if (onComplete) {
        onComplete(metrics);
      }
    });

    eventSource.addEventListener("error", (e: Event) => {
      let errorMessage = "Connection error";
      const messageEvent = e as MessageEvent;
      if (messageEvent.data) {
        try {
          const errorData = JSON.parse(messageEvent.data);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // ignore parse error
        }
      }

      setState((prev) => ({
        ...prev,
        status: "error",
        error: errorMessage,
        activities: [
          ...prev.activities,
          {
            timestamp: Date.now(),
            message: errorMessage,
            type: "error" as const,
          },
        ],
      }));
      eventSource.close();
      if (onError) {
        onError(errorMessage);
      }
    });

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setState((prev) => {
          if (prev.status !== "complete" && prev.status !== "error") {
            return {
              ...prev,
              status: "error",
              error: "Connection lost",
              activities: [
                ...prev.activities,
                {
                  timestamp: Date.now(),
                  message: "Connection to server lost",
                  type: "error" as const,
                },
              ],
            };
          }
          return prev;
        });
      }
    };
  }, [datasourceId, onComplete, onError]);

  const cancelExport = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      status: "idle",
      activities: [
        ...prev.activities,
        {
          timestamp: Date.now(),
          message: "Export cancelled by user",
          type: "warning" as const,
        },
      ],
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    state,
    startExport,
    cancelExport,
    isExporting:
      state.status === "connecting" || state.status === "processing",
  };
}
