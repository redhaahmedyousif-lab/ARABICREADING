'use client';

import { useApp } from '@/context/AppContext';

export default function TeacherDashboard() {
  const { requests, updateBookStatus } = useApp();

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;

  return (
    <div className="space-y-8 pb-16 text-slate-100 max-w-7xl mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 rounded-3xl border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-inner">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              RJ Works • لوحة تحكم المعلم المشرف
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              إدارة واعتماد <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">الكتب والطلبات</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              تتم مزامنة الطلبات الواردة من الطلاب لحظياً، قم باعتماد الكتب لتضاف لمسار التحدي.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-indigo-500/30 p-5 rounded-2xl flex items-center gap-5 backdrop-blur-xl shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-black text-xl">
              {pendingCount}
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">طلبات بانتظار الاعتماد</span>
              <span className="text-base font-bold text-white">تتطلب مراجعتك</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-indigo-500/20">
          <div className="bg-slate-900/60 border border-indigo-500/10 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">الطلبات المعلقة</span>
            <span className="text-xl font-black text-amber-400">{pendingCount} طلب</span>
          </div>
          <div className="bg-slate-900/60 border border-indigo-500/10 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">الكتب المعتمدة</span>
            <span className="text-xl font-black text-emerald-400">{approvedCount} كتاب</span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-900/60 border border-indigo-500/10 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">حالة المزامنة</span>
            <span className="text-sm font-bold text-sky-300 flex items-center gap-1.5 mt-0.5">
              🟢 متصل ومزامن
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📥</span> مقترحات الكتب الواردة من الطلاب (مباشر)
          </h2>
          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            الإجمالي: {requests.length}
          </span>
        </div>

        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <span className="text-4xl block">✨</span>
              <p className="text-sm">لا توجد طلبات معلقة حالياً.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 p-5 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-white text-base">{req.title}</h3>
                    <span className="bg-slate-800 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                      الطالب: {req.studentName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    المؤلف: <span className="text-slate-200">{req.author}</span> • الصفحات: <span className="text-slate-200">{req.pages}</span> • التصنيف: <span className="text-slate-200">{req.category}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateBookStatus(req.id, 'approved')}
                        className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        قبول واعتماد ✓
                      </button>
                      <button
                        onClick={() => updateBookStatus(req.id, 'rejected')}
                        className="bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600/30 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        رفض ✕
                      </button>
                    </>
                  ) : req.status === 'approved' ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3.5 py-1.5 rounded-xl">
                      تمت الموافقة ✓
                    </span>
                  ) : (
                    <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold px-3.5 py-1.5 rounded-xl">
                      مرفوض
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}