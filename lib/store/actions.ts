import type {
  ActionResult,
  Book,
  BookRequestInput,
  Database,
  LibraryBook,
  LibraryBookInput,
  RequestStatus,
  Session,
  Student,
} from "@/types";
import { MIN_PASSWORD_LENGTH, USERNAME_PATTERN, createCredentials, generatePassword, uid, verifyPassword } from "@/lib/auth/crypto";
import { dayKey } from "@/lib/dates";
import { getState, setState } from "./db";
import { LIBRARY_CATEGORY } from "./seed";

// All mutations live here. Each one re-checks the caller's role, so UI guards
// are a convenience rather than the only line of defence. When a backend
// exists, these become server actions with the same signatures.

const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });
const fail = (error: string): ActionResult<never> => ({ ok: false, error });

const NOT_READY = fail("البيانات لم تُحمَّل بعد، حاول مجدداً.");
const FORBIDDEN = fail("ليست لديك صلاحية لتنفيذ هذا الإجراء.");

function currentStudentId() {
  const session = getState()?.session;
  return session?.role === "student" ? session.studentId : null;
}

const isTeacher = () => getState()?.session?.role === "teacher";

function updateDb(fn: (db: Database) => Database) {
  setState((s) => ({ ...s, db: fn(s.db) }));
}

function updateStudent(id: string, fn: (student: Student) => Student) {
  updateDb((db) => ({ ...db, students: db.students.map((s) => (s.id === id ? fn(s) : s)) }));
}

