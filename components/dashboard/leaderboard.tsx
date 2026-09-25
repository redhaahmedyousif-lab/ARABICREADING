"use client";

import { Crown, Trophy } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { POINTS, getLeaderboard } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

const MEDAL = ["text-amber-400", "text-slate-400", "text-orange-600"];

export function Leaderboard({ limit = 10, className }: { limit?: number; className?: string }) {
  const { ready, db, currentStudent } = useApp();
  if (!ready) return null;

  const entries = getLeaderboard(db);
  const top = entries.slice(0, limit);
  // Always show the signed-in student, even outside the top N.
  const me = currentStudent && !top.some((e) => e.student.id === currentStudent.id) ? entries.find((e) => e.student.id === currentStudent.id) : undefined;
  const rows = me ? [...top, me] : top;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-warning" aria-hidden />
            لوحة الصدارة
          </CardTitle>
          <CardDescription className="text-xs">
            النقاط = الصفحات المنجزة + {POINTS.perApprovedBook} لكل كتاب معتمد + {POINTS.perStreakDay} لكل يوم تتابع
          </CardDescription>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
          <span className="size-2 animate-pulse rounded-full bg-success" aria-hidden />
          مباشر
        </span>
      </CardHeader>
      <CardContent className="px-0 sm:px-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-subtle">
                <th scope="col" className="w-14 px-5 pb-3 text-start font-medium sm:px-6">#</th>
                <th scope="col" className="pb-3 text-start font-medium">الطالب</th>
                <th scope="col" className="hidden px-3 pb-3 text-center font-medium sm:table-cell">الصفحات</th>
                <th scope="col" className="hidden px-3 pb-3 text-center font-medium md:table-cell">كتب معتمدة</th>
                <th scope="col" className="hidden px-3 pb-3 text-center font-medium sm:table-cell">التتابع</th>
                <th scope="col" className="px-5 pb-3 text-end font-medium sm:px-6">النقاط</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ rank, student, stats }) => {
                const isMe = student.id === currentStudent?.id;
                return (
                  <tr
                    key={student.id}
                    aria-current={isMe ? "true" : undefined}
                    className={cn(
                      "border-b border-border transition-colors last:border-0",
                      isMe ? "bg-primary-soft/60" : "hover:bg-surface-hover/60",
                    )}
                  >
                    <td className="px-5 py-3 sm:px-6">
                      {rank <= 3 ? (
                        <Crown className={cn("size-5", MEDAL[rank - 1])} aria-label={`المركز ${rank}`} />
                      ) : (
                        <span className="font-semibold text-muted tabular-nums">{rank}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-muted text-xs font-bold text-foreground">
                          {student.name.charAt(0)}
                        </span>
                        <span className="font-semibold text-foreground">
                          {student.name}
                          {isMe && <span className="ms-1.5 text-xs font-medium text-primary">(أنت)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-3 py-3 text-center text-muted tabular-nums sm:table-cell">{stats.pagesRead}</td>
                    <td className="hidden px-3 py-3 text-center text-muted tabular-nums md:table-cell">{stats.approvedBooks}</td>
                    <td className="hidden px-3 py-3 text-center text-muted tabular-nums sm:table-cell">🔥 {stats.currentStreak}</td>
                    <td className="px-5 py-3 text-end font-extrabold text-foreground tabular-nums sm:px-6">{stats.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
