"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** Modal built on native <dialog>: focus trapping, Escape and top-layer come for free. */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className={cn(
        "m-auto w-[min(100%-2rem,56rem)] rounded-2xl border border-border bg-surface p-0 text-foreground shadow-elevated backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      {open && (
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="إغلاق">
              <X className="size-5" aria-hidden />
            </Button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
