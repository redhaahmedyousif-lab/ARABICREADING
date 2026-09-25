import type { Metadata } from "next";
import { BookOpen, Flame, Medal, Timer, Trophy } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = { title: "تسجيل الدخول" };

const HIGHLIGHTS = [
  { icon: Flame, text: "أيام تتابع يومية تحفّزك على الاستمرار" },
  { icon: Timer, text: "مؤقت للجلسات القرائية يسجّل وقتك تلقائياً" },
  { icon: Medal, text: "ميداليات إنجاز تُفتح مع كل هدف تحققه" },
  { icon: Trophy, text: "لوحة صدارة حيّة لأفضل القرّاء" },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <main className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="absolute top-4 end-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
              <BookOpen className="size-6" aria-hidden />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">أهلاً بك في تحدي القراءة</h1>
            <p className="text-sm text-muted">سجّل الدخول لمتابعة مسارك القرائي أو إدارة الصف.</p>
          </div>
          <LoginForm />
        </div>
      </main>

      <aside
        aria-hidden
        className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between"
      >
        <div className="pointer-events-none absolute -top-24 -end-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -start-16 size-96 rounded-full bg-sky-400/20 blur-3xl" />

        <p className="relative text-sm font-semibold text-indigo-100">RJ Works • منصة تحدي القراءة</p>

        <div className="relative space-y-8">
          <blockquote className="text-3xl leading-snug font-extrabold">
            «القراءة تمنحك أكثر من حياة واحدة.»
          </blockquote>
          <ul className="space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-indigo-50">
                <span className="grid size-9 place-items-center rounded-xl bg-white/10 backdrop-blur">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-200">© 2026 منصة تحدي القراءة</p>
      </aside>
    </div>
  );
}
