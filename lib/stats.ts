import type { BookRequest, Database, ReadingSession, Student } from "@/types";
import { addDays, dayKey } from "./dates";

export interface StudentStats {
  completedBooks: number;
  pagesRead: number;
  approvedBooks: number;
  reviewedBooks: number;
  totalMinutes: number;
  sessionsCount: number;
  minutesToday: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
}

/** Leaderboard scoring — tweak weights here only. */
export const POINTS = { perPage: 1, perApprovedBook: 100, perStreakDay: 20 } as const;

export function minutesByDay(sessions: ReadingSession[]) {
  const map = new Map<string, number>();
  for (const s of sessions) map.set(s.date, (map.get(s.date) ?? 0) + s.minutes);
  return map;
}

/**
 * Consecutive active days ending today. If nothing is logged yet today the
 * streak is still alive from yesterday — it only breaks after a missed day.
 */
export function currentStreak(sessions: ReadingSession[], today = dayKey()) {
  const days = minutesByDay(sessions);
  let cursor = days.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(sessions: ReadingSession[]) {
  const days = [...minutesByDay(sessions).keys()].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of days) {
    run = prev && addDays(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

export function getStudentStats(student: Student, requests: BookRequest[], today = dayKey()): StudentStats {
  const completed = student.books.filter((b) => b.status === "completed");
  const pagesRead = completed.reduce((sum, b) => sum + b.pages, 0);
  const approvedBooks = requests.filter((r) => r.studentId === student.id && r.status === "approved").length;
  const streak = currentStreak(student.sessions, today);

  return {
    completedBooks: completed.length,
    pagesRead,
    approvedBooks,
    reviewedBooks: completed.filter((b) => b.rating && b.note).length,
    totalMinutes: student.sessions.reduce((sum, s) => sum + s.minutes, 0),
    sessionsCount: student.sessions.length,
    minutesToday: minutesByDay(student.sessions).get(today) ?? 0,
    currentStreak: streak,
    longestStreak: longestStreak(student.sessions),
    points: pagesRead * POINTS.perPage + approvedBooks * POINTS.perApprovedBook + streak * POINTS.perStreakDay,
  };
}

export interface LeaderboardEntry {
  rank: number;
  student: Pick<Student, "id" | "name">;
  stats: StudentStats;
}

export function getLeaderboard(db: Database, today = dayKey()): LeaderboardEntry[] {
  return db.students
    .map((student) => ({ student: { id: student.id, name: student.name }, stats: getStudentStats(student, db.requests, today) }))
    .sort((a, b) => b.stats.points - a.stats.points || b.stats.pagesRead - a.stats.pagesRead)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}
