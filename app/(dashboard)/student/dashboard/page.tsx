"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, FileText, Flame, Inbox, Star } from "lucide-react";
import { useStudent } from "@/context/AppContext";
import { getLeaderboard, getStudentStats } from "@/lib/stats";
import type { BookRequestInput, ReadingStatus } from "@/types";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { AchievementsCard } from "@/components/student/achievements-card";
import { BookCard } from "@/components/student/book-card";
import { ReadingTimer } from "@/components/student/reading-timer";
import { StreakCard } from "@/components/student/streak-card";
import { SuggestBookForm } from "@/components/student/suggest-book-form";
import { Alert, Card, EmptyState, PageHeader, ProgressRing, SegmentedTabs, StatCard, type TabOption } from "@/components/ui";

type Filter = "all" | ReadingStatus;

export default function StudentDashboard() {
  const { db, student, actions } = useStudent();
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const stats = getStudentStats(student, db.requests);
  const rank = getLeaderboard(db).find((e) => e.student.id === student.id)?.rank;
  const requestStatus = new Map(db.requests.map((r) => [r.id, r.status]));

  const { books } = student;
  const count = (s: ReadingStatus) => books.filter((b) => b.status === s).length;
  const progress = Math.round((stats.completedBooks / (books.length || 1)) * 100);
  const visible = filter === "all" ? books : books.filter((b) => b.status === filter);

  const tabs: TabOption<Filter>[] = [
    { value: "all", label: "الكل", count: books.length },
    { value: "reading", label: "قيد القراءة", count: count("reading") },
    { value: "completed", label: "المنجزة", count: count("completed") },
    { value: "want_to_read", label: "للقائمة", count: count("want_to_read") },
  ];

  const handleSuggest = (input: BookRequestInput) => {
    actions.addBookRequest(input);
    setToast("تم إرسال المقترح بنجاح إلى لوحة المعلم للاعتماد!");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`مرحباً ${student.name} 👋`}
        title="مسارك القرائي"
        description="اقرأ بالمؤقت، حافظ على أيام التتابع، واجمع الميداليات لتتصدّر لوحة الصدارة."
        actions={
          <Card className="flex items-center gap-4 px-4 py-3">
            <ProgressRing value={progress} size={56} label="نسبة إنجاز الكتب" />
            <div>
              <p className="text-xs text-muted">الكتب المنجزة</p>
              <p className="text-sm font-bold text-foreground">
                {stats.completedBooks} من {books.length} كتب
              </p>
            </div>
          </Card>
        }
      />

      <section aria-label="إحصاءات" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="أيام التتابع" value={stats.currentStreak} icon={Flame} tone="warning" hint={`الأطول: ${stats.longestStreak}`} />
        <StatCard label="الكتب المنجزة" value={stats.completedBooks} icon={BookOpenCheck} tone="success" />
        <StatCard label="الصفحات المقروءة" value={stats.pagesRead} icon={FileText} tone="info" />
        <StatCard label="النقاط" value={stats.points} icon={Star} tone="primary" hint={rank ? `المركز ${rank} من ${db.students.length}` : undefined} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReadingTimer studentId={student.id} minutesToday={stats.minutesToday} onSave={actions.logReadingSession} />
        </div>
        <StreakCard sessions={student.sessions} currentStreak={stats.currentStreak} longestStreak={stats.longestStreak} />
      </div>

      <AchievementsCard stats={stats} />

      {toast && <Alert tone="success">{toast}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="books-heading" className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="books-heading" className="text-lg font-bold text-foreground">
              كتبي
            </h2>
            <SegmentedTabs label="تصفية الكتب" options={tabs} value={filter} onChange={setFilter} />
          </div>

          {visible.length === 0 ? (
            <EmptyState icon={Inbox} title="لا توجد كتب هنا" description="لا توجد كتب ضمن هذا التصنيف حالياً." />
          ) : (
            <div className="space-y-3">
              {visible.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  requestStatus={book.requestId ? requestStatus.get(book.requestId) : undefined}
                  onStatusChange={(status) => actions.updateBook(book.id, { status })}
                  onRate={(rating) => actions.updateBook(book.id, { rating })}
                  onSaveNote={(note) => actions.updateBook(book.id, { note: note || undefined })}
                />
              ))}
            </div>
          )}
        </section>

        <aside>
          <SuggestBookForm onSubmit={handleSuggest} />
        </aside>
      </div>

      <Leaderboard />
    </div>
  );
}
