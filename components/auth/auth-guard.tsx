"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { HOME_FOR_ROLE, canAccess } from "@/lib/navigation";

/**
 * Client-side route protection for the mock auth. Redirects signed-out users
 * to /login (remembering where they were going) and users without the right
 * role to their own home. Real auth should also enforce this on the server.
 */
export function AuthGuard({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) {
  const { ready, role } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  // Distinguishes "just signed out" (plain /login) from "never signed in" (/login?next=…).
  const wasSignedIn = useRef(false);

  const allowed = ready && role !== null && canAccess(pathname, role);

  useEffect(() => {
    if (!ready) return;
    if (role) {
      wasSignedIn.current = true;
      if (!canAccess(pathname, role)) router.replace(HOME_FOR_ROLE[role]);
      return;
    }
    const withNext = !wasSignedIn.current && pathname !== "/";
    router.replace(withNext ? `/login?next=${encodeURIComponent(pathname)}` : "/login");
  }, [ready, role, pathname, router]);

  return allowed ? children : fallback;
}
