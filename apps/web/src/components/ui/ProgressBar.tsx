import { clsx } from "clsx";

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={clsx(
        "h-3 w-full overflow-hidden rounded-full bg-surface-tertiary",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-magenta-500 transition-all duration-300"
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
