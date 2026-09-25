"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Inbox, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { navForRole, isActivePath } from "@/lib/navigation";
import { currentStreak } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Fixed on lg+, off-canvas drawer below. Uses logical properties (start/end)
 * so it sits on the right in RTL and on the left in LTR without changes.
 */
export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useApp();
  const sections = role ? navForRole(role) : [];

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        id="app-sidebar"
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-72 flex-col border-e border-border bg-surface",
          "transition-transform duration-300 ease-out",
          !open && "max-lg:ltr:-translate-x-full max-lg:rtl:translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo onClick={onClose} />
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden" aria-label="إغلاق القائمة">
            <X className="size-5" aria-hidden />
          </Button>
        </div>

        <nav aria-label="التنقل الرئيسي" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 pb-1 text-[11px] font-semibold tracking-wide text-subtle">{section.title}</p>
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = isActivePath(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200",
                      active
                        ? "bg-primary-soft text-primary-soft-foreground"
                        : "text-muted hover:bg-surface-hover hover:text-foreground",
                    )}
                  >
                    {active && (
                      <span aria-hidden className="absolute inset-y-2 start-0 w-1 rounded-e-full bg-primary" />
                    )}
                    <Icon
                      className={cn("size-5 transition-colors", active ? "text-primary" : "text-subtle group-hover:text-foreground")}
                      aria-hidden
                    />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <SidebarCard />
      </aside>
    </>
  );
}

function SidebarCard() {
  const { ready, db, currentStudent, role } = useApp();
  if (!ready || !role) return null;

  const [Icon, title, body] =
    role === "student" && currentStudent
      ? [Flame, `${currentStreak(currentStudent.sessions)} أيام تتابع`, "اقرأ اليوم لتحافظ على سلسلتك."]
      : [Inbox, `${db.requests.filter((r) => r.status === "pending").length} طلبات معلقة`, "مقترحات الطلاب بانتظار مراجعتك."];

  return (
    <div className="m-3 flex items-start gap-3 rounded-2xl border border-border bg-surface-muted p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning-soft text-warning">
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}
