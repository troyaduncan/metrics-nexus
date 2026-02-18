import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { Dialog } from "@/components/ui/Dialog";
import { useToast } from "@/lib/hooks/use-toast";
import { datasourceApi } from "@/lib/api/datasources";
import { DatasourceForm } from "./DatasourceForm";
import { DatasourceTable } from "./DatasourceTable";
import { SettingsTab } from "./SettingsTab";
import { ExportProgressDialog } from "./ExportProgressDialog";
import { useMetricsExportSSE } from "./useMetricsExportSSE";
import { Plus, Database, Loader2 } from "lucide-react";
import type { InsertDatasource, ExtendedMetricInfo } from "@metrics-nexus/shared";

export function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("datasources");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [testingId, setTestingId] = useState<number | null>(null);

  // Streaming export state
  const [exportDatasourceId, setExportDatasourceId] = useState<number>(0);
  const [exportDatasourceName, setExportDatasourceName] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const { data: datasources = [], isLoading } = useQuery({
    queryKey: ["datasources"],
    queryFn: datasourceApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: datasourceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasources"] });
      setIsFormOpen(false);
      toast({
        title: "Datasource Added",
        description: "Connection has been configured successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to create datasource",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: datasourceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasources"] });
      toast({
        variant: "destructive",
        title: "Datasource Removed",
        description: "The connection has been removed.",
      });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: datasourceApi.testConnection,
    onSuccess: (result) => {
      setTestingId(null);
      if (result.success) {
        toast({
          title: "Connection Successful",
          description: `Connected successfully. Found ${result.metricCount} metrics.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: result.error || "Unable to connect to datasource.",
        });
      }
    },
    onError: (error: Error) => {
      setTestingId(null);
      toast({
        variant: "destructive",
        title: "Connection Test Failed",
        description: error.message,
      });
    },
  });

  const handleTestConnection = (id: number) => {
    setTestingId(id);
    testConnectionMutation.mutate(id);
  };

  const handleExport = (datasourceId: number, format: "json" | "csv") => {
    const url = datasourceApi.getExportUrl(datasourceId, format);
    window.open(url, "_blank");
  };

  const handleStreamExport = (datasourceId: number) => {
    const ds = datasources.find((d) => d.id === datasourceId);
    if (ds) {
      setExportDatasourceId(datasourceId);
      setExportDatasourceName(ds.name);
      setIsExportDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this datasource?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (values: InsertDatasource) => {
    createMutation.mutate(values);
  };

  const handleExportDownload = useCallback(
    (metrics: ExtendedMetricInfo[], format: "json" | "csv") => {
      const blob =
        format === "json"
          ? new Blob([JSON.stringify(metrics, null, 2)], {
              type: "application/json",
            })
          : new Blob(
              [
                [
                  "name,type,help,labels,sampleCount",
                  ...metrics.map(
                    (m) =>
                      `"${m.name}","${m.type}","${m.help.replace(/"/g, '""')}","${m.labels.join(", ")}",${m.sampleCount}`
                  ),
                ].join("\n"),
              ],
              { type: "text/csv" }
            );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `metrics-${exportDatasourceName.replace(/[^a-zA-Z0-9-_]/g, "_")}-${new Date().toISOString().split("T")[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [exportDatasourceName]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Admin Settings
        </h1>
        <p className="text-text-muted mt-1">
          Manage data sources and application configuration.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: "datasources", label: "Data Sources" },
          { id: "settings", label: "App Settings" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "datasources" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Prometheus Connections
              </h2>
              <p className="text-sm text-text-muted">
                Manage connections to your Prometheus servers.
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Datasource
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configured Datasources</CardTitle>
              <CardDescription>
                Active connections to metrics providers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-magenta-500" />
                </div>
              ) : datasources.length === 0 ? (
                <div className="text-center py-12 text-text-muted">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">
                    No datasources configured
                  </p>
                  <p className="text-sm mt-1">
                    Click "Add Datasource" to get started.
                  </p>
                </div>
              ) : (
                <DatasourceTable
                  datasources={datasources}
                  onTestConnection={handleTestConnection}
                  onExport={handleExport}
                  onStreamExport={handleStreamExport}
                  onDelete={handleDelete}
                  isTestingConnection={testConnectionMutation.isPending}
                  testingId={testingId}
                />
              )}
            </CardContent>
          </Card>

          {/* Add Datasource Dialog */}
          <Dialog
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            title="Add Prometheus Datasource"
            description="Configure connection details and security settings."
            maxWidth="2xl"
          >
            <DatasourceForm
              onSubmit={handleFormSubmit}
              isPending={createMutation.isPending}
            />
          </Dialog>

          {/* Stream Export Dialog */}
          {isExportDialogOpen && exportDatasourceId > 0 && (
            <StreamExportWrapper
              datasourceId={exportDatasourceId}
              datasourceName={exportDatasourceName}
              open={isExportDialogOpen}
              onClose={() => setIsExportDialogOpen(false)}
              onDownload={handleExportDownload}
            />
          )}
        </div>
      )}

      {activeTab === "settings" && <SettingsTab />}
    </div>
  );
}

// Wrapper component to isolate SSE hook lifecycle
function StreamExportWrapper({
  datasourceId,
  datasourceName,
  open,
  onClose,
  onDownload,
}: {
  datasourceId: number;
  datasourceName: string;
  open: boolean;
  onClose: () => void;
  onDownload: (metrics: ExtendedMetricInfo[], format: "json" | "csv") => void;
}) {
  const { state, startExport, cancelExport, isExporting } =
    useMetricsExportSSE({ datasourceId });

  // Auto-start export when mounted
  useState(() => {
    startExport();
  });

  return (
    <ExportProgressDialog
      open={open}
      onClose={() => {
        if (isExporting) cancelExport();
        onClose();
      }}
      state={state}
      datasourceName={datasourceName}
      onCancel={() => {
        cancelExport();
        onClose();
      }}
      onDownload={(format) => {
        if (state.result) {
          onDownload(state.result, format);
        }
      }}
    />
  );
}
