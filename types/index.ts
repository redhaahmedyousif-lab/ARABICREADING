export type ReadingStatus = "completed" | "reading" | "want_to_read";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  category: string;
  status: ReadingStatus;
  addedBy: "system" | "student";
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
  id: number;
  studentName: string;
  status: RequestStatus;
  createdAt: string;
}

export interface LibraryFile {
  id: number;
  title: string;
  description: string;
  size: string;
  uploadedBy: string;
  date: string;
}
