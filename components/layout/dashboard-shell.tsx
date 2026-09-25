"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { PageSkeleton } from "./page-skeleton";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // While the mobile drawer is open: close on Escape and lock background scroll.
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        تخطَّ إلى المحتوى
      </a>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-dvh flex-col lg:ps-72">
        <Topbar sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(true)} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <AuthGuard fallback={<PageSkeleton />}>{children}</AuthGuard>
          </div>
        </main>
        <footer className="border-t border-border px-4 py-5 text-xs text-subtle sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
            <p>© 2026 منصة تحدي القراءة • RJ Works</p>
            <p>الإصدار 3.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
