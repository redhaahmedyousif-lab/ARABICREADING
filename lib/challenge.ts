import type { ChallengeUnit, Student, WeeklyChallenge } from "@/types";
import { dayKey } from "./dates";

export const CHALLENGE_UNITS: Record<ChallengeUnit, { label: string; short: string }> = {
  pages: { label: "صفحات من كتب منجزة", short: "صفحة" },
  minutes: { label: "دقائق قراءة بالمؤقت", short: "دقيقة" },
  books: { label: "كتب منجزة", short: "كتاب" },
};

export function isChallengeActive(challenge: WeeklyChallenge, today = dayKey()) {
  return challenge.startDate <= today && today <= challenge.endDate;
}

export function daysLeft(challenge: WeeklyChallenge, today = dayKey()) {
  const [y1, m1, d1] = today.split("-").map(Number);
  const [y2, m2, d2] = challenge.endDate.split("-").map(Number);
  return Math.round((new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime()) / 86_400_000) + 1;
}

/** How much of the challenge unit the student achieved inside the challenge window. */
export function challengeProgress(student: Student, challenge: WeeklyChallenge) {
  const inWindow = (day?: string) => !!day && challenge.startDate <= day && day <= challenge.endDate;
  const completed = student.books.filter((b) => b.status === "completed" && inWindow(b.completedAt));

  const value =
    challenge.unit === "minutes"
      ? student.sessions.filter((s) => inWindow(s.date)).reduce((sum, s) => sum + s.minutes, 0)
      : challenge.unit === "pages"
        ? completed.reduce((sum, b) => sum + b.pages, 0)
        : completed.length;

  return { value, done: value >= challenge.target, ratio: Math.min(value / challenge.target, 1) };
}
