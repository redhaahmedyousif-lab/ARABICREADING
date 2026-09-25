"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { BookRequestInput } from "@/types";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Field, Input, Textarea } from "@/components/ui";

const EMPTY = { title: "", author: "", pages: "", category: "", description: "" };

export function SuggestBookForm({ onSubmit }: { onSubmit: (input: BookRequestInput) => void }) {
  const [values, setValues] = useState(EMPTY);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = values.title.trim();
    const author = values.author.trim();
    if (!title || !author) return;

    onSubmit({
      title,
      author,
      pages: Number(values.pages) || 100,
      category: values.category.trim() || "عام",
      description: values.description.trim(),
    });
    setValues(EMPTY);
  };

  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader className="flex-col items-start gap-1">
        <CardTitle>اقتراح كتاب جديد</CardTitle>
        <CardDescription>يبقى الكتاب بانتظار موافقة المعلم، ويُضاف إلى المكتبة للجميع بعد اعتماده.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="عنوان الكتاب">
            {(id) => <Input id={id} required value={values.title} onChange={set("title")} placeholder="مثال: عبقرية محمد" />}
          </Field>
          <Field label="المؤلف">
            {(id) => <Input id={id} required value={values.author} onChange={set("author")} placeholder="مثال: عباس محمود العقاد" />}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="الصفحات">
              {(id) => (
                <Input id={id} type="number" min={1} inputMode="numeric" value={values.pages} onChange={set("pages")} placeholder="120" />
              )}
            </Field>
            <Field label="التصنيف">
              {(id) => <Input id={id} value={values.category} onChange={set("category")} placeholder="رواية / تاريخ" />}
            </Field>
          </div>
          <Field label="نبذة عن الكتاب (اختياري)">
            {(id) => (
              <Textarea id={id} rows={2} value={values.description} onChange={set("description")} placeholder="لماذا تقترح هذا الكتاب؟" />
            )}
          </Field>
          <Button type="submit" size="lg" className="w-full">
            <Send className="size-4 rtl:-scale-x-100" aria-hidden />
            إرسال الطلب للمعلم
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
