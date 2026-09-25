import { Award } from "lucide-react";
import { getLevel } from "@/lib/levels";
import { cn } from "@/lib/utils";

/** Compact rank pill (مستوى القراءة) derived from pages read. */
export function LevelBadge({ pagesRead, className }: { pagesRead: number; className?: string }) {
  const { level } = getLevel(pagesRead);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-l px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap shadow-sm",
        level.tone,
        className,
      )}
    >
      <Award className="size-3" aria-hidden />
      {level.title}
    </span>
  );
}
