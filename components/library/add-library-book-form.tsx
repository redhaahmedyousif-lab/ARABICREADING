"use client";

import { useState } from "react";
import { BookPlus } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { MAX_BOOK_PAGES } from "@/lib/store/actions";
import { Alert, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Field, Input, Textarea } from "@/components/ui";

const EMPTY = { title: "", author: "", pages: "", description: "" };

export function AddLibraryBookForm() {
  const { actions } = useSignedIn();
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = actions.addLibraryBook({ ...values, pages: Number(values.pages) });
    if (result.ok) {
      setValues(EMPTY);
      setStatus({ tone: "success", message: `أُضيف «${result.data.title}» إلى المكتبة.` });
    } else {
      setStatus({ tone: "danger", message: result.error });
    }
  };

  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader className="flex-col items-start gap-1">
        <CardTitle className="flex items-center gap-2">
          <BookPlus className="size-5 text-primary" aria-hidden />
          إضافة كتاب جديد
        </CardTitle>
        <CardDescription>يظهر الكتاب فوراً لجميع الطلاب ويمكنهم إضافته إلى قوائمهم.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="عنوان الكتاب">
            {(id) => <Input id={id} required value={values.title} onChange={set("title")} placeholder="مثال: عبقرية محمد" />}
          </Field>
          <Field label="المؤلف">
            {(id) => <Input id={id} required value={values.author} onChange={set("author")} placeholder="مثال: عباس محمود العقاد" />}
          </Field>
          <Field label="عدد الصفحات">
            {(id) => (
              <Input
                id={id}
                required
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_BOOK_PAGES}
                value={values.pages}
                onChange={set("pages")}
                placeholder="120"
              />
            )}
          </Field>
          <Field label="الوصف">
            {(id) => (
              <Textarea id={id} rows={3} value={values.description} onChange={set("description")} placeholder="نبذة قصيرة عن الكتاب..." />
            )}
          </Field>
          {status && <Alert tone={status.tone}>{status.message}</Alert>}
          <Button type="submit" size="lg" className="w-full">
            <BookPlus className="size-4" aria-hidden />
            إضافة إلى المكتبة
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
