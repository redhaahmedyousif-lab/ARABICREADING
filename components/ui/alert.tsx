import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  danger: { className: "border-danger/30 bg-danger-soft text-danger", icon: AlertCircle },
  success: { className: "border-success/30 bg-success-soft text-success", icon: CheckCircle2 },
  info: { className: "border-info/30 bg-info-soft text-info", icon: Info },
} satisfies Record<string, { className: string; icon: LucideIcon }>;

interface AlertProps extends React.ComponentProps<"div"> {
  tone?: keyof typeof tones;
}

export function Alert({ tone = "info", className, children, ...props }: AlertProps) {
  const { className: toneClass, icon: Icon } = tones[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex animate-fade-in items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium", toneClass, className)}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
