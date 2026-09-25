import type { Book, Database, LibraryBook, Student } from "@/types";
import { createCredentials, uid } from "@/lib/auth/crypto";
import { dayKey } from "@/lib/dates";

export const TEACHER_NAME = "أستاذ حسن بو سهيل";

/** Default credentials — shown on the login page while the app runs on mock auth. */
export const DEFAULT_TEACHER_PASSWORD = "teacher123";

export const DEFAULT_STUDENTS = [{ name: "رضا الجبوري", username: "redha", password: "redha123" }] as const;

/** Category given to a student's book when it comes from the library catalog. */
export const LIBRARY_CATEGORY = "من المكتبة";

const LIBRARY: Omit<LibraryBook, "id" | "createdAt">[] = [
  { title: "لاعب الشطرنج", author: "ستيفان زفايغ", pages: 90, description: "رواية قصيرة عن العزلة والهوس والتركيز، تدور على متن سفينة في رحلة عبر المحيط." },
  { title: "الإنسان يبحث عن معنى", author: "فيكتور فرانكل", pages: 120, description: "تجربة طبيب نفسي في معسكرات الاعتقال، وكيف يصنع الإنسان معنى لحياته في أقسى الظروف." },
  { title: "المعطف", author: "نيكولاي غوغول", pages: 70, description: "قصة موظف بسيط ومعطفه الجديد، من أهم نصوص الأدب الروسي القصير." },
  { title: "الشيخ والبحر", author: "إرنست همنغواي", pages: 110, description: "صراع صياد عجوز مع سمكة عملاقة؛ حكاية عن الصبر والكرامة." },
  { title: "الأمير الصغير", author: "أنطوان دو سانت إكزوبيري", pages: 96, description: "حكاية فلسفية بسيطة العبارة عميقة المعنى عن الصداقة والمسؤولية." },
  { title: "الأيام", author: "طه حسين", pages: 130, description: "سيرة عميد الأدب العربي في طفولته وصباه بأسلوب أدبي فريد." },
];

/** Books the default student starts with, by index into LIBRARY. */
const STARTER_BOOKS = [0, 1, 2];

export async function createSeedDb(): Promise<Database> {
  const [teacherCreds, ...studentCreds] = await Promise.all([
    createCredentials(DEFAULT_TEACHER_PASSWORD),
    ...DEFAULT_STUDENTS.map((s) => createCredentials(s.password)),
  ]);

  const today = dayKey();
  const library: LibraryBook[] = LIBRARY.map((book) => ({ ...book, id: uid(), createdAt: today }));

  const starterBooks = (): Book[] =>
    STARTER_BOOKS.map((i) => library[i]).map(({ id, title, author, pages }) => ({
      id: uid(),
      catalogId: id,
      title,
      author,
      pages,
      category: LIBRARY_CATEGORY,
      status: "want_to_read",
      addedBy: "system",
    }));

  const students: Student[] = DEFAULT_STUDENTS.map((s, i) => ({
    id: uid(),
    name: s.name,
    username: s.username,
    createdAt: today,
    books: starterBooks(),
    sessions: [],
    ...studentCreds[i],
  }));

  return {
    version: 2,
    teacher: { name: TEACHER_NAME, ...teacherCreds },
    students,
    requests: [],
    library,
  };
}