function validateNewPassword(password: string) {
  return password.length >= MIN_PASSWORD_LENGTH ? null : `يجب ألا تقل كلمة المرور عن ${MIN_PASSWORD_LENGTH} أحرف.`;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function loginTeacher(password: string): Promise<ActionResult<Session>> {
  const state = getState();
  if (!state) return NOT_READY;
  if (!(await verifyPassword(password, state.db.teacher))) return fail("كلمة المرور الرئيسية غير صحيحة.");
  const session: Session = { role: "teacher" };
  setState((s) => ({ ...s, session }));
  return ok(session);
}

export async function loginStudent(username: string, password: string): Promise<ActionResult<Session>> {
  const state = getState();
  if (!state) return NOT_READY;
  const student = state.db.students.find((s) => s.username === username.trim().toLowerCase());
  // Same message for unknown user and wrong password — don't reveal which usernames exist.
  if (!student || !(await verifyPassword(password, student))) return fail("اسم المستخدم أو كلمة المرور غير صحيحة.");
  const session: Session = { role: "student", studentId: student.id };
  setState((s) => ({ ...s, session }));
  return ok(session);
}

export function logout() {
  setState((s) => ({ ...s, session: null }));
}

export async function changePassword(current: string, next: string): Promise<ActionResult> {
  const state = getState();
  if (!state?.session) return NOT_READY;

  const invalid = validateNewPassword(next);
  if (invalid) return fail(invalid);
  if (current === next) return fail("كلمة المرور الجديدة مطابقة للحالية.");

  const { session, db } = state;
  const credentials = session.role === "teacher" ? db.teacher : db.students.find((s) => s.id === session.studentId);
  if (!credentials || !(await verifyPassword(current, credentials))) return fail("كلمة المرور الحالية غير صحيحة.");

  const fresh = await createCredentials(next);
  if (session.role === "teacher") updateDb((d) => ({ ...d, teacher: { ...d.teacher, ...fresh } }));
  else updateStudent(session.studentId, (s) => ({ ...s, ...fresh }));
  return ok(undefined);
}

// ---------------------------------------------------------------------------
// Teacher: account management
// ---------------------------------------------------------------------------

export async function resetStudentPassword(studentId: string): Promise<ActionResult<{ password: string }>> {
  if (!isTeacher()) return FORBIDDEN;
  const password = generatePassword();
  const fresh = await createCredentials(password);
  updateStudent(studentId, (s) => ({ ...s, ...fresh }));
  return ok({ password });
}

export async function createStudent(input: {
  name: string;
  username: string;
  password: string;
}): Promise<ActionResult<{ username: string; password: string }>> {
  const state = getState();
  if (!state) return NOT_READY;
  if (!isTeacher()) return FORBIDDEN;

  const name = input.name.trim();
  const username = input.username.trim().toLowerCase();
  if (!name) return fail("اسم الطالب مطلوب.");
  if (!USERNAME_PATTERN.test(username)) {
    return fail("اسم المستخدم: 3–20 حرفاً إنجليزياً صغيراً أو أرقاماً أو (_ .) فقط.");
  }
  if (state.db.students.some((s) => s.username === username)) return fail("اسم المستخدم مستخدم مسبقاً.");
  const invalid = validateNewPassword(input.password);
  if (invalid) return fail(invalid);

  const student: Student = {
    id: uid(),
    name,
    username,
    createdAt: dayKey(),
    books: [],
    sessions: [],
    ...(await createCredentials(input.password)),
  };
  updateDb((db) => ({ ...db, students: [...db.students, student] }));
  return ok({ username, password: input.password });
}

/** Removes the account and the student's book suggestions. */
export function deleteStudent(studentId: string): ActionResult {
  if (!isTeacher()) return FORBIDDEN;
  updateDb((db) => ({
    ...db,
    students: db.students.filter((s) => s.id !== studentId),
    requests: db.requests.filter((r) => r.studentId !== studentId),
  }));
  return ok(undefined);
}

export function updateRequestStatus(requestId: string, status: RequestStatus) {
  if (!isTeacher()) return;
  updateDb((db) => ({ ...db, requests: db.requests.map((r) => (r.id === requestId ? { ...r, status } : r)) }));
}

// ---------------------------------------------------------------------------
// Teacher: library catalog
// ---------------------------------------------------------------------------

export const MAX_BOOK_PAGES = 5000;

export function addLibraryBook(input: LibraryBookInput): ActionResult<LibraryBook> {
  if (!getState()) return NOT_READY;
  if (!isTeacher()) return FORBIDDEN;

  const title = input.title.trim();
  const author = input.author.trim();
  const pages = Math.round(input.pages);
  if (!title) return fail("عنوان الكتاب مطلوب.");
  if (!author) return fail("اسم المؤلف مطلوب.");
  if (!Number.isFinite(pages) || pages < 1 || pages > MAX_BOOK_PAGES) {
    return fail(`عدد الصفحات يجب أن يكون بين 1 و${MAX_BOOK_PAGES}.`);
  }

  const book: LibraryBook = { id: uid(), title, author, pages, description: input.description.trim(), createdAt: dayKey() };
  updateDb((db) => ({ ...db, library: [book, ...db.library] }));
  return ok(book);
}

/** Removes a book from the catalog. Copies already on students' lists are kept. */
export function deleteLibraryBook(bookId: string) {
  if (!isTeacher()) return;
  updateDb((db) => ({ ...db, library: db.library.filter((b) => b.id !== bookId) }));
}

// ---------------------------------------------------------------------------
// Student: reading
// ---------------------------------------------------------------------------

export function addBookRequest(input: BookRequestInput) {
  const studentId = currentStudentId();
  if (!studentId) return;
  const requestId = uid();
  const book: Book = { ...input, id: uid(), status: "want_to_read", addedBy: "student", requestId };

  updateDb((db) => ({
    ...db,
    requests: [{ ...input, id: requestId, studentId, status: "pending", createdAt: dayKey() }, ...db.requests],
    students: db.students.map((s) => (s.id === studentId ? { ...s, books: [book, ...s.books] } : s)),
  }));
}

export function addBookFromLibrary(libraryBookId: string): ActionResult {
  const state = getState();
  const studentId = currentStudentId();
  if (!state || !studentId) return FORBIDDEN;
  const entry = state.db.library.find((b) => b.id === libraryBookId);
  if (!entry) return fail("لم يعد هذا الكتاب متاحاً في المكتبة.");
  const student = state.db.students.find((s) => s.id === studentId);
  if (student?.books.some((b) => b.catalogId === libraryBookId)) return fail("الكتاب موجود في قائمتك مسبقاً.");

  const { title, author, pages } = entry;
  const book: Book = {
    id: uid(),
    catalogId: libraryBookId,
    title,
    author,
    pages,
    category: LIBRARY_CATEGORY,
    status: "want_to_read",
    addedBy: "system",
  };
  updateStudent(studentId, (s) => ({ ...s, books: [book, ...s.books] }));
  return ok(undefined);
}

export function updateBook(bookId: string, patch: Partial<Pick<Book, "status" | "rating" | "note">>) {
  const studentId = currentStudentId();
  if (!studentId) return;
  updateStudent(studentId, (s) => ({ ...s, books: s.books.map((b) => (b.id === bookId ? { ...b, ...patch } : b)) }));
}

export function logReadingSession(minutes: number) {
  const studentId = currentStudentId();
  if (!studentId || minutes < 1) return;
  updateStudent(studentId, (s) => ({
    ...s,
    sessions: [...s.sessions, { id: uid(), date: dayKey(), minutes: Math.round(minutes) }],
  }));
}
