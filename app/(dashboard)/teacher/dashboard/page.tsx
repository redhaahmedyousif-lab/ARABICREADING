"use client";

import { useState } from "react";
import { Check, CheckCircle2, Clock, Inbox, X, XCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { REQUEST_STATUS } from "@/lib/constants";
import type { RequestStatus } from "@/types";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  PageHeader,
  SegmentedTabs,
  StatCard,
  type TabOption,
} from "@/components/ui";

type Filter = "all" | RequestStatus;

export default function TeacherDashboard() {
  const { requests, updateBookStatus } = useApp();
  const [filter, setFilter] = useState<Filter>("pending");

  const count = (s: RequestStatus) => requests.filter((r) => r.status === s).length;
  const visible = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const tabs: TabOption<Filter>[] = [
    { value: "pending", label: "المعلقة", count: count("pending") },
    { value: "approved", label: "المعتمدة", count: count("approved") },
    { value: "rejected", label: "المرفوضة", count: count("rejected") },
    { value: "all", label: "الكل", count: requests.length },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="لوحة المعلم"
        title="إدارة واعتماد الكتب"
        description="تصلك مقترحات الطلاب لحظياً؛ اعتمد الكتب لتُضاف إلى مسار التحدي."
      />

      <section aria-label="إحصاءات" className="grid gap-4 sm:grid-cols-3">
        <StatCard label="بانتظار المراجعة" value={count("pending")} icon={Clock} tone="warning" />
        <StatCard label="الكتب المعتمدة" value={count("approved")} icon={CheckCircle2} tone="success" />
        <StatCard label="المرفوضة" value={count("rejected")} icon={XCircle} tone="danger" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>مقترحات الطلاب</CardTitle>
          <SegmentedTabs label="تصفية الطلبات" options={tabs} value={filter} onChange={setFilter} />
        </CardHeader>
        <CardContent>
          {visible.length === 0 ? (
            <EmptyState icon={Inbox} title="لا توجد طلبات" description="لا توجد طلبات ضمن هذا التصنيف حالياً." />
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-foreground">{req.title}</h3>
                      <Badge>{req.studentName}</Badge>
                    </div>
                    <p className="text-xs text-muted">
                      {req.author} • {req.pages} صفحة • {req.category} • {req.createdAt}
                    </p>
                  </div>

                  {req.status === "pending" ? (
                    <div className="flex gap-2">
                      <Button variant="success" size="sm" onClick={() => updateBookStatus(req.id, "approved")}>
                        <Check className="size-3.5" aria-hidden />
                        اعتماد
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => updateBookStatus(req.id, "rejected")}>
                        <X className="size-3.5" aria-hidden />
                        رفض
                      </Button>
                    </div>
                  ) : (
                    <Badge tone={REQUEST_STATUS[req.status].tone} dot className="self-start md:self-auto">
                      {REQUEST_STATUS[req.status].label}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
