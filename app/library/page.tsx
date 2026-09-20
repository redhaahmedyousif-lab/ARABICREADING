'use client';

import { useState } from 'react';

interface PdfFile {
  id: number;
  title: string;
  description: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export default function LibraryPage() {
  const [files, setFiles] = useState<PdfFile[]>([
    { id: 1, title: 'قائمة الكتب القصيرة - النسخة الأولى (30 كتاباً)', description: 'مختارات من الأدب العالمي والعربي بأقل من 130 صفحة مناسبة لمرحلة MYP.', size: '2.4 MB', uploadedBy: 'المعلم', date: '2026-09-15' },
    { id: 2, title: 'قائمة الكتب القصيرة - النسخة الثانية (30 كتاباً)', description: 'مجموعة إضافية من الروايات القصيرة والكتب الفكرية والتاريخية.', size: '1.8 MB', uploadedBy: 'المعلم', date: '2026-09-16' },
    { id: 3, title: 'قائمة الكتب القصيرة - النسخة الثالثة (30 كتاباً)', description: 'كتب في السير الذاتية، الآداب العالمية، ورسائل الفلاسفة والأدباء.', size: '2.1 MB', uploadedBy: 'المعلم', date: '2026-09-17' },
    { id: 4, title: 'قائمة الكتب القصيرة - النسخة الرابعة (30 كتاباً)', description: 'أحدث المختارات من المسرحيات، الدواوين الشعرية، وكتب الفكر والمنطق.', size: '2.0 MB', uploadedBy: 'المعلم', date: '2026-09-18' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newFile: PdfFile = {
      id: Date.now(),
      title: newTitle,
      description: newDesc || 'ملف مرجعي للمجموعة',
      size: '1.5 MB',
      uploadedBy: 'طالب / معلم',
      date: new Date().toISOString().split('T')[0],
    };

    setFiles([newFile, ...files]);
    setNewTitle('');
    setNewDesc('');
    alert('تمت إضافة الملف بنجاح إلى المكتبة!');
  };

  // فلترة الملفات حسب البحث الفوري
  const filteredFiles = files.filter(file => 
    file.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    file.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-l from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">المكتبة الإلكترونية لملفات الـ PDF 📁</h2>
        <p className="text-purple-100 text-sm">استعرض وحمل جميع قوائم الكتب المقترحة، المراجع، والملفات التعليمية الخاصة بالتحدي.</p>
        
        {/* شريط البحث الفوري */}
        <div className="mt-6 max-w-xl">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أي ملف أو قائمة كتب بالاسم..."
            className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">الملفات المتاحة للتحميل</h3>
            <span className="text-xs text-slate-500 font-medium">عدد النتائج: {filteredFiles.length}</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredFiles.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center text-slate-500 border border-slate-200">
                لا توجد نتائج مطابقة لبحثك.
              </div>
            ) : (
              filteredFiles.map((file) => (
                <div key={file.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-300 transition-all">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">📄</span>
                    <div>
                      <h4 className="font-bold text-slate-900">{file.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{file.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>الحجم: {file.size}</span>
                        <span>•</span>
                        <span>بواسطة: {file.uploadedBy}</span>
                        <span>•</span>
                        <span>التاريخ: {file.date}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(`جاري تحميل الملف: ${file.title}`); }}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium px-4 py-2.5 rounded-lg transition-colors text-center shrink-0 border border-purple-200"
                  >
                    تحميل الملف ↓
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800">إضافة ملف PDF جديد</h3>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">عنوان الملف أو القائمة</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: ملخصات كتاب كذا..."
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">وصف مختصر</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="اكتب نبذة مختصرة عن محتوى الملف..."
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">اختر ملف PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm py-2.5 rounded-lg transition-colors shadow-sm"
              >
                رفع وإضافة للمكتبة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}