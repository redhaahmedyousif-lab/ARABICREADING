"use client";

import { useState } from "react";
import { useSignedIn } from "@/context/AppContext";
import { AddLibraryBookForm } from "@/components/library/add-library-book-form";
import { LibraryCatalog } from "@/components/library/library-catalog";
import { PdfFilesSection } from "@/components/library/pdf-files-section";
import { Input, PageHeader } from "@/components/ui";

export default function LibraryPage() {
  const { db, role } = useSignedIn();
  const isTeacher = role === "teacher";
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="الموارد"
        title="المكتبة الرقمية"
        description={
          isTeacher
            ? "أضف الكتب إلى مكتبة التحدي وأدِر قوائم الكتب والمراجع."
            : "تصفّح كتب التحدي وأضفها إلى قائمتك، واطّلع على قوائم الكتب والمراجع."
        }
        actions={
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالعنوان أو المؤلف..."
            aria-label="البحث في المكتبة"
            className="sm:w-72"
          />
        }
      />

      <section aria-labelledby="books-heading" className="space-y-4">
        <h2 id="books-heading" className="text-lg font-bold text-foreground">
          كتب المكتبة <span className="text-sm font-medium text-subtle tabular-nums">({db.library.length})</span>
        </h2>
        {isTeacher ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LibraryCatalog query={query} />
            </div>
            <aside>
              <AddLibraryBookForm />
            </aside>
          </div>
        ) : (
          <LibraryCatalog query={query} />
        )}
      </section>

      <section aria-labelledby="files-heading" className="space-y-4">
        <h2 id="files-heading" className="text-lg font-bold text-foreground">
          ملفات PDF وقوائم الكتب
        </h2>
        <PdfFilesSection query={query} canUpload={isTeacher} />
      </section>
    </div>
  );
}
