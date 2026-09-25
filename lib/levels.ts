/** Reading levels (مستويات القراءة), unlocked by pages of completed books. */
export interface ReadingLevel {
  id: string;
  title: string;
  minPages: number;
  /** Tailwind classes for the badge (gradient + text). */
  tone: string;
}

export const LEVELS: ReadingLevel[] = [
  { id: "beginner", title: "قارئ مبتدئ", minPages: 0, tone: "from-slate-400 to-slate-500 text-white" },
  { id: "active", title: "قارئ نشيط", minPages: 300, tone: "from-sky-400 to-blue-500 text-white" },
  { id: "distinguished", title: "قارئ متميز", minPages: 800, tone: "from-emerald-400 to-teal-500 text-white" },
  { id: "expert", title: "قارئ خبير", minPages: 1500, tone: "from-violet-400 to-indigo-500 text-white" },
  { id: "ambassador", title: "سفير القراءة", minPages: 3000, tone: "from-amber-300 to-orange-500 text-white" },
];

export function getLevel(pagesRead: number) {
  const index = LEVELS.findLastIndex((l) => pagesRead >= l.minPages);
  const level = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next ? (pagesRead - level.minPages) / (next.minPages - level.minPages) : 1;
  return { level, next, rank: index + 1, progress: Math.min(Math.max(progress, 0), 1) };
}
