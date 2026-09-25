"use client";

import { cn } from "@/lib/utils";

export interface TabOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface SegmentedTabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Lightweight segmented control for filtering a single list. */
export function SegmentedTabs<T extends string>({ options, value, onChange, label, className }: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-muted p-1", className)}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
              selected ? "bg-surface text-foreground shadow-card" : "text-muted hover:text-foreground",
            )}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span className={cn("tabular-nums", selected ? "text-primary" : "text-subtle")}>{opt.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
