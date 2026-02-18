import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDatasourceSchema, type InsertDatasource } from "@metrics-nexus/shared";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { DialogFooter } from "@/components/ui/Dialog";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface DatasourceFormProps {
  onSubmit: (values: InsertDatasource) => void;
  isPending?: boolean;
  defaultValues?: Partial<InsertDatasource>;
}

export function DatasourceForm({ onSubmit, isPending, defaultValues }: DatasourceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InsertDatasource>({
    resolver: zodResolver(insertDatasourceSchema),
    defaultValues: {
      name: "",
      url: "http://",
      type: "prometheus",
      authType: "none",
      skipVerify: false,
      status: "active",
      tlsClientCert: undefined,
      tlsClientKey: undefined,
      caCert: undefined,
      ...defaultValues,
    },
  });

  const authType = watch("authType");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">Name</label>
          <Input placeholder="e.g. Production Cluster" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">URL</label>
          <Input placeholder="https://prometheus:9090" {...register("url")} />
          {errors.url && (
            <p className="text-xs text-red-500">{errors.url.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-primary">
          Authentication Type
        </label>
        <Controller
          control={control}
          name="authType"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              options={[
                { value: "none", label: "No Auth" },
                { value: "basic", label: "Basic Auth" },
                { value: "tls", label: "TLS Client Auth" },
              ]}
            />
          )}
        />
        {errors.authType && (
          <p className="text-xs text-red-500">{errors.authType.message}</p>
        )}
      </div>

      {authType === "tls" && (
        <div className="space-y-4 p-4 border border-border rounded-lg bg-surface-secondary/30">
          <h4 className="font-medium text-sm flex items-center gap-2 text-text-primary">
            <ShieldCheck className="w-4 h-4 text-magenta-500" />
            TLS Configuration
          </h4>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">
              CA Certificate
            </label>
            <Controller
              control={control}
              name="caCert"
              render={({ field }) => (
                <Textarea
                  placeholder="-----BEGIN CERTIFICATE-----..."
                  className="font-mono text-xs"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />
            <p className="text-xs text-text-muted">
              Trust chain for the server certificate
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Client Certificate
              </label>
              <Controller
                control={control}
                name="tlsClientCert"
                render={({ field }) => (
                  <Textarea
                    placeholder="-----BEGIN CERTIFICATE-----..."
                    className="font-mono text-xs"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">
                Client Key
              </label>
              <Controller
                control={control}
                name="tlsClientKey"
                render={({ field }) => (
                  <Textarea
                    placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                    className="font-mono text-xs"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}

      <Controller
        control={control}
        name="skipVerify"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                Skip TLS Verification
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </label>
              <p className="text-xs text-text-muted">
                Allow self-signed certificates (Insecure)
              </p>
            </div>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />

      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Datasource"}
        </Button>
      </DialogFooter>
    </form>
  );
}
