"use client";

import { useEffect, useState } from "react";
import { BookCheck, BookOpen, CheckCircle2, FileText, Inbox } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Book, BookRequestInput, ReadingStatus } from "@/types";
import { BookCard } from "@/components/student/book-card";
import { SuggestBookForm } from "@/components/student/suggest-book-form";
import { Card, EmptyState, PageHeader, ProgressRing, SegmentedTabs, StatCard, type TabOption } from "@/components/ui";

type Filter = "all" | ReadingStatus;

const INITIAL_BOOKS: Book[] = [
  { id: 1, title: "لاعب الشطرنج", author: "ستيفان زفايغ", pages: 90, category: "رواية قصيرة", status: "completed", addedBy: "system", note: "رواية عميقة تنافس النفس البشرية في العزلة والتركيز.", rating: 5 },
  { id: 2, title: "الإنسان يبحث عن معنى", author: "فيكتور فرانكل", pages: 120, category: "فلسفة وتنمية", status: "reading", addedBy: "system" },
  { id: 3, title: "المعطف", author: "نيكولاي غوغول", pages: 70, category: "أدب عالمي", status: "want_to_read", addedBy: "system" },
];

export default function StudentDashboard() {
  const { addBookRequest } = useApp();
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const updateBook = (id: number, patch: Partial<Book>) =>
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const handleSuggest = (input: BookRequestInput) => {
    setBooks((prev) => [{ ...input, id: Date.now(), status: "want_to_read", addedBy: "student" }, ...prev]);
    addBookRequest(input);
    setToast("تم إرسال المقترح بنجاح إلى لوحة المعلم للاعتماد!");
  };

  const count = (s: ReadingStatus) => books.filter((b) => b.status === s).length;
  const completed = books.filter((b) => b.status === "completed");
  const pagesRead = completed.reduce((sum, b) => sum + b.pages, 0);
  const progress = Math.round((completed.length / (books.length || 1)) * 100);
  const visible = filter === "all" ? books : books.filter((b) => b.status === filter);

  const tabs: TabOption<Filter>[] = [
    { value: "all", label: "الكل", count: books.length },
    { value: "reading", label: "قيد القراءة", count: count("reading") },
    { value: "completed", label: "المنجزة", count: count("completed") },
    { value: "want_to_read", label: "للقائمة", count: count("want_to_read") },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="لوحة الطالب"
        title="مسارك القرائي"
        description="تابع كتبك، سجّل أفكارك واقتباساتك، وأرسل مقترحاتك مباشرة إلى معلمك."
        actions={
          <Card className="flex items-center gap-4 px-4 py-3">
            <ProgressRing value={progress} size={56} label="نسبة الإنجاز" />
            <div>
              <p className="text-xs text-muted">مؤشر التقدم</p>
              <p className="text-sm font-bold text-foreground">
                {completed.length} من {books.length} كتب
              </p>
            </div>
          </Card>
        }
      />

      <section aria-label="إحصاءات" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="الكتب المنجزة" value={completed.length} icon={CheckCircle2} tone="success" />
        <StatCard label="قيد القراءة" value={count("reading")} icon={BookOpen} tone="info" />
        <StatCard label="في القائمة" value={count("want_to_read")} icon={BookCheck} tone="warning" />
        <StatCard label="الصفحات المقروءة" value={pagesRead} icon={FileText} tone="primary" />
      </section>

      <div role="status" aria-live="polite">
        {toast && (
          <p className="animate-fade-in rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-semibold text-success">
            {toast}
          </p>
        )}
      </div>

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
                  onStatusChange={(status) => updateBook(book.id, { status })}
                  onRate={(rating) => updateBook(book.id, { rating })}
                  onSaveNote={(note) => updateBook(book.id, { note: note || undefined })}
                />
              ))}
            </div>
          )}
        </section>

        <aside>
          <SuggestBookForm onSubmit={handleSuggest} />
        </aside>
      </div>
    </div>
  );
}
