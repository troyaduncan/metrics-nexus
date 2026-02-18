import { clsx } from "clsx";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={clsx("animate-spin rounded-full border-2 border-border border-t-magenta-500 h-5 w-5", className)}
      role="status"
      aria-label="Loading"
    />
  );
}
