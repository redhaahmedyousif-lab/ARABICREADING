"use client";

import Link from "next/link";
import { ArrowLeft, BookOpenCheck, Clock, Flame, GraduationCap, Library, Users } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { HOME_FOR_ROLE } from "@/lib/navigation";
import { dayKey, lastDays, weekdayLabel } from "@/lib/dates";
import { getLeaderboard } from "@/lib/stats";
import type { Role } from "@/types";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { RecentRequestsCard } from "@/components/dashboard/recent-requests-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, PageHeader, StatCard, buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";

const QUICK_LINKS: { href: string; title: string; description: string; icon: typeof Library; tone: string; roles: Role[] }[] = [
  {
    href: "/student/dashboard",
    title: "لوحة الطالب",
    description: "المؤقت، أيام التتابع، الميداليات، وكتبك.",
    icon: BookOpenCheck,
    tone: "bg-primary-soft text-primary-soft-foreground",
    roles: ["student"],
  },
  {
    href: "/teacher/dashboard",
    title: "لوحة المعلم",
    description: "اعتمد المقترحات وأدِر حسابات الطلاب.",
    icon: GraduationCap,
    tone: "bg-success-soft text-success",
    roles: ["teacher"],
  },
  {
    href: "/library",
    title: "المكتبة الرقمية",
    description: "تصفّح قوائم الكتب القصيرة والمراجع بصيغة PDF.",
    icon: Library,
    tone: "bg-info-soft text-info",
    roles: ["teacher", "student"],
  },
];

export default function OverviewPage() {
  const { db, role } = useSignedIn();

  const leaderboard = getLeaderboard(db);
  const totalBooks = leaderboard.reduce((sum, e) => sum + e.stats.completedBooks, 0);
  const topStreak = [...leaderboard].sort((a, b) => b.stats.currentStreak - a.stats.currentStreak)[0];

  const today = dayKey();
  const week = lastDays(7, today).map((day) => ({
    day,
    minutes: db.students.reduce(
      (sum, s) => sum + s.sessions.filter((x) => x.date === day).reduce((m, x) => m + x.minutes, 0),
      0,
    ),
  }));
  const weekMinutes = week.reduce((sum, d) => sum + d.minutes, 0);
  const maxMinutes = Math.max(1, ...week.map((d) => d.minutes));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="مرحباً بعودتك 👋"
        title="نظرة عامة على التحدي"
        description="نشاط الصف هذا الأسبوع، وترتيب القرّاء، وأحدث المقترحات."
        actions={
          <Link href={HOME_FOR_ROLE[role]} className={buttonStyles()}>
            {role === "teacher" ? "لوحة المعلم" : "ابدأ القراءة"}
            <ArrowLeft className="size-4" aria-hidden />
          </Link>
        }
      />

      <section aria-label="إحصاءات" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="الطلاب المشاركون" value={db.students.length} icon={Users} tone="primary" />
        <StatCard label="الكتب المنجزة" value={totalBooks} icon={BookOpenCheck} tone="success" />
        <StatCard label="دقائق القراءة هذا الأسبوع" value={weekMinutes} icon={Clock} tone="info" />
        <StatCard
          label="أطول تتابع حالي"
          value={`${topStreak?.stats.currentStreak ?? 0} يوماً`}
          icon={Flame}
          tone="warning"
          hint={topStreak?.stats.currentStreak ? topStreak.student.name : undefined}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="space-y-1">
              <CardTitle>دقائق القراءة — آخر 7 أيام</CardTitle>
              <CardDescription>مجموع جلسات المؤقت لجميع الطلاب</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="flex h-56 items-end gap-2 sm:gap-4">
              {week.map((d) => (
                <li key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-semibold text-muted tabular-nums">{d.minutes}</span>
                  <div
                    className={cn(
                      "w-full max-w-12 rounded-t-lg transition-colors duration-200",
                      d.day === today ? "bg-primary" : "bg-primary/60 hover:bg-primary/80",
                    )}
                    style={{ height: `${Math.max((d.minutes / maxMinutes) * 100, 2)}%` }}
                    title={`${weekdayLabel(d.day)}: ${d.minutes} دقيقة`}
                  />
                  <span className={cn("text-[11px]", d.day === today ? "font-bold text-foreground" : "text-subtle")}>
                    {weekdayLabel(d.day)}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <RecentRequestsCard />
      </div>

      <Leaderboard limit={5} />

      <section aria-labelledby="quick-links" className="space-y-4">
        <h2 id="quick-links" className="text-lg font-bold text-foreground">
          الوصول السريع
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {QUICK_LINKS.filter((l) => l.roles.includes(role)).map(({ href, title, description, icon: Icon, tone }) => (
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
