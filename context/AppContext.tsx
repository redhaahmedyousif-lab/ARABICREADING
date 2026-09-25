"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { BookRequest, BookRequestInput, RequestStatus } from "@/types";

interface AppContextValue {
  requests: BookRequest[];
  addBookRequest: (input: BookRequestInput) => void;
  updateBookStatus: (id: number, status: RequestStatus) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// Placeholder student until authentication is wired in.
const CURRENT_STUDENT = "الطالب الحالي";

const INITIAL_REQUESTS: BookRequest[] = [
  {
    id: 1,
    title: "عبقرية محمد",
    author: "عباس محمود العقاد",
    pages: 180,
    category: "سيرة",
    studentName: "سارة أحمد",
    status: "pending",
    createdAt: "2026-09-20",
  },
  {
    id: 2,
    title: "الشيخ والبحر",
    author: "إرنست همنغواي",
    pages: 110,
    category: "أدب عالمي",
    studentName: "يوسف علي",
    status: "approved",
    createdAt: "2026-09-18",
  },
];

/**
 * Client-side store for book requests shared between the student and teacher
 * dashboards. Swap the state for server actions / an API when a backend exists;
 * the context shape is the integration seam.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<BookRequest[]>(INITIAL_REQUESTS);

  const addBookRequest = useCallback((input: BookRequestInput) => {
    setRequests((prev) => [
      {
        ...input,
        id: Date.now(),
        studentName: CURRENT_STUDENT,
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  }, []);

  const updateBookStatus = useCallback((id: number, status: RequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const value = useMemo(
    () => ({ requests, addBookRequest, updateBookStatus }),
    [requests, addBookRequest, updateBookStatus],
  );

  return <AppContext value={value}>{children}</AppContext>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
