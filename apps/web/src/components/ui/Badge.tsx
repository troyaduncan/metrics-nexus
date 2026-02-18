import { clsx } from "clsx";

type BadgeVariant =
  | "default"
  | "outline"
  | "magenta"
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-tertiary text-text-secondary",
  outline: "border border-border text-text-secondary bg-transparent",
  magenta: "bg-magenta-500/10 text-magenta-500 dark:text-magenta-400",
  green: "bg-green-500/10 text-green-700 dark:text-green-400",
  yellow: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  red: "bg-red-500/10 text-red-700 dark:text-red-400",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function typeBadgeVariant(type: string): BadgeVariant {
  switch (type) {
    case "counter": return "blue";
    case "gauge": return "green";
    case "summary": return "purple";
    case "histogram": return "yellow";
    default: return "default";
  }
}

export function categoryBadgeVariant(category: string): BadgeVariant {
  switch (category) {
    case "errors": return "red";
    case "latency": return "yellow";
    case "throughput": return "magenta";
    case "health": return "green";
    case "saturation": return "red";
    default: return "default";
  }
}
