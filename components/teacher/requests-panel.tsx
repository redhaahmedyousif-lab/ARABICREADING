"use client";

import { useState } from "react";
import { Check, Inbox, X } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { REQUEST_STATUS } from "@/lib/constants";
import type { RequestStatus } from "@/types";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, SegmentedTabs, type TabOption } from "@/components/ui";

type Filter = "all" | RequestStatus;

export function RequestsPanel() {
  const { db, actions } = useSignedIn();
  const [filter, setFilter] = useState<Filter>("pending");

  const names = new Map(db.students.map((s) => [s.id, s.name]));
  const { requests } = db;
  const count = (s: RequestStatus) => requests.filter((r) => r.status === s).length;
  const visible = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const tabs: TabOption<Filter>[] = [
    { value: "pending", label: "المعلقة", count: count("pending") },
    { value: "approved", label: "المعتمدة", count: count("approved") },
    { value: "rejected", label: "المرفوضة", count: count("rejected") },
    { value: "all", label: "الكل", count: requests.length },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>اقتراحات الكتب</CardTitle>
          <CardDescription className="text-xs">الكتاب المعتمد يُضاف إلى المكتبة ويظهر لجميع الطلاب.</CardDescription>
        </div>
        <SegmentedTabs label="تصفية الطلبات" options={tabs} value={filter} onChange={setFilter} />
      </CardHeader>
      <CardContent>
        {visible.length === 0 ? (
          <EmptyState icon={Inbox} title="لا توجد طلبات" description="لا توجد طلبات ضمن هذا التصنيف حالياً." />
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((req) => (
              <li key={req.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-foreground">{req.title}</h3>
                    <Badge>{names.get(req.studentId) ?? "طالب محذوف"}</Badge>
                  </div>
                  <p className="text-xs text-muted">
                    {req.author} • {req.pages} صفحة • {req.category} • {req.createdAt}
                  </p>
                  {req.description && <p className="text-sm text-muted">{req.description}</p>}
                </div>

                {req.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button variant="success" size="sm" onClick={() => actions.updateRequestStatus(req.id, "approved")}>
                      <Check className="size-3.5" aria-hidden />
                      اعتماد وإضافة للمكتبة
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => actions.updateRequestStatus(req.id, "rejected")}>
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
  );
}
