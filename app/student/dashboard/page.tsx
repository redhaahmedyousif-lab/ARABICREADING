'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  category: string;
  status: 'completed' | 'reading' | 'want_to_read';
  addedBy: 'system' | 'student';
  note?: string;
  rating?: number;
}

export default function StudentDashboard() {
  const { addBookRequest, requests } = useApp();

  const [books, setBooks] = useState<Book[]>([
    { id: 1, title: 'لاعب الشطرنج', author: 'ستيفان زفايغ', pages: 90, category: 'رواية قصيرة', status: 'completed', addedBy: 'system', note: 'رواية عميقة تنافس النفس البشرية في العزلة والتركيز.', rating: 5 },
    { id: 2, title: 'الإنسان يبحث عن معنى', author: 'فيكتور فرانكل', pages: 120, category: 'فلسفة وتنمية', status: 'reading', addedBy: 'system' },
    { id: 3, title: 'المعطف', author: 'نيكولاي غوغول', pages: 70, category: 'أدب عالمي', status: 'want_to_read', addedBy: 'system' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newPages, setNewPages] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed' | 'want_to_read'>('all');
  
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAuthor) return;

    const pagesNum = Number(newPages) || 100;
    const categoryName = newCategory || 'عام';

    // 1. إضافة الكتاب محلياً للوحة الطالب
    const newBook: Book = {
      id: Date.now(),
      title: newTitle,
      author: newAuthor,
      pages: pagesNum,
      category: categoryName,
      status: 'want_to_read',
      addedBy: 'student',
    };

    setBooks([newBook, ...books]);

    // 2. إرسال طلب الاعتماد مباشرة إلى لوحة المعلم عبر الـ Context
    addBookRequest({
      title: newTitle,
      author: newAuthor,
      pages: pagesNum,
      category: categoryName,
    });

    setNewTitle('');
    setNewAuthor('');
    setNewPages('');
    setNewCategory('');

    setSuccessMessage('تم إرسال المقترح بنجاح إلى لوحة المعلم للاعتماد! 🚀');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const updateStatus = (id: number, status: Book['status']) => {
    setBooks(books.map(b => b.id === id ? { ...b, status } : b));
  };

  const setBookRating = (id: number, rating: number) => {
    setBooks(books.map(b => b.id === id ? { ...b, rating } : b));
  };

  const handleSaveNote = (id: number) => {
    setBooks(books.map(b => b.id === id ? { ...b, note: noteText } : b));
    setActiveNoteId(null);
    setNoteText('');
  };

  const completedCount = books.filter(b => b.status === 'completed').length;
  const totalPagesRead = books.filter(b => b.status === 'completed').reduce((acc, curr) => acc + curr.pages, 0);
  const completionPercentage = Math.min(Math.round((completedCount / (books.length || 1)) * 100), 100);

  const filteredBooks = books.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  return (
    <div className="space-y-8 pb-16 text-slate-100 max-w-7xl mx-auto">
      {/* رأس لوحة التحكم */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 rounded-3xl border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-inner">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              RJ Works • نظام القراءة التفاعلي المتصل
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              لوحة تحكم <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">الطالب الذكي</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              إدارة احترافية لمسارك القرائي، تسجيل الأفكار والاقتباسات، وإرسال المقترحات المباشرة لمعلمك.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-indigo-500/30 p-5 rounded-2xl flex items-center gap-5 backdrop-blur-xl shadow-xl">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-slate-800" fill="transparent" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" className="text-indigo-400" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * completionPercentage) / 100} strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-black text-indigo-300">{completionPercentage}%</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">مؤشر التقدم العام</span>
              <span className="text-base font-bold text-white">{completedCount} <span className="text-xs text-slate-400">من {books.length} كتب</span></span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-indigo-500/20">
          <div className="bg-slate-900/60 border border-indigo-500/10 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">الكتب المكتملة</span>
            <span className="text-xl font-black text-emerald-400">{completedCount} كتاب</span>
          </div>
          <div className="bg-slate-900/60 border border-indigo-500/10 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">إجمالي الصفحات المقروءة</span>
            <span className="text-xl font-black text-sky-400">{totalPagesRead} صفحة</span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-900/60 border border-indigo-500/10 p-4 rounded-2xl backdrop-blur-sm">
            <span className="text-xs text-slate-400 block mb-1">حالة التحدي</span>
            <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mt-0.5">
              ⚡ أداء استثنائي متصاعد
            </span>
          </div>
        </div>
      </div>

      {/* رسالة النجاح الفورية */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <span>✨</span> {successMessage}
        </div>
      )}

      {/* تخطيط المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* قائمة الكتب والفلترة */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md shadow-lg">
            <h2 className="text-base font-bold text-white flex items-center gap-2 px-2">
              <span>📚</span> إدارة الكتب والمتابعة
            </h2>

            <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold gap-1">
              <button onClick={() => setActiveTab('all')} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>الكل ({books.length})</button>
              <button onClick={() => setActiveTab('reading')} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'reading' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>قيد القراءة</button>
              <button onClick={() => setActiveTab('completed')} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'completed' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>المنجزة</button>
              <button onClick={() => setActiveTab('want_to_read')} className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'want_to_read' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>للقائمة</button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBooks.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-2xl text-center text-slate-500 space-y-2">
                <span className="text-4xl block">📭</span>
                <p className="text-sm">لا توجد كتب ضمن هذا التصنيف حالياً.</p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div key={book.id} className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl transition-all space-y-4 group shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">{book.title}</h3>
                        {book.addedBy === 'student' ? (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold">مضاف شخصياً</span>
                        ) : (
                          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold">قائمة رسمية</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">المؤلف: <span className="text-slate-200">{book.author}</span> • الصفحات: <span className="text-slate-200">{book.pages}</span> • التصنيف: <span className="text-slate-200">{book.category}</span></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={book.status}
                        onChange={(e) => updateStatus(book.id, e.target.value as Book['status'])}
                        className={`text-xs font-bold px-3.5 py-2 rounded-xl border focus:outline-none transition-all ${
                          book.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          book.status === 'reading' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="want_to_read" className="bg-slate-900">📌 أريد قراءته</option>
                        <option value="reading" className="bg-slate-900">⏳ قيد القراءة</option>
                        <option value="completed" className="bg-slate-900">✅ تمت القراءة</option>
                      </select>
                    </div>
                  </div>

                  {book.status === 'completed' && (
                    <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-400 ml-1">التقييم:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setBookRating(book.id, star)}
                              className={`text-base transition-transform hover:scale-125 ${
                                (book.rating || 0) >= star ? 'text-amber-400' : 'text-slate-700'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        {book.note && activeNoteId !== book.id && (
                          <button onClick={() => { setActiveNoteId(book.id); setNoteText(book.note || ''); }} className="text-xs font-bold text-indigo-400 hover:underline">
                            تعديل الخلاصة ✏️
                          </button>
                        )}
                      </div>

                      {book.note && activeNoteId !== book.id ? (
                        <div className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <span className="font-bold text-indigo-400 block mb-1">💡 فكرة أو اقتباس مسجل:</span>
                          &ldquo;{book.note}&rdquo;
                        </div>
                      ) : (
                        (!book.note || activeNoteId === book.id) && (
                          <div className="space-y-2 pt-1">
                            <input
                              type="text"
                              value={activeNoteId === book.id ? noteText : ''}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="اكتب خلاصة سريعة أو اقتباساً ملهماً من الكتاب..."
                              className="w-full text-xs bg-slate-900 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {activeNoteId === book.id && (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setActiveNoteId(null)} className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 rounded-lg">إلغاء</button>
                                <button onClick={() => handleSaveNote(book.id)} className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-semibold">حفظ</button>
                              </div>
                            )}
                            {!activeNoteId && (
                              <button onClick={() => { setActiveNoteId(book.id); setNoteText(''); }} className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-4 py-2 rounded-xl hover:bg-indigo-600/30 transition-all cursor-pointer">
                                إضافة خلاصة أو اقتباس ✍️
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* نموذج اقتراح كتاب جديد متصل بلوحة المعلم */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl sticky top-6 space-y-5 shadow-2xl backdrop-blur-md">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>⚡</span> اقتراح كتاب جديد للمنصة
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">أضف كتاباً ليتم إرساله فوراً إلى لوحة المعلم للاعتماد الرسمي.</p>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">عنوان الكتاب</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: عبقرية محمد"
                  className="w-full text-sm bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">المؤلف</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="مثال: عباس محمود العقاد"
                  className="w-full text-sm bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">الصفحات</label>
                  <input
                    type="number"
                    value={newPages}
                    onChange={(e) => setNewPages(e.target.value)}
                    placeholder="120"
                    className="w-full text-sm bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">التصنيف</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="رواية / تاريخ"
                    className="w-full text-sm bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                إرسال الطلب للمعلم 🚀
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}