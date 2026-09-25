import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "./card";

const tones = {
  primary: "bg-primary-soft text-primary-soft-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  danger: "bg-danger-soft text-danger",
} as const;

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, tone = "primary", hint, className }: StatCardProps) {
  return (
    <Card className={cn("flex items-start gap-4 p-5", className)}>
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight text-foreground tabular-nums">{value}</p>
        {hint && <p className="text-xs text-subtle">{hint}</p>}
      </div>
    </Card>
  );
}
