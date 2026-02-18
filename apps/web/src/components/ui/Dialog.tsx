import { useEffect, useRef, type ReactNode } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthStyles: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          className={clsx(
            "w-full bg-surface border border-border rounded-xl shadow-2xl max-h-[90vh] flex flex-col",
            maxWidthStyles[maxWidth]
          )}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {(title || description) && (
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-text-primary">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-text-muted mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-surface-tertiary text-text-muted transition-colors -mt-1 -mr-1"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>
  );
}

export function DialogFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-end gap-2 pt-4 border-t border-border mt-4",
        className
      )}
    >
      {children}
    </div>
  );
}
