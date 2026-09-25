import type { Book, Database, ReadingSession, Student } from "@/types";
import { createCredentials, uid } from "@/lib/auth/crypto";
import { addDays, dayKey } from "@/lib/dates";

/** Demo credentials — shown on the login page while the app runs on mock auth. */
export const DEFAULT_TEACHER_PASSWORD = "teacher123";

export const DEFAULT_STUDENTS = [
  { name: "سارة أحمد", username: "sara", password: "sara123" },
  { name: "يوسف علي", username: "youssef", password: "youssef123" },
  { name: "مريم خالد", username: "mariam", password: "mariam123" },
  { name: "عمر حسن", username: "omar", password: "omar123" },
] as const;

type BookSeed = Omit<Book, "id" | "addedBy">;

const CATALOG: Record<string, BookSeed> = {
  chess: { title: "لاعب الشطرنج", author: "ستيفان زفايغ", pages: 90, category: "رواية قصيرة", status: "completed" },
  meaning: { title: "الإنسان يبحث عن معنى", author: "فيكتور فرانكل", pages: 120, category: "فلسفة وتنمية", status: "completed" },
  coat: { title: "المعطف", author: "نيكولاي غوغول", pages: 70, category: "أدب عالمي", status: "completed" },
  oldman: { title: "الشيخ والبحر", author: "إرنست همنغواي", pages: 110, category: "أدب عالمي", status: "completed" },
  prince: { title: "الأمير الصغير", author: "أنطوان دو سانت إكزوبيري", pages: 96, category: "أدب عالمي", status: "completed" },
  metamorphosis: { title: "المسخ", author: "فرانز كافكا", pages: 85, category: "رواية قصيرة", status: "completed" },
  days: { title: "الأيام", author: "طه حسين", pages: 130, category: "سيرة", status: "completed" },
};

function books(entries: [keyof typeof CATALOG, Partial<BookSeed>?][]): Book[] {
  return entries.map(([key, patch]) => ({ ...CATALOG[key], ...patch, id: uid(), addedBy: "system" }));
}

/** Sessions on the given day offsets from today (0 = today, -1 = yesterday…). */
function sessions(offsets: number[], minutes = 25): ReadingSession[] {
  const today = dayKey();
  return offsets.map((offset, i) => ({ id: uid(), date: addDays(today, offset), minutes: minutes + ((i * 7) % 15) }));
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export async function createSeedDb(): Promise<Database> {
  const [teacher, ...creds] = await Promise.all([
    createCredentials(DEFAULT_TEACHER_PASSWORD),
    ...DEFAULT_STUDENTS.map((s) => createCredentials(s.password)),
  ]);

  const profiles: Pick<Student, "books" | "sessions">[] = [
    {
      books: books([
        ["chess", { rating: 5, note: "رواية عميقة عن النفس البشرية في العزلة والتركيز." }],
        ["meaning", { rating: 5, note: "المعنى يُصنع حتى في أقسى الظروف." }],
        ["prince"],
        ["coat", { status: "reading" }],
      ]),
      sessions: sessions(range(-7, 0), 30),
    },
    {
      books: books([["oldman", { rating: 4 }], ["metamorphosis"], ["days", { status: "reading" }]]),
      sessions: sessions([-9, -8, -3, -2, -1], 20),
    },
    {
      books: books([["prince"], ["chess", { status: "reading" }], ["meaning", { status: "want_to_read" }]]),
      sessions: sessions([-4, -1, 0], 15),
    },
    {
      books: books([["coat", { status: "reading" }], ["oldman", { status: "want_to_read" }]]),
      sessions: sessions([-12, -11], 10),
    },
  ];

  const created = addDays(dayKey(), -30);
  const students: Student[] = DEFAULT_STUDENTS.map((s, i) => ({
    id: uid(),
    name: s.name,
    username: s.username,
    createdAt: created,
    ...creds[i],
    ...profiles[i],
  }));

  const [sara, youssef] = students;
  const pendingBook: Book = { id: uid(), title: "عبقرية محمد", author: "عباس محمود العقاد", pages: 180, category: "سيرة", status: "want_to_read", addedBy: "student" };
  const approvedBook: Book = { id: uid(), title: "رسائل إلى شاعر شاب", author: "راينر ماريا ريلكه", pages: 80, category: "رسائل أدبية", status: "want_to_read", addedBy: "student" };
  const requests = [
    { book: pendingBook, student: sara, status: "pending" as const, date: addDays(dayKey(), -2) },
    { book: approvedBook, student: youssef, status: "approved" as const, date: addDays(dayKey(), -6) },
  ].map(({ book, student, status, date }) => {
    const id = uid();
    student.books.unshift({ ...book, requestId: id });
    const { title, author, pages, category } = book;
    return { id, studentId: student.id, status, createdAt: date, title, author, pages, category };
  });

  return { version: 1, teacher, students, requests };
}
