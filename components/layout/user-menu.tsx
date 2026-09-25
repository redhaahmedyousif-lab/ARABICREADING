"use client";

import { LogOut } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { ready, role, currentStudent, actions } = useApp();
  if (!ready || !role) return null;

  const name = role === "teacher" ? "المعلم المشرف" : (currentStudent?.name ?? "");
  const initials = role === "teacher" ? "م" : name.trim().charAt(0);


  // AuthGuard sends the user to /login once the session is cleared.
  return (
    <div className="ms-1 flex items-center gap-2">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-bold text-white">
          {initials}
        </span>
        <span className="hidden leading-tight sm:block">
          <span className="block text-sm font-semibold text-foreground">{name}</span>
          <span className="block text-[11px] text-subtle">{role === "teacher" ? "معلم" : "طالب"}</span>
        </span>
      </div>
      <Button variant="ghost" size="icon" onClick={actions.logout} aria-label="تسجيل الخروج" title="تسجيل الخروج">
        <LogOut className="size-5 rtl:-scale-x-100" aria-hidden />
      </Button>
    </div>
  );
}
