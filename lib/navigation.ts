import {
  BookOpenCheck,
  GraduationCap,
  LayoutDashboard,
  Library,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Roles that see this link. Access itself is enforced by `canAccess`. */
  roles: Role[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const ALL: Role[] = ["teacher", "student"];

/** Single source of truth for the sidebar, route access, and page titles. */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: "عام",
    items: [{ label: "نظرة عامة", href: "/", icon: LayoutDashboard, roles: ALL }],
  },
  {
    title: "اللوحات",
    items: [
      { label: "لوحة الطالب", href: "/student/dashboard", icon: BookOpenCheck, roles: ["student"] },
      { label: "لوحة المعلم", href: "/teacher/dashboard", icon: GraduationCap, roles: ["teacher"] },
    ],
  },
  {
    title: "الموارد",
    items: [
      { label: "المكتبة الرقمية", href: "/library", icon: Library, roles: ALL },
      { label: "الملف الشخصي", href: "/profile", icon: UserCog, roles: ALL },
    ],
  },
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);

export const HOME_FOR_ROLE: Record<Role, string> = {
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
};

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Route-prefix access rules. Everything under a prefix inherits its roles, so
 * new pages (e.g. /teacher/reports) are protected without extra wiring.
 * Paths matching no rule are open to any signed-in user.
 */
const ACCESS_RULES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/teacher", roles: ["teacher"] },
  { prefix: "/student", roles: ["student"] },
];

export function canAccess(pathname: string, role: Role) {
  const rule = ACCESS_RULES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`));
  return rule ? rule.roles.includes(role) : true;
}

export function navForRole(role: Role): NavSection[] {
  return NAV_SECTIONS.map((s) => ({ ...s, items: s.items.filter((i) => i.roles.includes(role)) })).filter(
    (s) => s.items.length > 0,
  );
}

/** Only allow same-origin relative paths as post-login redirects. */
export function safeRedirect(next: string | null, role: Role) {
  if (next && next.startsWith("/") && !next.startsWith("//") && next !== "/login" && canAccess(next, role)) return next;
  return HOME_FOR_ROLE[role];
}
