import type { Datasource } from "@metrics-nexus/shared";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import {
  Database,
  Wifi,
  Download,
  Edit2,
  Trash2,
  Loader2,
  FileJson,
  FileSpreadsheet,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DatasourceTableProps {
  datasources: Datasource[];
  onTestConnection: (id: number) => void;
  onExport: (id: number, format: "json" | "csv") => void;
  onStreamExport: (id: number) => void;
  onDelete: (id: number) => void;
  isTestingConnection: boolean;
  testingId: number | null;
}

function authBadgeVariant(authType: string) {
  switch (authType) {
    case "tls":
      return "green" as const;
    case "basic":
      return "blue" as const;
    default:
      return "outline" as const;
  }
}

export function DatasourceTable({
  datasources,
  onTestConnection,
  onExport,
  onStreamExport,
  onDelete,
  isTestingConnection,
  testingId,
}: DatasourceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Auth</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {datasources.map((ds) => (
          <TableRow key={ds.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-text-muted" />
                {ds.name}
              </div>
            </TableCell>
            <TableCell>
              <span className="font-mono text-xs text-text-muted">
                {ds.url}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={authBadgeVariant(ds.authType)} className="capitalize">
                {ds.authType}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    ds.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="capitalize text-sm">{ds.status}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-text-muted text-sm">
                {formatDistanceToNow(new Date(ds.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTestConnection(ds.id)}
                  disabled={isTestingConnection && testingId === ds.id}
                  title="Test Connection"
                >
                  {isTestingConnection && testingId === ds.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wifi className="w-4 h-4" />
                  )}
                </Button>
                <DropdownMenu
                  trigger={
                    <Button variant="ghost" size="sm" title="Export Metrics">
                      <Download className="w-4 h-4" />
                    </Button>
                  }
                  items={[
                    {
                      label: "Export as JSON",
                      icon: <FileJson className="w-4 h-4" />,
                      onClick: () => onExport(ds.id, "json"),
                    },
                    {
                      label: "Export as CSV",
                      icon: <FileSpreadsheet className="w-4 h-4" />,
                      onClick: () => onExport(ds.id, "csv"),
                    },
                    {
                      label: "Extended Export (Stream)",
                      icon: <Download className="w-4 h-4" />,
                      onClick: () => onStreamExport(ds.id),
                    },
                  ]}
                />
                <Button variant="ghost" size="sm" title="Edit" disabled>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  onClick={() => onDelete(ds.id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
