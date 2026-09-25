"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Users, XCircle } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import type { RequestStatus } from "@/types";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { AddLibraryBookForm } from "@/components/library/add-library-book-form";
import { LibraryCatalog } from "@/components/library/library-catalog";
import { RequestsPanel } from "@/components/teacher/requests-panel";
import { StudentsPanel } from "@/components/teacher/students-panel";
import { PageHeader, SegmentedTabs, StatCard, type TabOption } from "@/components/ui";

type Tab = "requests" | "students" | "books" | "leaderboard";

export default function TeacherDashboard() {
  const { db } = useSignedIn();
  const [tab, setTab] = useState<Tab>("requests");

  const count = (s: RequestStatus) => db.requests.filter((r) => r.status === s).length;

  const tabs: TabOption<Tab>[] = [
    { value: "requests", label: "طلبات الكتب", count: count("pending") },
    { value: "students", label: "إدارة الطلاب", count: db.students.length },
    { value: "books", label: "إدارة الكتب", count: db.library.length },
    { value: "leaderboard", label: "لوحة الصدارة" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`مرحباً ${db.teacher.name} 👋`}
        title="إدارة الصف والتحدي"
        description="اعتمد مقترحات الطلاب، وأضف الحسابات أو احذفها، وأعد تعيين كلمات المرور، وتابع الترتيب."
      />

      <section aria-label="إحصاءات" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="الطلاب" value={db.students.length} icon={Users} tone="primary" />
        <StatCard label="بانتظار المراجعة" value={count("pending")} icon={Clock} tone="warning" />
        <StatCard label="الكتب المعتمدة" value={count("approved")} icon={CheckCircle2} tone="success" />
        <StatCard label="المرفوضة" value={count("rejected")} icon={XCircle} tone="danger" />
      </section>

      <SegmentedTabs label="أقسام لوحة المعلم" options={tabs} value={tab} onChange={setTab} className="w-fit max-w-full" />

      <div role="tabpanel" className="animate-fade-in" key={tab}>
        {tab === "requests" && <RequestsPanel />}
        {tab === "students" && <StudentsPanel />}
        {tab === "books" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LibraryCatalog query="" />
            </div>
            <aside>
              <AddLibraryBookForm />
            </aside>
          </div>
        )}
        {tab === "leaderboard" && <Leaderboard />}
      </div>
    </div>
  );
}
