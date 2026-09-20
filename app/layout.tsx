import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AppProvider } from "@/context/AppContext";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "منصة تحدي القراءة | RJ Works",
  description: "نظام إدارة ومتابعة القراءة التفاعلي المتقدم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col`}>
        <AppProvider>
          {/* شريط التنقل الموحد */}
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
                  RJ
                </div>
                <div>
                  <span className="font-black text-white text-base tracking-tight block">تحدي القراءة الذكي</span>
                  <span className="text-[10px] text-indigo-400 font-bold block">Powered by RJ Works</span>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
                <Link href="/" className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all">
                  الرئيسية
                </Link>
                <Link href="/student/dashboard" className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-600/20 border border-indigo-500/30 transition-all shadow-sm">
                  لوحة الطالب 🚀
                </Link>
                <Link href="/teacher/dashboard" className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all">
                  لوحة المعلم 👨‍🏫
                </Link>
              </nav>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  النظام متصل حياً
                </div>
              </div>
            </div>
          </header>

          <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
            {children}
          </main>

          <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-20 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>جميع الحقوق محفوظة © 2026 • منصة تحدي القراءة بتطوير <span className="text-indigo-400 font-bold">RJ Works</span></p>
              <div className="flex items-center gap-6">
                <span className="hover:text-slate-400 transition-colors">دعم الأداء الفائق</span>
                <span className="hover:text-slate-400 transition-colors">إصدار النظام v3.0</span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}