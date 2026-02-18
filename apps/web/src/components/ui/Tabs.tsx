import { clsx } from "clsx";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 border-b border-border" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
            activeTab === tab.id
              ? "border-magenta-500 text-magenta-500"
              : "border-transparent text-text-muted hover:text-text-primary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
