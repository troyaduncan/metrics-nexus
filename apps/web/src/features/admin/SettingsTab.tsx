import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useToast } from "@/lib/hooks/use-toast";
import { useState } from "react";

export function SettingsTab() {
  const { refreshInterval, enableAlerts, updateSettings } = useSettingsStore();
  const { toast } = useToast();
  const [localInterval, setLocalInterval] = useState(String(refreshInterval));

  const handleSave = () => {
    const parsed = parseInt(localInterval, 10);
    if (isNaN(parsed) || parsed < 1) {
      toast({
        variant: "destructive",
        title: "Invalid value",
        description: "Refresh interval must be a positive number.",
      });
      return;
    }
    updateSettings({ refreshInterval: parsed });
    toast({
      title: "Settings Saved",
      description: "Application settings have been updated.",
    });
  };

  return (
    <Card className="border-t-4 border-t-magenta-500">
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>
          Configure global application behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">
            Data Refresh Interval (seconds)
          </label>
          <Input
            value={localInterval}
            onChange={(e) => setLocalInterval(e.target.value)}
            className="max-w-[200px]"
          />
          <p className="text-xs text-text-muted">
            How often to fetch new metrics from datasources.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-text-primary">
              Enable Alerts
            </label>
            <p className="text-xs text-text-muted">
              Receive notifications for critical metrics.
            </p>
          </div>
          <Switch
            checked={enableAlerts}
            onCheckedChange={(checked) => updateSettings({ enableAlerts: checked })}
          />
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
