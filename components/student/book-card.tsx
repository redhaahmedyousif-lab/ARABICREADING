"use client";

import { useState } from "react";
import { PencilLine, Quote, Star } from "lucide-react";
import type { Book, ReadingStatus } from "@/types";
import { READING_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge, Button, Card, Input, Select } from "@/components/ui";

interface BookCardProps {
  book: Book;
  onStatusChange: (status: ReadingStatus) => void;
  onRate: (rating: number) => void;
  onSaveNote: (note: string) => void;
}

export function BookCard({ book, onStatusChange, onRate, onSaveNote }: BookCardProps) {
  const [editingNote, setEditingNote] = useState(false);
  const [draft, setDraft] = useState(book.note ?? "");

  const saveNote = () => {
    onSaveNote(draft.trim());
    setEditingNote(false);
  };

  return (
    <Card className="group space-y-4 p-5 transition-colors duration-200 hover:border-primary/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-foreground">{book.title}</h3>
            <Badge tone={book.addedBy === "student" ? "warning" : "primary"}>
              {book.addedBy === "student" ? "مضاف شخصياً" : "قائمة رسمية"}
            </Badge>
          </div>
          <p className="text-xs text-muted">
            {book.author} • {book.pages} صفحة • {book.category}
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
        <div className="animate-fade-in space-y-3 rounded-xl border border-border bg-surface-muted p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1" role="radiogroup" aria-label="التقييم">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (book.rating ?? 0) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={book.rating === star}
                    aria-label={`${star} من 5`}
                    onClick={() => onRate(star)}
                    className="cursor-pointer rounded p-0.5 transition-transform duration-150 hover:scale-125"
                  >
                    <Star className={cn("size-4", filled ? "fill-warning text-warning" : "text-border-strong")} aria-hidden />
                  </button>
                );
              })}
            </div>

            {book.note && !editingNote && (
              <Button variant="ghost" size="sm" onClick={() => { setDraft(book.note ?? ""); setEditingNote(true); }}>
                <PencilLine className="size-3.5" aria-hidden />
                تعديل الخلاصة
              </Button>
            )}
          </div>

          {editingNote ? (
            <div className="space-y-2">
              <Input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveNote()}
                placeholder="اكتب خلاصة سريعة أو اقتباساً ملهماً من الكتاب..."
                aria-label="الخلاصة أو الاقتباس"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditingNote(false)}>
                  إلغاء
                </Button>
                <Button size="sm" onClick={saveNote}>
                  حفظ
                </Button>
              </div>
            </div>
          ) : book.note ? (
            <blockquote className="flex gap-2 text-sm leading-relaxed text-foreground">
              <Quote className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {book.note}
            </blockquote>
          ) : (
            <Button variant="soft" size="sm" onClick={() => { setDraft(""); setEditingNote(true); }}>
              إضافة خلاصة أو اقتباس
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
