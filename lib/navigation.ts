import {
  BookOpenCheck,
  GraduationCap,
  LayoutDashboard,
  Library,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** Single source of truth for the sidebar and any future breadcrumbs / command menu. */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: "عام",
    items: [{ label: "نظرة عامة", href: "/", icon: LayoutDashboard }],
  },
  {
    title: "اللوحات",
    items: [
      { label: "لوحة الطالب", href: "/student/dashboard", icon: BookOpenCheck },
      { label: "لوحة المعلم", href: "/teacher/dashboard", icon: GraduationCap },
    ],
  },
  {
    title: "الموارد",
    items: [{ label: "المكتبة الرقمية", href: "/library", icon: Library }],
  },
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
