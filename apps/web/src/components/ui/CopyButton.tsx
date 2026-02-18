import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { clsx } from "clsx";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        "p-1.5 rounded-md hover:bg-surface-tertiary text-text-muted transition-colors",
        copied && "text-green-500",
        className
      )}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}
