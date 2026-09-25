import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { DEFAULT_THEME, themeInitScript } from "@/lib/theme";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "منصة تحدي القراءة | RJ Works",
    template: "%s | تحدي القراءة",
  },
  description: "نظام إدارة ومتابعة القراءة التفاعلي المتقدم",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0d17" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" data-theme={DEFAULT_THEME} className={cairo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
