"use client";

import { useState } from "react";
import { BookOpen, Plus, SearchX, Trash2 } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { Badge, Button, Card, EmptyState, StarRating } from "@/components/ui";

interface PublicReview {
  studentName: string;
  rating: number;
  summary: string;
}

export function LibraryCatalog({ query }: { query: string }) {
  const { db, role, currentStudent, actions } = useSignedIn();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const books = q
    ? db.library.filter((b) => [b.title, b.author, b.description].some((field) => field.toLowerCase().includes(q)))
    : db.library;
  const onMyList = new Set(currentStudent?.books.map((b) => b.catalogId).filter(Boolean));
  const names = new Map(db.students.map((s) => [s.id, s.name]));

  // Only teacher-approved reviews are public.
  const reviewsByBook = new Map<string, PublicReview[]>();
  for (const student of db.students) {
    for (const book of student.books) {
      if (!book.catalogId || book.review?.status !== "approved") continue;
      const list = reviewsByBook.get(book.catalogId) ?? [];
      list.push({ studentName: student.name, rating: book.review.rating, summary: book.review.summary });
      reviewsByBook.set(book.catalogId, list);
    }
  }

  if (books.length === 0) {
    return q ? (
      <EmptyState icon={SearchX} title="لا توجد نتائج" description="جرّب كلمات بحث مختلفة." />
    ) : (
      <EmptyState icon={BookOpen} title="المكتبة فارغة" description={role === "teacher" ? "أضف أول كتاب من النموذج." : "لم يُضف المعلم كتباً بعد."} />
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {books.map((book) => {
        const added = onMyList.has(book.id);
        const confirming = confirmingId === book.id;
        const reviews = reviewsByBook.get(book.id) ?? [];
        const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        const suggester = book.suggestedBy ? names.get(book.suggestedBy) : undefined;
        return (
          <li key={book.id}>
            <Card className="flex h-full flex-col gap-3 p-5 transition-colors duration-200 hover:border-primary/40">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <BookOpen className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 space-y-1">
                  <h3 className="font-bold text-foreground">{book.title}</h3>
                  <p className="text-xs text-muted">
                    {book.author} • {book.pages} صفحة
                  </p>
                  {suggester && <Badge tone="info">اقترحه {suggester}</Badge>}
                </div>
              </div>
              {book.description && <p className="text-sm leading-relaxed text-muted">{book.description}</p>}

              {reviews.length > 0 && (
                <details className="group rounded-xl bg-surface-muted px-3 py-2 text-sm">
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold text-foreground">
                    <StarRating value={Math.round(average)} readOnly size="sm" label="متوسط التقييم" />
                    <span className="tabular-nums">{average.toFixed(1)}</span>
                    <span className="text-muted">• آراء القرّاء ({reviews.length})</span>
                  </summary>
                  <ul className="mt-2 space-y-2">
                    {reviews.map((r) => (
                      <li key={r.studentName + r.summary} className="space-y-0.5">
                        <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
                          {r.studentName}
                          <StarRating value={r.rating} readOnly size="sm" label="التقييم" />
                        </p>
                        <p className="text-xs leading-relaxed whitespace-pre-line text-muted">{r.summary}</p>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="mt-auto flex items-center justify-end gap-2 pt-1">
                {role === "student" &&
                  (added ? (
                    <Badge tone="success" dot>
                      في قائمتك
                    </Badge>
                  ) : (
                    <Button variant="soft" size="sm" onClick={() => actions.addBookFromLibrary(book.id)}>
                      <Plus className="size-3.5" aria-hidden />
                      أضف إلى قائمتي
                    </Button>
                  ))}

                {role === "teacher" &&
                  (confirming ? (
                    <>
                      <span className="text-xs text-muted">حذف من المكتبة؟</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          actions.deleteLibraryBook(book.id);
                          setConfirmingId(null);
                        }}
                      >
                        تأكيد الحذف
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmingId(null)}>
                        إلغاء
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => setConfirmingId(book.id)} aria-label={`حذف ${book.title}`}>
                      <Trash2 className="size-3.5" aria-hidden />
                      حذف
                    </Button>
                  ))}
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
