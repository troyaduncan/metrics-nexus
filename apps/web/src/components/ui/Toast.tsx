import { clsx } from "clsx";
import { X } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full duration-200",
            toast.variant === "destructive"
              ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
              : "bg-surface border-border text-text-primary"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && (
                <p
                  className={clsx(
                    "text-xs mt-1",
                    toast.variant === "destructive"
                      ? "text-red-600/80 dark:text-red-400/80"
                      : "text-text-muted"
                  )}
                >
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 p-0.5 rounded hover:bg-surface-tertiary transition-colors text-text-muted"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
