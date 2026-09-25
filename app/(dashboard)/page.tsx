import Link from "next/link";
import { ArrowLeft, BookOpenCheck, Flame, GraduationCap, Library, Target, Users } from "lucide-react";
import { RecentRequestsCard } from "@/components/dashboard/recent-requests-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, StatCard, buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  {
    href: "/student/dashboard",
    title: "لوحة الطالب",
    description: "تابع كتبك، حدّث حالة القراءة، وأرسل مقترحاتك للمعلم.",
    icon: BookOpenCheck,
    tone: "bg-primary-soft text-primary-soft-foreground",
  },
  {
    href: "/teacher/dashboard",
    title: "لوحة المعلم",
    description: "راقب تقدم الطلاب واعتمد الكتب المقترحة بسهولة.",
    icon: GraduationCap,
    tone: "bg-success-soft text-success",
  },
  {
    href: "/library",
    title: "المكتبة الرقمية",
    description: "تصفّح قوائم الكتب القصيرة والمراجع بصيغة PDF.",
    icon: Library,
    tone: "bg-info-soft text-info",
  },
];

const WEEKLY_PAGES = [
  { day: "السبت", pages: 42 },
  { day: "الأحد", pages: 65 },
  { day: "الإثنين", pages: 30 },
  { day: "الثلاثاء", pages: 80 },
  { day: "الأربعاء", pages: 55 },
  { day: "الخميس", pages: 96 },
  { day: "الجمعة", pages: 24 },
];

export default function OverviewPage() {
  const maxPages = Math.max(...WEEKLY_PAGES.map((d) => d.pages));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="مرحباً بعودتك 👋"
        title="نظرة عامة على التحدي"
        description="ملخص سريع لنشاط القراءة، والمقترحات الأخيرة، والوصول المباشر إلى أقسام المنصة."
        actions={
          <Link href="/student/dashboard" className={buttonStyles()}>
            ابدأ القراءة
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
        }
      />

      <section aria-label="إحصاءات" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="الطلاب المشاركون" value="128" icon={Users} tone="primary" hint="+12 هذا الشهر" />
        <StatCard label="الكتب المنجزة" value="342" icon={BookOpenCheck} tone="success" hint="+38 هذا الأسبوع" />
        <StatCard label="متوسط الإنجاز" value="67%" icon={Target} tone="info" hint="من هدف الفصل" />
        <StatCard label="أطول سلسلة قراءة" value="21 يوماً" icon={Flame} tone="warning" hint="سارة أحمد" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="space-y-1">
              <CardTitle>الصفحات المقروءة هذا الأسبوع</CardTitle>
              <CardDescription>إجمالي {WEEKLY_PAGES.reduce((a, d) => a + d.pages, 0)} صفحة</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="flex h-56 items-end gap-2 sm:gap-4">
              {WEEKLY_PAGES.map((d) => (
                <li key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-semibold text-muted tabular-nums">{d.pages}</span>
                  <div
                    className="w-full max-w-12 rounded-t-lg bg-primary/85 transition-colors duration-200 hover:bg-primary"
                    style={{ height: `${(d.pages / maxPages) * 100}%` }}
                    title={`${d.day}: ${d.pages} صفحة`}
                  />
                  <span className="text-[11px] text-subtle">{d.day}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <RecentRequestsCard />
      </div>

      <section aria-labelledby="quick-links" className="space-y-4">
        <h2 id="quick-links" className="text-lg font-bold text-foreground">
          الوصول السريع
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {QUICK_LINKS.map(({ href, title, description, icon: Icon, tone }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
            >
              <span className={cn("mb-4 grid size-11 place-items-center rounded-xl", tone)}>
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                انتقل
                <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
