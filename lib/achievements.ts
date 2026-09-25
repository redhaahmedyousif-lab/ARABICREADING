import { Award, BookHeart, BookOpenCheck, Flame, Hourglass, Library, MessageSquareQuote, Zap, type LucideIcon } from "lucide-react";
import type { StudentStats } from "./stats";

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  target: number;
  value: (stats: StudentStats) => number;
}

// Achievements are derived from stats rather than stored, so they can never
// drift out of sync with the data they describe.
export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first-book", title: "البداية", description: "أنهِ كتابك الأول", icon: BookOpenCheck, target: 1, value: (s) => s.completedBooks },
  { id: "bookworm", title: "دودة الكتب", description: "أنهِ 5 كتب", icon: Library, target: 5, value: (s) => s.completedBooks },
  { id: "pages-500", title: "خمسمئة صفحة", description: "اقرأ 500 صفحة من كتب منجزة", icon: BookHeart, target: 500, value: (s) => s.pagesRead },
  { id: "streak-3", title: "شرارة", description: "حافظ على تتابع 3 أيام", icon: Zap, target: 3, value: (s) => s.longestStreak },
  { id: "streak-7", title: "شعلة الأسبوع", description: "حافظ على تتابع 7 أيام", icon: Flame, target: 7, value: (s) => s.longestStreak },
  { id: "marathon", title: "ماراثون القراءة", description: "اقرأ 300 دقيقة بالمؤقت", icon: Hourglass, target: 300, value: (s) => s.totalMinutes },
  { id: "critic", title: "الناقد", description: "قيّم ولخّص 3 كتب منجزة", icon: MessageSquareQuote, target: 3, value: (s) => s.reviewedBooks },
  { id: "curator", title: "المُرشِّح", description: "يعتمد المعلم كتاباً اقترحته", icon: Award, target: 1, value: (s) => s.approvedBooks },
];

export function evaluateAchievements(stats: StudentStats) {
  return ACHIEVEMENTS.map((def) => {
    const value = def.value(stats);
    return { ...def, current: Math.min(value, def.target), unlocked: value >= def.target };
  });
}
