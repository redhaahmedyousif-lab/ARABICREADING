"use client";

import { useState } from "react";
import { BookOpen, Clock, MessageSquareQuote, Users } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { WeeklyChallengeBanner } from "@/components/dashboard/weekly-challenge-banner";
import { AddLibraryBookForm } from "@/components/library/add-library-book-form";
import { LibraryCatalog } from "@/components/library/library-catalog";
import { ChallengePanel } from "@/components/teacher/challenge-panel";
import { RequestsPanel } from "@/components/teacher/requests-panel";
import { ReviewsPanel } from "@/components/teacher/reviews-panel";
import { StudentsPanel } from "@/components/teacher/students-panel";
import { PageHeader, SegmentedTabs, StatCard, type TabOption } from "@/components/ui";

type Tab = "approvals" | "students" | "books" | "challenge" | "leaderboard";

export default function TeacherDashboard() {
  const { db } = useSignedIn();
  const [tab, setTab] = useState<Tab>("approvals");

  const pendingSuggestions = db.requests.filter((r) => r.status === "pending").length;
  const pendingReviews = db.students.flatMap((s) => s.books).filter((b) => b.review?.status === "pending").length;

  const tabs: TabOption<Tab>[] = [
    { value: "approvals", label: "الموافقات", count: pendingSuggestions + pendingReviews },
    { value: "students", label: "إدارة الطلاب", count: db.students.length },
    { value: "books", label: "إدارة الكتب", count: db.library.length },
    { value: "challenge", label: "التحدي الأسبوعي" },
    { value: "leaderboard", label: "لوحة الصدارة والشهادات" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`مرحباً ${db.teacher.name} 👋`}
        title="إدارة الصف والتحدي"
        description="اعتمد الكتب والمراجعات، وأدِر حسابات الطلاب والمكتبة، وحدّد التحدي الأسبوعي، وامنح شهادات التقدير."
      />

      {tab !== "challenge" && <WeeklyChallengeBanner />}

      <section aria-label="إحصاءات" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="الطلاب" value={db.students.length} icon={Users} tone="primary" />
        <StatCard label="كتب بانتظار الموافقة" value={pendingSuggestions} icon={Clock} tone="warning" />
        <StatCard label="مراجعات بانتظار الموافقة" value={pendingReviews} icon={MessageSquareQuote} tone="info" />
        <StatCard label="كتب المكتبة" value={db.library.length} icon={BookOpen} tone="success" />
      </section>

      <SegmentedTabs label="أقسام لوحة المعلم" options={tabs} value={tab} onChange={setTab} className="w-fit max-w-full" />

      <div role="tabpanel" className="animate-fade-in" key={tab}>
        {tab === "approvals" && (
          <div className="space-y-6">
            <RequestsPanel />
            <ReviewsPanel />
          </div>
        )}
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
        {tab === "challenge" && <ChallengePanel />}
        {tab === "leaderboard" && <Leaderboard withCertificates />}
      </div>
    </div>
  );
}
