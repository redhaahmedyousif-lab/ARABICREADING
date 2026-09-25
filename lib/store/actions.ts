import type { ActionResult, Book, BookRequestInput, Database, RequestStatus, Session, Student } from "@/types";
import { MIN_PASSWORD_LENGTH, USERNAME_PATTERN, createCredentials, generatePassword, uid, verifyPassword } from "@/lib/auth/crypto";
import { dayKey } from "@/lib/dates";
import { getState, setState } from "./db";

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
  if (session.role === "teacher") updateDb((d) => ({ ...d, teacher: fresh }));
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

export function updateRequestStatus(requestId: string, status: RequestStatus) {
  if (!isTeacher()) return;
  updateDb((db) => ({ ...db, requests: db.requests.map((r) => (r.id === requestId ? { ...r, status } : r)) }));
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
