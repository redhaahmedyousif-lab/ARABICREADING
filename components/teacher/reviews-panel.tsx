"use client";

import { useState } from "react";
import { Check, MessageSquareQuote, X } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import type { ApprovalStatus } from "@/types";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, SegmentedTabs, StarRating, type TabOption } from "@/components/ui";

const STATUS: Record<ApprovalStatus, { label: string; tone: "warning" | "success" | "danger" }> = {
  pending: { label: "بانتظار المراجعة", tone: "warning" },
  approved: { label: "معتمدة", tone: "success" },
  rejected: { label: "مرفوضة", tone: "danger" },
};

export function ReviewsPanel() {
  const { db, actions } = useSignedIn();
  const [filter, setFilter] = useState<ApprovalStatus>("pending");

  const reviews = db.students.flatMap((student) =>
    student.books.flatMap((book) => (book.review ? [{ student, book, review: book.review }] : [])),
  );
  const count = (s: ApprovalStatus) => reviews.filter((r) => r.review.status === s).length;
  const visible = reviews.filter((r) => r.review.status === filter);

  const tabs: TabOption<ApprovalStatus>[] = [
    { value: "pending", label: "المعلقة", count: count("pending") },
    { value: "approved", label: "المعتمدة", count: count("approved") },
    { value: "rejected", label: "المرفوضة", count: count("rejected") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>مراجعات الطلاب وتقييماتهم</CardTitle>
        <SegmentedTabs label="تصفية المراجعات" options={tabs} value={filter} onChange={setFilter} />
      </CardHeader>
      <CardContent>
        {visible.length === 0 ? (
          <EmptyState icon={MessageSquareQuote} title="لا توجد مراجعات هنا" description="تظهر هنا خلاصات الطلاب للكتب المنجزة." />
        ) : (
          <ul className="divide-y divide-border">
            {visible.map(({ student, book, review }) => (
              <li key={`${student.id}-${book.id}`} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-foreground">{book.title}</h3>
                    <Badge>{student.name}</Badge>
                    <StarRating value={review.rating} readOnly size="sm" label="التقييم" />
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-muted">{review.summary}</p>
                </div>
                {review.status === "pending" ? (
                  <div className="flex shrink-0 gap-2">
                    <Button variant="success" size="sm" onClick={() => actions.decideReview(student.id, book.id, "approved")}>
                      <Check className="size-3.5" aria-hidden />
                      اعتماد ونشر
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => actions.decideReview(student.id, book.id, "rejected")}>
                      <X className="size-3.5" aria-hidden />
                      رفض
                    </Button>
                  </div>
                ) : (
                  <Badge tone={STATUS[review.status].tone} dot className="self-start">
                    {STATUS[review.status].label}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
