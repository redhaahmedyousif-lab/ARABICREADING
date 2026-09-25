"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, KeyRound, LogIn, UserRound } from "lucide-react";
import type { Role } from "@/types";
import { useApp } from "@/context/AppContext";
import { safeRedirect } from "@/lib/navigation";
import { DEFAULT_STUDENTS, DEFAULT_TEACHER_PASSWORD, TEACHER_NAME } from "@/lib/store/seed";
import { cn } from "@/lib/utils";
import { Alert, Button, Field, Input, PasswordInput } from "@/components/ui";

const ROLES: { value: Role; label: string; icon: typeof UserRound }[] = [
  { value: "student", label: "طالب", icon: UserRound },
  { value: "teacher", label: "معلم", icon: GraduationCap },
];

function nextParam() {
  return new URLSearchParams(window.location.search).get("next");
}

export function LoginForm() {
  const { ready, role: signedInRole, actions } = useApp();
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // Already signed in (e.g. refreshed /login, or just logged in) → leave.
  useEffect(() => {
    if (signedInRole) router.replace(safeRedirect(nextParam(), signedInRole));
  }, [signedInRole, router]);

  const switchRole = (next: Role) => {
    setRole(next);
    setError("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    const result =
      role === "teacher" ? await actions.loginTeacher(password) : await actions.loginStudent(username, password);
    setPending(false);
    if (!result.ok) setError(result.error);
    // On success the session change triggers the redirect effect above.
  };

  const fillDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="نوع الحساب" className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-surface-muted p-1">
        {ROLES.map(({ value, label, icon: Icon }) => {
          const selected = role === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => switchRole(value)}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-200",
                selected ? "bg-surface text-foreground shadow-card" : "text-muted hover:text-foreground",
              )}
            >
              <Icon className={cn("size-4", selected && "text-primary")} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {role === "student" ? (
          <>
            <Field label="اسم المستخدم">
              {(id) => (
                <Input
                  id={id}
                  required
                  dir="ltr"
                  className="text-start"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                />
              )}
            </Field>
            <Field label="كلمة المرور">
              {(id) => (
                <PasswordInput id={id} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              )}
            </Field>
          </>
        ) : (
          <Field label="كلمة المرور الرئيسية للمعلم" hint="بوابة المعلم محمية بكلمة مرور رئيسية واحدة.">
            {(id) => (
              <PasswordInput id={id} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            )}
          </Field>
        )}

        {error && <Alert tone="danger">{error}</Alert>}

        <Button type="submit" size="lg" className="w-full" disabled={!ready || pending}>
          <LogIn className="size-4 rtl:-scale-x-100" aria-hidden />
          {pending ? "جارٍ التحقق..." : "تسجيل الدخول"}
        </Button>
      </form>

      <details className="group rounded-2xl border border-dashed border-border p-4 text-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-muted transition-colors hover:text-foreground">
          <KeyRound className="size-4" aria-hidden />
          بيانات الدخول التجريبية
        </summary>
        <div className="mt-3 space-y-2 text-xs text-muted">
          {role === "teacher" ? (
            <DemoRow label={TEACHER_NAME} pass={DEFAULT_TEACHER_PASSWORD} onUse={() => fillDemo("", DEFAULT_TEACHER_PASSWORD)} />
          ) : (
            DEFAULT_STUDENTS.map((s) => (
              <DemoRow key={s.username} label={s.name} user={s.username} pass={s.password} onUse={() => fillDemo(s.username, s.password)} />
            ))
          )}
          <p className="pt-1 text-subtle">تنطبق على الحسابات الافتراضية ما لم تُغيَّر كلمة مرورها.</p>
        </div>
      </details>
    </div>
  );
}

function DemoRow({ label, user, pass, onUse }: { label: string; user?: string; pass: string; onUse: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-muted px-3 py-2">
      <span className="font-semibold text-foreground">{label}</span>
      <span dir="ltr" className="font-mono text-[11px]">
        {user && `${user} / `}
        {pass}
      </span>
      <button type="button" onClick={onUse} className="cursor-pointer font-semibold text-primary hover:underline">
        استخدام
      </button>
    </div>
  );
}
