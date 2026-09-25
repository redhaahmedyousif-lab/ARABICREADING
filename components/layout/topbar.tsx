"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { NAV_ITEMS, isActivePath } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

interface TopbarProps {
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

export function Topbar({ sidebarOpen, onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const current = NAV_ITEMS.find((item) => isActivePath(pathname, item.href));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
        aria-label="فتح القائمة"
        aria-controls="app-sidebar"
        aria-expanded={sidebarOpen}
      >
        <Menu className="size-5" aria-hidden />
      </Button>

      <p className="truncate text-sm font-bold text-foreground">{current?.label ?? "تحدي القراءة"}</p>

      <div className="ms-auto flex items-center gap-1 sm:gap-2">
        <label className="relative hidden md:block">
          <span className="sr-only">بحث</span>
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden />
          <input
            type="search"
            placeholder="ابحث عن كتاب أو طالب..."
            className="h-10 w-64 rounded-xl border border-border bg-surface-muted ps-9 pe-3 text-sm text-foreground placeholder:text-subtle transition-colors focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/30 lg:w-80"
          />
        </label>

        <Button variant="ghost" size="icon" aria-label="الإشعارات" className="relative">
          <Bell className="size-5" aria-hidden />
          <span className="absolute top-2.5 end-2.5 size-2 rounded-full bg-danger ring-2 ring-background" />
        </Button>

        <ThemeToggle />

        <div className="ms-1 grid size-9 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-xs font-bold text-white">
          RJ
        </div>
      </div>
    </header>
  );
}
