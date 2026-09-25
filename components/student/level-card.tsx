import { Award } from "lucide-react";
import { LEVELS, getLevel } from "@/lib/levels";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function LevelCard({ pagesRead }: { pagesRead: number }) {
  const { level, next, rank, progress } = getLevel(pagesRead);

  return (
    <Card>
      <CardHeader>
        <CardTitle>مستوى القراءة</CardTitle>
        <span className="text-xs text-muted tabular-nums">
          المستوى {rank} من {LEVELS.length}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <span className={cn("grid size-16 place-items-center rounded-2xl bg-gradient-to-br shadow-lg", level.tone)}>
            <Award className="size-8" aria-hidden />
          </span>
          <div>
            <p className="text-xl font-extrabold text-foreground">{level.title}</p>
            <p className="text-xs text-muted">
              {next ? `بقي ${next.minPages - pagesRead} صفحة للوصول إلى «${next.title}»` : "وصلت إلى أعلى مستوى، أحسنت!"}
            </p>
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="التقدم نحو المستوى التالي">
          <div className="h-full rounded-full bg-gradient-to-l from-primary to-violet-500 transition-[width] duration-700" style={{ width: `${progress * 100}%` }} />
        </div>
        <ol className="flex flex-wrap gap-1.5">
          {LEVELS.map((l, i) => (
            <li
              key={l.id}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                i < rank ? "bg-primary-soft text-primary-soft-foreground" : "bg-surface-muted text-subtle",
              )}
            >
              {l.title} <span className="tabular-nums opacity-70">({l.minPages}+)</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
