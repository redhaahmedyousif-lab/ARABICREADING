import { useId } from "react";
import { cn } from "@/lib/utils";

const controlStyles = cn(
  "w-full rounded-xl border border-border bg-surface-muted px-3.5 py-2.5 text-sm text-foreground",
  "placeholder:text-subtle transition-colors duration-200",
  "hover:border-border-strong focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/30",
);

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(controlStyles, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(controlStyles, "min-h-24 resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(controlStyles, "h-11 cursor-pointer", className)} {...props} />;
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("block text-xs font-semibold text-foreground", className)} {...props} />;
}

interface FieldProps {
  label: string;
  hint?: string;
  className?: string;
  /** Render prop receives the generated id so label and control stay linked. */
  children: (id: string) => React.ReactNode;
}

/** Label + control + optional hint, with accessible id wiring. */
export function Field({ label, hint, className, children }: FieldProps) {
  const id = useId();
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
      {hint && <p className="text-xs text-subtle">{hint}</p>}
    </div>
  );
}
