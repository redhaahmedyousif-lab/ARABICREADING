import type { Book, Database } from "@/types";

/** Shape of a v2 book: rating/note lived directly on the book. */
type BookV2 = Omit<Book, "review" | "completedAt"> & { rating?: number; note?: string };
type DatabaseV2 = Omit<Database, "version" | "challenge" | "students"> & {
  version: 2;
  students: (Omit<Database["students"][number], "books"> & { books: BookV2[] })[];
};

function migrateBookV2({ rating, note, ...book }: BookV2): Book {
  // Reviews written before the approval step existed are kept as approved.
  if (!rating) return book;
  return { ...book, review: { rating, summary: note ?? "", status: "approved", submittedAt: "" } };
}

/**
 * Upgrades stored data to the current schema, keeping accounts and progress.
 * Returns null for data it can't read, which is then re-seeded.
 */
export function migrate(raw: unknown): Database | null {
  const data = raw as { version?: number } | null;
  if (!data) return null;
  if (data.version === 3) return data as Database;
  if (data.version === 2) {
    const v2 = data as DatabaseV2;
    return {
      ...v2,
      version: 3,
      challenge: null,
      students: v2.students.map((s) => ({ ...s, books: s.books.map(migrateBookV2) })),
    };
  }
  return null;
}
