"use client";

import { CalendarClock, Target, Trophy } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { CHALLENGE_UNITS, challengeProgress, daysLeft, isChallengeActive } from "@/lib/challenge";

/** Weekly challenge set by the teacher; renders nothing when none is running. */
export function WeeklyChallengeBanner() {
  const { db, role, currentStudent } = useSignedIn();
  const challenge = db.challenge;
  if (!challenge || !isChallengeActive(challenge)) return null;

  const unit = CHALLENGE_UNITS[challenge.unit];
  const remaining = daysLeft(challenge);
  const mine = role === "student" && currentStudent ? challengeProgress(currentStudent, challenge) : null;
  const finishers = db.students.filter((s) => challengeProgress(s, challenge).done).length;

  return (
    <section
      aria-label="التحدي الأسبوعي"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-elevated sm:p-6"
    >
      <div className="pointer-events-none absolute -top-16 -start-10 size-56 rounded-full bg-white/10 blur-2xl" aria-hidden />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-indigo-100">
            <Target className="size-3.5" aria-hidden />
            التحدي الأسبوعي
            {challenge.theme && <span className="rounded-full bg-white/15 px-2 py-0.5">{challenge.theme}</span>}
          </p>
          <h2 className="text-xl font-extrabold sm:text-2xl">{challenge.title}</h2>
          <p className="text-sm text-indigo-100">
            الهدف: <strong className="text-white tabular-nums">{challenge.target}</strong> {unit.label}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:min-w-80 lg:flex-col lg:items-stretch">
          {mine ? (
            <div className="w-full space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>{mine.done ? "أنجزت التحدي! 🎉" : "تقدّمك"}</span>
                <span className="tabular-nums">
                  {mine.value} من {challenge.target} {unit.short}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${mine.ratio * 100}%` }} />
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Trophy className="size-4" aria-hidden />
              أنجزه {finishers} من {db.students.length} طالب
            </p>
          )}
          <p className="flex items-center gap-1.5 text-xs text-indigo-100">
            <CalendarClock className="size-3.5" aria-hidden />
            {remaining === 1 ? "اليوم الأخير" : `بقي ${remaining} أيام`} • ينتهي {challenge.endDate}
          </p>
        </div>
      </div>
    </section>
  );
}
