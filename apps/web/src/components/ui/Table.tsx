import { clsx } from "clsx";
import type { ReactNode } from "react";

interface TableElementProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableElementProps) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx("w-full text-sm", className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }: TableElementProps) {
  return (
    <thead className={clsx("border-b border-border", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: TableElementProps) {
  return <tbody className={clsx("divide-y divide-border", className)}>{children}</tbody>;
}

export function TableRow({ children, className }: TableElementProps) {
  return (
    <tr className={clsx("hover:bg-surface-secondary/50 transition-colors", className)}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: TableElementProps) {
  return (
    <th
      className={clsx(
        "px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }: TableElementProps) {
  return (
    <td className={clsx("px-4 py-3 text-text-primary", className)}>
      {children}
    </td>
  );
}
