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
  /** Set when the book was added from the library catalog. */
  catalogId?: string;
  /** Set when the student suggested this book to the teacher. */
  requestId?: string;
  /** Local day the book was marked completed (drives weekly challenges). */
  completedAt?: string;
  review?: BookReview;
}

/** Review / approval lifecycle shared by suggestions and reviews. */
export type ApprovalStatus = "pending" | "approved" | "rejected";

/** A student's rating + short summary of a completed book; shown to others once approved. */
export interface BookReview {
  rating: number;
  summary: string;
  status: ApprovalStatus;
  submittedAt: string;
}

export interface BookRequestInput {
  title: string;
  author: string;
  pages: number;
  category: string;
  description?: string;
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

/** A book in the shared library catalog, managed by the teacher. */
export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  pages: number;
  description: string;
  createdAt: string;
  /** Student whose approved suggestion added this book. */
  suggestedBy?: string;
}

export type LibraryBookInput = Omit<LibraryBook, "id" | "createdAt" | "suggestedBy">;

export type ChallengeUnit = "pages" | "minutes" | "books";

/** Teacher-set weekly target shown as a banner to every student. */
export interface WeeklyChallenge {
  title: string;
  theme: string;
  unit: ChallengeUnit;
  target: number;
  /** Inclusive local-day range (YYYY-MM-DD). */
  startDate: string;
  endDate: string;
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

export interface Teacher extends Credentials {
  name: string;
}

export interface Database {
  version: 3;
  teacher: Teacher;
  students: Student[];
  requests: BookRequest[];
  library: LibraryBook[];
  challenge: WeeklyChallenge | null;
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
