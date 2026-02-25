import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, typeBadgeVariant } from "@/components/ui/Badge";
import { metricTargetApi } from "@/lib/api/metric-targets";
import {
  Star,
  StarOff,
  Edit3,
  Trash2,
  Search,
  FolderOpen,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { MetricTarget } from "@metrics-nexus/shared";

interface SavedTargetsPanelProps {
  onSelect: (target: MetricTarget) => void;
  onEdit: (target: MetricTarget) => void;
  selectedId?: string;
}

export function SavedTargetsPanel({
  onSelect,
  onEdit,
  selectedId,
}: SavedTargetsPanelProps) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const queryClient = useQueryClient();

  const { data: targets = [], isLoading } = useQuery({
    queryKey: ["metric-targets"],
    queryFn: metricTargetApi.getAll,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => metricTargetApi.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["metric-targets"] }),
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      metricTargetApi.update(id, { isFavorite: !isFavorite }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["metric-targets"] }),
  });

  const filterFn = (t: MetricTarget) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.metricName.toLowerCase().includes(search.toLowerCase());

  const favorites = targets.filter((t) => t.isFavorite).filter(filterFn);
  const others = targets.filter((t) => !t.isFavorite).filter(filterFn);

  if (collapsed) {
    return (
      <div className="w-10 shrink-0 flex flex-col items-center pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(false)}
          title="Show saved targets"
          className="p-1"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {targets.length > 0 && (
          <Badge variant="magenta" className="mt-2 text-[9px] px-1">
            {targets.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="w-72 shrink-0 border-l border-border bg-surface-secondary flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-primary">
            Saved Targets
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
            title="Collapse panel"
            className="p-1"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Input
          placeholder="Search targets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-3.5 h-3.5" />}
          className="text-xs py-1.5"
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-md bg-surface-tertiary animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="p-2">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1">
                  Favorites
                </p>
                {favorites.map((t) => (
                  <TargetItem
                    key={t.id}
                    target={t}
                    isSelected={selectedId === t.id}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    onToggleFavorite={(id, curr) =>
                      favoriteMutation.mutate({ id, isFavorite: curr })
                    }
                  />
                ))}
              </div>
            )}

            {/* All Targets */}
            <div className="p-2">
              <div className="flex items-center justify-between px-2 mb-1">
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                  {favorites.length > 0 ? "All Targets" : "Saved Targets"}
                </p>
                <Badge variant="default" className="text-[9px]">
                  {targets.length}
                </Badge>
              </div>
              {others.length > 0 ? (
                others.map((t) => (
                  <TargetItem
                    key={t.id}
                    target={t}
                    isSelected={selectedId === t.id}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    onToggleFavorite={(id, curr) =>
                      favoriteMutation.mutate({ id, isFavorite: curr })
                    }
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                  <FolderOpen className="w-7 h-7 text-text-muted/40 mb-2" />
                  <p className="text-xs text-text-muted">
                    {search
                      ? "No targets match"
                      : "No saved targets yet"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TargetItem({
  target,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
}: {
  target: MetricTarget;
  isSelected: boolean;
  onSelect: (t: MetricTarget) => void;
  onEdit: (t: MetricTarget) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
}) {
  return (
    <div
      className={clsx(
        "group relative rounded-lg p-2 cursor-pointer transition-colors mb-0.5",
        isSelected
          ? "bg-magenta-500/10 border border-magenta-500/30"
          : "hover:bg-surface-tertiary border border-transparent"
      )}
      onClick={() => onSelect(target)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(target);
      }}
    >
      <div className="flex flex-col gap-1 min-w-0 pr-16">
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: target.color }}
          />
          <span className="text-sm font-medium truncate text-text-primary">
            {target.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge
            variant={typeBadgeVariant(target.metricType)}
            className="text-[9px]"
          >
            {target.metricType}
          </Badge>
          {target.legendFormat && (
            <Badge variant="outline" className="text-[9px] font-mono">
              {target.legendFormat}
            </Badge>
          )}
        </div>
        <p className="text-[9px] font-mono text-text-muted truncate">
          {target.expression}
        </p>
      </div>

      {/* Action buttons - show on hover */}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          title={target.isFavorite ? "Unfavorite" : "Favorite"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(target.id, target.isFavorite);
          }}
          className="p-1 rounded hover:bg-surface-secondary transition-colors"
        >
          {target.isFavorite ? (
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          ) : (
            <StarOff className="w-3 h-3 text-text-muted" />
          )}
        </button>
        <button
          type="button"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(target);
          }}
          className="p-1 rounded hover:bg-surface-secondary transition-colors"
        >
          <Edit3 className="w-3 h-3 text-text-muted" />
        </button>
        <button
          type="button"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(target.id);
          }}
          className="p-1 rounded hover:bg-surface-secondary transition-colors"
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </button>
      </div>
    </div>
  );
}
