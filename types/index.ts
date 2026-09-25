export type Role = "teacher" | "student";

export type ReadingStatus = "completed" | "reading" | "want_to_read";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface Book {
  id: string;
  title: string;
  author: string;
  pages: number;
  category: string;
  status: ReadingStatus;
  addedBy: "system" | "student";
  /** Set when the student suggested this book to the teacher. */
  requestId?: string;
  note?: string;
  rating?: number;
}

export interface BookRequestInput {
  title: string;
  author: string;
  pages: number;
  category: string;
}

export interface BookRequest extends BookRequestInput {
  id: string;
  studentId: string;
  status: RequestStatus;
  createdAt: string;
}

/** A completed reading-timer session. `date` is a local calendar day (YYYY-MM-DD). */
export interface ReadingSession {
  id: string;
  date: string;
  minutes: number;
}

export interface Credentials {
  passwordHash: string;
  salt: string;
}

export interface Student extends Credentials {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  books: Book[];
  sessions: ReadingSession[];
}

export interface Database {
  version: 1;
  teacher: Credentials;
  students: Student[];
  requests: BookRequest[];
}

export type Session = { role: "teacher" } | { role: "student"; studentId: string };

export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

export interface LibraryFile {
  id: number;
  title: string;
  description: string;
  size: string;
  uploadedBy: string;
  date: string;
}
