# منصة تحدي القراءة — Reading Challenge Platform

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · RTL Arabic UI.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

## Default accounts

| Role | Name | Username | Password |
| --- | --- | --- | --- |
| Teacher (master password) | أستاذ حسن بو سهيل | — | `teacher123` |
| Student | رضا الجبوري | `redha` | `redha123` |

The teacher adds or deletes student accounts under **لوحة المعلم → إدارة الطلاب**, and adds books
to the library under **إدارة الكتب** (or on the library page). Data lives in the browser's
localStorage; to start over, clear site data for the app.

## Project structure

```
app/
  layout.tsx                 Root layout: <html dir="rtl">, Cairo font, theme bootstrap, providers
  globals.css                Design tokens (light/dark) mapped into Tailwind via @theme
  not-found.tsx
  (auth)/login/              /login — role-tabbed sign-in (student / teacher)
  (dashboard)/               Route group — sidebar shell + <AuthGuard>, not part of the URL
    layout.tsx               Wraps pages in <DashboardShell>
    loading.tsx              Skeleton shown while a route segment loads
    page.tsx                 /                    Overview
    student/dashboard/       /student/dashboard   Student reading tracker
    teacher/dashboard/       /teacher/dashboard   Requests, student accounts, leaderboard
    library/                 /library             Book catalog + PDF lists (teacher adds/removes books)
    profile/                 /profile             Account info + change password
components/
  ui/                        Design-system primitives (Button, Card, Badge, Field, StatCard, …)
  layout/                    App shell: DashboardShell, Sidebar, Topbar, ThemeToggle, Logo
  auth/                      AuthGuard, LoginForm, ChangePasswordForm
  dashboard/ student/ teacher/ library/  Feature components (timer, streak, medals, leaderboard, account & book admin…)
context/AppContext.tsx       React binding for the store: useApp / useSignedIn / useStudent
lib/
  store/db.ts                localStorage-backed external store (SSR-safe, syncs across tabs)
  store/actions.ts           Every mutation, with role checks — becomes server actions later
  store/seed.ts              Default accounts, teacher name, starter library catalog
  auth/crypto.ts             Salted SHA-256 hashing, password/ID generation
  stats.ts                   Streaks, points, leaderboard (pure functions)
  achievements.ts            Medal definitions, derived from stats
  navigation.ts              Sidebar config per role + route access rules (/teacher/*, /student/*)
  constants.ts               Status labels/tones
  theme.ts                   Theme constants + no-flash init script
  utils.ts                   cn() class merge helper
types/                       Shared domain types
```

## Design system

- **Tokens, not colors.** Components use semantic utilities (`bg-surface`, `text-muted`,
  `bg-primary-soft`, `text-success`, …) defined in `app/globals.css`. Themes are a set of
  CSS variables under `[data-theme="light" | "dark"]`; the `dark:` variant follows the same attribute.
- **Theme** defaults to dark, is toggled from the top bar, persisted in `localStorage`, and
  applied by an inline script before first paint (no flash).
- **RTL-first.** Layout uses logical utilities (`start-*`, `ps-*`, `border-e`) so it mirrors
  correctly if an LTR locale is added.
- **Accessibility.** Skip link, `aria-current` navigation, labelled form fields via `<Field>`,
  focus-visible rings, Escape-to-close drawer, `prefers-reduced-motion` respected.

## Authentication (mock)

Auth is client-side for now: accounts live in localStorage with salted SHA-256 password hashes,
the session persists across refreshes, and `<AuthGuard>` redirects by role. Anything that
runs in the browser can be bypassed, so **before real use** move `lib/store/actions.ts`
to server actions backed by a database, and replace the localStorage session with an httpOnly
cookie checked in `proxy.ts`. The action signatures are designed to carry over unchanged.

## Gamification

- **Points** = pages of completed books + 100 per approved suggestion + 20 per current streak day (`lib/stats.ts`).
- **Streak** counts consecutive days with at least one saved timer session. It stays alive until a full day is missed.
- **Medals** are computed from stats, never stored, so they can't drift out of sync.
