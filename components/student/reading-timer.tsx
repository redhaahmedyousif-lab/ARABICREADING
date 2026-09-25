"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Save, Timer } from "lucide-react";
import { formatDuration } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { Alert, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const DAILY_GOAL_MINUTES = 20;

interface TimerState {
  /** Time banked from previous run segments. */
  accumulatedMs: number;
  /** Epoch ms when the current run segment started; null while paused. */
  startedAt: number | null;
}

const IDLE: TimerState = { accumulatedMs: 0, startedAt: null };

// Persisted so a running session survives refreshes and navigating away.
const storageKey = (studentId: string) => `reading-challenge:timer:${studentId}`;

function loadTimer(studentId: string): TimerState {
  try {
    const raw = localStorage.getItem(storageKey(studentId));
    return raw ? { ...IDLE, ...(JSON.parse(raw) as TimerState) } : IDLE;
  } catch {
    return IDLE;
  }
}

function saveTimer(studentId: string, state: TimerState) {
  try {
    if (state.accumulatedMs === 0 && state.startedAt === null) localStorage.removeItem(storageKey(studentId));
    else localStorage.setItem(storageKey(studentId), JSON.stringify(state));
  } catch {
    // Non-critical: the timer still works for this page view.
  }
}

interface ReadingTimerProps {
  studentId: string;
  minutesToday: number;
  onSave: (minutes: number) => void;
}

export function ReadingTimer({ studentId, minutesToday, onSave }: ReadingTimerProps) {
  const [timer, setTimerState] = useState<TimerState>(() => loadTimer(studentId));
  const [now, setNow] = useState(() => Date.now());
  const [saved, setSaved] = useState<number | null>(null);

  const running = timer.startedAt !== null;
  const elapsedMs = timer.accumulatedMs + (timer.startedAt !== null ? now - timer.startedAt : 0);
  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  const update = (next: TimerState) => {
    setTimerState(next);
    saveTimer(studentId, next);
  };

  const start = () => {
    const t = Date.now();
    setNow(t);
    setSaved(null);
    update({ ...timer, startedAt: t });
  };
  const pause = () => update({ accumulatedMs: elapsedMs, startedAt: null });
  const reset = () => update(IDLE);
  const finish = () => {
    onSave(elapsedMinutes);
    setSaved(elapsedMinutes);
    update(IDLE);
  };

  // Include the in-progress session so the bar moves while reading.
  const goalMinutes = minutesToday + elapsedMinutes;
  const goalProgress = Math.min((goalMinutes / DAILY_GOAL_MINUTES) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="size-5 text-primary" aria-hidden />
          مؤقت الجلسة القرائية
        </CardTitle>
        {running && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
            <span className="size-2 animate-pulse rounded-full bg-success" aria-hidden />
            جلسة نشطة
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-5">
        <p
          className={cn(
            "text-center font-mono text-5xl font-bold tracking-tight tabular-nums transition-colors sm:text-6xl",
            running ? "text-foreground" : "text-muted",
          )}
          dir="ltr"
          role="timer"
          aria-live="off"
        >
          {formatDuration(elapsedSeconds)}
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {running ? (
            <Button variant="secondary" onClick={pause}>
              <Pause className="size-4" aria-hidden />
              إيقاف مؤقت
            </Button>
          ) : (
            <Button onClick={start}>
              <Play className="size-4 rtl:-scale-x-100" aria-hidden />
              {elapsedMs > 0 ? "استئناف" : "ابدأ القراءة"}
            </Button>
          )}
          <Button variant="success" onClick={finish} disabled={elapsedMinutes < 1} title="تُحفظ الجلسات من دقيقة فأكثر">
            <Save className="size-4" aria-hidden />
            إنهاء وحفظ
          </Button>
          <Button variant="ghost" size="icon" onClick={reset} disabled={elapsedMs === 0} aria-label="تصفير المؤقت">
            <RotateCcw className="size-4" aria-hidden />
          </Button>
        </div>

        {saved !== null && <Alert tone="success">تم تسجيل {saved} دقيقة في سجل قراءتك اليوم.</Alert>}

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-foreground">هدف اليوم</span>
            <span className="text-muted tabular-nums">
              {goalMinutes} من {DAILY_GOAL_MINUTES} دقيقة
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full rounded-full bg-success transition-[width] duration-500" style={{ width: `${goalProgress}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
