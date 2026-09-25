import type { BadgeTone } from "@/components/ui/badge";
import type { ReadingStatus, RequestStatus } from "@/types";

export const READING_STATUS: Record<ReadingStatus, { label: string; tone: BadgeTone }> = {
  want_to_read: { label: "أريد قراءته", tone: "warning" },
  reading: { label: "قيد القراءة", tone: "info" },
  completed: { label: "تمت القراءة", tone: "success" },
};

export const REQUEST_STATUS: Record<RequestStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: "بانتظار الاعتماد", tone: "warning" },
  approved: { label: "معتمد", tone: "success" },
  rejected: { label: "مرفوض", tone: "danger" },
};
