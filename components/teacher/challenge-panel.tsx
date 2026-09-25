"use client";

import { useState } from "react";
import { Flag, Target } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { CHALLENGE_UNITS, challengeProgress, isChallengeActive } from "@/lib/challenge";
import { dayKey } from "@/lib/dates";
import { CHALLENGE_DAYS } from "@/lib/store/actions";
import type { ChallengeUnit } from "@/types";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Field,
  Input,
  Select,
} from "@/components/ui";
import { WeeklyChallengeBanner } from "@/components/dashboard/weekly-challenge-banner";

export function ChallengePanel() {
  const { db, actions } = useSignedIn();
  const current = db.challenge;
  const [values, setValues] = useState({
    title: current?.title ?? "",
    theme: current?.theme ?? "",
    unit: current?.unit ?? ("pages" as ChallengeUnit),
    target: String(current?.target ?? 200),
    startDate: dayKey(),
  });
  const [status, setStatus] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = actions.setWeeklyChallenge({ ...values, target: Number(values.target) });
    setStatus(
      result.ok
        ? { tone: "success", message: `نُشر التحدي حتى ${result.data.endDate}، ويظهر الآن لجميع الطلاب.` }
        : { tone: "danger", message: result.error },
    );
  };

  const active = current !== null && isChallengeActive(current);

  return (
    <div className="space-y-6">
      <WeeklyChallengeBanner />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>تقدّم الطلاب في التحدي</CardTitle>
            {current && (
              <Button variant="ghost" size="sm" onClick={() => actions.clearWeeklyChallenge()}>
                إنهاء التحدي
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!current ? (
              <EmptyState icon={Target} title="لا يوجد تحدٍّ حالياً" description="حدّد هدفاً أسبوعياً من النموذج ليظهر لافتةً لجميع الطلاب." />
            ) : (
              <>
                {!active && (
                  <Alert tone="info" className="mb-4">
                    التحدي الحالي خارج مدته ({current.startDate} ← {current.endDate})، لذلك لا يظهر للطلاب.
                  </Alert>
                )}
                <ul className="divide-y divide-border">
                  {db.students.map((student) => {
                    const p = challengeProgress(student, current);
                    return (
                      <li key={student.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <span className="w-32 shrink-0 truncate text-sm font-semibold text-foreground">{student.name}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                          <div className={`h-full rounded-full ${p.done ? "bg-success" : "bg-primary"}`} style={{ width: `${p.ratio * 100}%` }} />
                        </div>
                        <span className="w-28 shrink-0 text-end text-xs text-muted tabular-nums">
                          {p.value} من {current.target} {CHALLENGE_UNITS[current.unit].short}
                        </span>
                        {p.done && (
                          <Badge tone="success" dot>
                            أنجز
                          </Badge>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-col items-start gap-1">
            <CardTitle className="flex items-center gap-2">
              <Flag className="size-5 text-primary" aria-hidden />
              {current ? "تحدٍّ أسبوعي جديد" : "إطلاق التحدي الأسبوعي"}
            </CardTitle>
            <CardDescription>يستمر {CHALLENGE_DAYS} أيام من تاريخ البداية، ويستبدل أي تحدٍّ سابق.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="عنوان التحدي">
                {(id) => <Input id={id} required value={values.title} onChange={set("title")} placeholder="مثال: أسبوع الرواية العربية" />}
              </Field>
              <Field label="الموضوع (اختياري)">
                {(id) => <Input id={id} value={values.theme} onChange={set("theme")} placeholder="مثال: أدب الرحلات" />}
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="نوع الهدف">
                  {(id) => (
                    <Select id={id} value={values.unit} onChange={set("unit")}>
                      {Object.entries(CHALLENGE_UNITS).map(([value, { short }]) => (
                        <option key={value} value={value}>
                          {short}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="الهدف">
                  {(id) => <Input id={id} required type="number" min={1} inputMode="numeric" value={values.target} onChange={set("target")} />}
                </Field>
              </div>
              <Field label="تاريخ البداية">
                {(id) => <Input id={id} required type="date" dir="ltr" className="text-start" value={values.startDate} onChange={set("startDate")} />}
              </Field>
              {status && <Alert tone={status.tone}>{status.message}</Alert>}
              <Button type="submit" className="w-full">
                <Flag className="size-4" aria-hidden />
                نشر التحدي
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
