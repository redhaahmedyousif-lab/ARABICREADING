"use client";

import { useState } from "react";
import { PencilLine, Quote } from "lucide-react";
import type { ActionResult, Book, ReadingStatus, RequestStatus } from "@/types";
import { READING_STATUS, REQUEST_STATUS } from "@/lib/constants";
import { REVIEW_MAX_CHARS, REVIEW_MAX_LINES } from "@/lib/store/actions";
import { LIBRARY_CATEGORY } from "@/lib/store/seed";
import { Alert, Badge, Button, Card, Select, StarRating, Textarea } from "@/components/ui";

const REVIEW_STATUS = {
  pending: { label: "بانتظار موافقة المعلم", tone: "warning" },
  approved: { label: "معتمدة ومنشورة", tone: "success" },
  rejected: { label: "لم تُعتمد — عدّلها وأعد الإرسال", tone: "danger" },
} as const;

interface BookCardProps {
  book: Book;
  /** Approval state when the student suggested this book. */
  requestStatus?: RequestStatus;
  onStatusChange: (status: ReadingStatus) => void;
  onSubmitReview: (rating: number, summary: string) => ActionResult;
}

function ReviewSection({ book, onSubmitReview }: Pick<BookCardProps, "book" | "onSubmitReview">) {
  const { review } = book;
  const [editing, setEditing] = useState(!review);
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [summary, setSummary] = useState(review?.summary ?? "");
  const [error, setError] = useState("");

  const lines = summary.split("\n").length;

  const submit = () => {
    const result = onSubmitReview(rating, summary);
    if (result.ok) {
      setEditing(false);
      setError("");
    } else {
      setError(result.error);
    }
  };

  if (!editing && review) {
    const status = REVIEW_STATUS[review.status];
    return (
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <StarRating value={review.rating} readOnly size="sm" label="تقييمي" />
            <Badge tone={status.tone} dot>
              {status.label}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <PencilLine className="size-3.5" aria-hidden />
            تعديل المراجعة
          </Button>
        </div>
        {review.summary && (
          <blockquote className="flex gap-2 text-sm leading-relaxed whitespace-pre-line text-foreground">
            <Quote className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            {review.summary}
          </blockquote>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">قيّم الكتاب واكتب خلاصتك</span>
        <StarRating value={rating} onChange={setRating} label="التقييم" />
      </div>
      <Textarea
        rows={REVIEW_MAX_LINES}
        maxLength={REVIEW_MAX_CHARS}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="خلاصة في 3 أسطر كحد أقصى: ما فكرة الكتاب؟ وماذا تعلّمت منه؟"
        aria-label="خلاصة الكتاب"
        className="min-h-0"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-[11px] tabular-nums ${lines > REVIEW_MAX_LINES ? "text-danger" : "text-subtle"}`}>
          {lines} من {REVIEW_MAX_LINES} أسطر • {summary.length} من {REVIEW_MAX_CHARS} حرف • تُنشر بعد موافقة المعلم
        </span>
        <div className="flex gap-2">
          {review && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              إلغاء
            </Button>
          )}
          <Button size="sm" onClick={submit}>
            إرسال للمراجعة
          </Button>
        </div>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
    </div>
  );
}

export function BookCard({ book, requestStatus, onStatusChange, onSubmitReview }: BookCardProps) {
  return (
    <Card className="group space-y-4 p-5 transition-colors duration-200 hover:border-primary/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-foreground">{book.title}</h3>
            {requestStatus ? (
              <Badge tone={REQUEST_STATUS[requestStatus].tone} dot>
                مقترح • {REQUEST_STATUS[requestStatus].label}
              </Badge>
            ) : (
              <Badge tone="primary">من المكتبة</Badge>
            )}
          </div>
          <p className="text-xs text-muted">
            {book.author} • {book.pages} صفحة
            {book.category !== LIBRARY_CATEGORY && ` • ${book.category}`}
          </p>
        </div>

        <Select
          aria-label={`حالة قراءة ${book.title}`}
          value={book.status}
          onChange={(e) => onStatusChange(e.target.value as ReadingStatus)}
          className="h-9 w-full py-1.5 text-xs font-semibold sm:w-40"
        >
          {Object.entries(READING_STATUS).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {book.status === "completed" && (
        <div className="animate-fade-in rounded-xl border border-border bg-surface-muted p-4">
          <ReviewSection key={book.review?.submittedAt ?? "new"} book={book} onSubmitReview={onSubmitReview} />
        </div>
      )}
    </Card>
  );
}
