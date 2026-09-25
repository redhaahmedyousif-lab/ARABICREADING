import { Check, Flame } from "lucide-react";
import type { ReadingSession } from "@/types";
import { dayKey, lastDays, weekdayLabel } from "@/lib/dates";
import { minutesByDay } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface StreakCardProps {
  sessions: ReadingSession[];
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ sessions, currentStreak, longestStreak }: StreakCardProps) {
  const today = dayKey();
  const byDay = minutesByDay(sessions);
  const readToday = byDay.has(today);

  return (
    <Card>
      <CardHeader>
        <CardTitle>أيام التتابع</CardTitle>
        <span className="text-xs text-muted">الأطول: {longestStreak} يوماً</span>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "grid size-16 place-items-center rounded-2xl transition-colors",
              currentStreak > 0 ? "bg-warning-soft text-warning" : "bg-surface-muted text-subtle",
            )}
          >
            <Flame className={cn("size-8", currentStreak > 0 && "fill-current")} aria-hidden />
          </span>
          <div>
            <p className="text-3xl font-extrabold text-foreground tabular-nums">
              {currentStreak} <span className="text-base font-semibold text-muted">يوم</span>
            </p>
            <p className="text-xs text-muted">
              {readToday ? "أحسنت! سجّلت قراءة اليوم." : currentStreak > 0 ? "اقرأ اليوم لتحافظ على سلسلتك." : "ابدأ سلسلة جديدة اليوم."}
            </p>
          </div>
        </div>

        <ol className="grid grid-cols-7 gap-1.5">
          {lastDays(7, today).map((day) => {
            const minutes = byDay.get(day);
            const isToday = day === today;
            return (
              <li key={day} className="flex flex-col items-center gap-1.5">
                <span
                  title={minutes ? `${minutes} دقيقة` : "لا قراءة"}
                  className={cn(
                    "grid size-8 place-items-center rounded-full text-[10px] font-bold transition-colors",
                    minutes ? "bg-warning text-white dark:text-slate-900" : "bg-surface-muted text-subtle",
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-surface",
                  )}
                >
                  {minutes ? <Check className="size-4" aria-hidden /> : null}
                  <span className="sr-only">{minutes ? `قرأت ${minutes} دقيقة` : "لا قراءة"}</span>
                </span>
                <span className={cn("text-[10px]", isToday ? "font-bold text-foreground" : "text-subtle")}>{weekdayLabel(day)}</span>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
