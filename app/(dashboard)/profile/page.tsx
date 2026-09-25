"use client";

import { ShieldCheck } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader } from "@/components/ui";

export default function ProfilePage() {
  const { db, role, currentStudent } = useSignedIn();

  const details =
    role === "student" && currentStudent
      ? [
          { label: "الاسم", value: currentStudent.name },
          { label: "اسم المستخدم", value: currentStudent.username, ltr: true },
          { label: "تاريخ إنشاء الحساب", value: currentStudent.createdAt, ltr: true },
        ]
      : [
          { label: "الاسم", value: db.teacher.name },
          { label: "نوع الحساب", value: "معلم مشرف — صلاحيات كاملة" },
        ];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="الإعدادات" title="الملف الشخصي" description="بيانات حسابك وإعدادات الأمان." />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              {details.map(({ label, value, ltr }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd dir={ltr ? "ltr" : undefined} className="text-sm font-semibold text-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-col items-start gap-1">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" aria-hidden />
              {role === "teacher" ? "تغيير كلمة المرور الرئيسية" : "تغيير كلمة المرور"}
            </CardTitle>
            <CardDescription>
              {role === "teacher"
                ? "تُستخدم كلمة المرور الرئيسية للدخول إلى بوابة المعلم."
                : "إذا نسيت كلمة المرور، اطلب من معلمك إعادة تعيينها."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
