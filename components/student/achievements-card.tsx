import { Lock } from "lucide-react";
import { evaluateAchievements } from "@/lib/achievements";
import type { StudentStats } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function AchievementsCard({ stats }: { stats: StudentStats }) {
  const achievements = evaluateAchievements(stats);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ميداليات إنجاز القرّاء</CardTitle>
        <span className="text-xs font-semibold text-muted tabular-nums">
          {unlocked} من {achievements.length}
        </span>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {achievements.map(({ id, title, description, icon: Icon, unlocked, current, target }) => (
            <li
              key={id}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all duration-200",
                unlocked ? "border-warning/30 bg-warning-soft/60 hover:-translate-y-0.5" : "border-border bg-surface-muted/50",
              )}
            >
              <span
                className={cn(
                  "relative grid size-12 place-items-center rounded-full",
                  unlocked
                    ? "bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "bg-surface-muted text-subtle",
                )}
              >
                <Icon className="size-6" aria-hidden />
                {!unlocked && (
                  <Lock className="absolute -bottom-0.5 -end-0.5 size-4 rounded-full bg-surface p-0.5 text-subtle" aria-hidden />
                )}
              </span>
              <div className="space-y-0.5">
                <p className={cn("text-xs font-bold", unlocked ? "text-foreground" : "text-muted")}>{title}</p>
                <p className="text-[10px] leading-snug text-subtle">{description}</p>
              </div>
              {!unlocked && (
                <div className="w-full space-y-1" aria-label={`التقدم ${current} من ${target}`}>
                  <div className="h-1 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(current / target) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-subtle tabular-nums">
                    {current} من {target}
                  </p>
                </div>
              )}
              <span className="sr-only">{unlocked ? "مفتوحة" : "مقفلة"}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
