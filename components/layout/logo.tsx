import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-3 rounded-xl">
      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
        <BookOpen className="size-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-extrabold text-foreground">تحدي القراءة</span>
        <span className="block text-[11px] font-medium text-subtle">RJ Works</span>
      </span>
    </Link>
  );
}
