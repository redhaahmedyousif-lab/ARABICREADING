"use client";

import { useState } from "react";
import { Download, FileText, SearchX, Upload } from "lucide-react";
import type { LibraryFile } from "@/types";
import { useSignedIn } from "@/context/AppContext";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Textarea,
} from "@/components/ui";

const INITIAL_FILES: LibraryFile[] = [
  { id: 1, title: "قائمة الكتب القصيرة - النسخة الأولى (30 كتاباً)", description: "مختارات من الأدب العالمي والعربي بأقل من 130 صفحة مناسبة لمرحلة MYP.", size: "2.4 MB", uploadedBy: "المعلم", date: "2026-09-15" },
  { id: 2, title: "قائمة الكتب القصيرة - النسخة الثانية (30 كتاباً)", description: "مجموعة إضافية من الروايات القصيرة والكتب الفكرية والتاريخية.", size: "1.8 MB", uploadedBy: "المعلم", date: "2026-09-16" },
  { id: 3, title: "قائمة الكتب القصيرة - النسخة الثالثة (30 كتاباً)", description: "كتب في السير الذاتية، الآداب العالمية، ورسائل الفلاسفة والأدباء.", size: "2.1 MB", uploadedBy: "المعلم", date: "2026-09-17" },
  { id: 4, title: "قائمة الكتب القصيرة - النسخة الرابعة (30 كتاباً)", description: "أحدث المختارات من المسرحيات، الدواوين الشعرية، وكتب الفكر والمنطق.", size: "2.0 MB", uploadedBy: "المعلم", date: "2026-09-18" },
];

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function LibraryPage() {
  const { role } = useSignedIn();
  const canUpload = role === "teacher";
  const [files, setFiles] = useState<LibraryFile[]>(INITIAL_FILES);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);

  const q = query.trim().toLowerCase();
  const results = q
    ? files.filter((f) => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
    : files;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // TODO: upload `file` to storage; only metadata is kept client-side for now.
    setFiles((prev) => [
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim() || "ملف مرجعي للمجموعة",
        size: file ? formatSize(file.size) : "—",
        uploadedBy: "المعلم",
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setTitle("");
    setDescription("");
    setFile(null);
    setFormKey((k) => k + 1); // resets the uncontrolled file input
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="الموارد"
        title="المكتبة الرقمية"
        description="استعرض وحمّل قوائم الكتب المقترحة والمراجع والملفات التعليمية الخاصة بالتحدي."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="files-heading" className={canUpload ? "space-y-4 lg:col-span-2" : "space-y-4 lg:col-span-3"}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="files-heading" className="text-lg font-bold text-foreground">
              الملفات المتاحة <span className="text-sm font-medium text-subtle tabular-nums">({results.length})</span>
            </h2>
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو الوصف..."
              aria-label="البحث في الملفات"
              className="sm:w-72"
            />
          </div>

          {results.length === 0 ? (
            <EmptyState icon={SearchX} title="لا توجد نتائج" description="جرّب كلمات بحث مختلفة." />
          ) : (
            <ul className="space-y-3">
              {results.map((f) => (
                <li key={f.id}>
                  <Card className="flex flex-col gap-4 p-5 transition-colors duration-200 hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-danger-soft text-danger">
                        <FileText className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground">{f.title}</h3>
                        <p className="mt-1 text-sm text-muted">{f.description}</p>
                        <p className="mt-2 text-xs text-subtle">
                          {f.size} • {f.uploadedBy} • {f.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" disabled title="التحميل متاح بعد ربط التخزين">
                      <Download className="size-3.5" aria-hidden />
                      تحميل
                    </Button>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        {canUpload && (
          <aside>
            <Card className="lg:sticky lg:top-24">
              <CardHeader className="flex-col items-start gap-1">
                <CardTitle>إضافة ملف PDF</CardTitle>
                <CardDescription>أضف قائمة كتب أو مرجعاً جديداً إلى المكتبة.</CardDescription>
              </CardHeader>
              <CardContent>
                <form key={formKey} onSubmit={handleUpload} className="space-y-4">
                  <Field label="عنوان الملف">
                    {(id) => <Input id={id} required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: ملخصات كتاب..." />}
                  </Field>
                  <Field label="وصف مختصر">
                    {(id) => (
                      <Textarea id={id} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="نبذة عن محتوى الملف..." />
                  )}
                </Field>
                <Field label="ملف PDF">
                  {(id) => (
                    <input
                      id={id}
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="w-full cursor-pointer text-xs text-muted file:me-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:text-xs file:font-semibold file:text-primary-soft-foreground"
                    />
                  )}
                </Field>
                <Button type="submit" size="lg" className="w-full">
                  <Upload className="size-4" aria-hidden />
                  رفع وإضافة للمكتبة
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
        )}
      </div>
    </div>
  );
}
