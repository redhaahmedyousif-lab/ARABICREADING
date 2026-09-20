'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12 py-6">
      {/* قسم الترحيب الرئيسي */}
      <div className="bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-700 text-white p-8 sm:p-12 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
            منصة تفاعلية لتعزيز شغف القراءة 📚
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            مرحباً بك في منصة تحدي القراءة
          </h1>
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
            منصة مخصصة لمتابعة إنجازات الطلاب، استعراض قائمة الكتب القصيرة، وتسهيل عملية التقييم والمشاركة بين المعلم والطلاب بطريقة مبتكرة وسهلة.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/student/dashboard"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors shadow-sm text-sm"
            >
              دخول لوحة الطالب 🚀
            </Link>
            <Link
              href="/library"
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-white/20 backdrop-blur-md text-sm"
            >
              استعراض مكتبة الـ PDF 📁
            </Link>
          </div>
        </div>
      </div>

      {/* قسم الأقسام السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold">
            📚
          </div>
          <h3 className="text-xl font-bold text-slate-900">لوحة الطالب</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            تابع الكتب التي أنجزتها، حدّث حالة القراءة (تمت، قيد القراءة، أريد قراءته)، وأضف مقترحاتك الخاصة للقائمة.
          </p>
          <Link href="/student/dashboard" className="inline-block text-blue-600 hover:text-blue-700 font-semibold text-sm pt-2">
            انتقل لوحة الطالب ←
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl font-bold">
            👨‍🏫
          </div>
          <h3 className="text-xl font-bold text-slate-900">لوحة المعلم</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            راقب تقدم الطلاب، اكتب الملاحظات والتقييمات الفردية، واعتمد أو ارفض الكتب المقترحة من قبلهم بسهولة.
          </p>
          <Link href="/teacher/dashboard" className="inline-block text-emerald-600 hover:text-emerald-700 font-semibold text-sm pt-2">
            انتقل لوحة المعلم ←
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-300 transition-all space-y-3">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl font-bold">
            📁
          </div>
          <h3 className="text-xl font-bold text-slate-900">المكتبة الرقمية</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            تصفح وحمل قوائم الكتب القصيرة بصيغة PDF، واطلع على المراجع والملفات التعليمية المعتمدة للمنصة.
          </p>
          <Link href="/library" className="inline-block text-purple-600 hover:text-purple-700 font-semibold text-sm pt-2">
            انتقل للمكتبة الرقمية ←
          </Link>
        </div>
      </div>
    </div>
  );
}