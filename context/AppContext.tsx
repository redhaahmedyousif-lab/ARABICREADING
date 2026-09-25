"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { Database, Role, Session, Student } from "@/types";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/store/db";
import * as actions from "@/lib/store/actions";

type LoadedState = {
  ready: true;
  db: Database;
  session: Session | null;
  role: Role | null;
  /** The signed-in student, or null for teachers / signed-out users. */
  currentStudent: Student | null;
};

type AppContextValue = (LoadedState | { ready: false; db: null; session: null; role: null; currentStudent: null }) & {
  actions: typeof actions;
};

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Exposes the persisted store (accounts, books, sessions, requests) and the
 * current auth session. `ready` is false during SSR and until localStorage has
 * been read — render a placeholder until then.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<AppContextValue>(() => {
    if (!state) return { ready: false, db: null, session: null, role: null, currentStudent: null, actions };
    const { db, session } = state;
    const currentStudent = session?.role === "student" ? (db.students.find((s) => s.id === session.studentId) ?? null) : null;
    return { ready: true, db, session, role: session?.role ?? null, currentStudent, actions };
  }, [state]);

  return <AppContext value={value}>{children}</AppContext>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}

/**
 * For components rendered inside <AuthGuard>, where data is loaded and a user
 * is signed in. Narrows the types so pages don't repeat null checks.
 */
export function useSignedIn() {
  const ctx = useApp();
  if (!ctx.ready || !ctx.session) throw new Error("useSignedIn must be used inside <AuthGuard>");
  return ctx as AppContextValue & LoadedState & { session: Session; role: Role };
}

/** For student-only pages (guarded by role). */
export function useStudent() {
  const ctx = useSignedIn();
  if (!ctx.currentStudent) throw new Error("useStudent must be used on a student route");
  return { ...ctx, student: ctx.currentStudent };
}
