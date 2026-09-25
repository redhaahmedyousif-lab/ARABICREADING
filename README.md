# منصة تحدي القراءة — Reading Challenge Platform

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · RTL Arabic UI.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

## Project structure

```
app/
  layout.tsx                 Root layout: <html dir="rtl">, Cairo font, theme bootstrap, providers
  globals.css                Design tokens (light/dark) mapped into Tailwind via @theme
  not-found.tsx
  (dashboard)/               Route group — shares the sidebar shell, not part of the URL
    layout.tsx               Wraps pages in <DashboardShell>
    loading.tsx              Skeleton shown while a route segment loads
    page.tsx                 /                    Overview
    student/dashboard/       /student/dashboard   Student reading tracker
    teacher/dashboard/       /teacher/dashboard   Request review & approval
    library/                 /library             PDF library
components/
  ui/                        Design-system primitives (Button, Card, Badge, Field, StatCard, …)
  layout/                    App shell: DashboardShell, Sidebar, Topbar, ThemeToggle, Logo
  dashboard/ student/        Feature components composed by pages
context/AppContext.tsx       Client store for book requests (integration seam for a backend)
lib/
  navigation.ts              Sidebar config — add a route here to add it to the nav
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
