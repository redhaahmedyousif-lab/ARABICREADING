"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { REQUEST_STATUS } from "@/lib/constants";
import { Badge, Card, CardContent, CardHeader, CardTitle, EmptyState } from "@/components/ui";

export function RecentRequestsCard({ limit = 4 }: { limit?: number }) {
  const { requests } = useApp();
  const recent = requests.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>أحدث مقترحات الكتب</CardTitle>
        <Link href="/teacher/dashboard" className="text-xs font-semibold text-primary hover:underline">
          عرض الكل
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState icon={Inbox} title="لا توجد مقترحات بعد" />
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((req) => (
              <li key={req.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{req.title}</p>
                  <p className="truncate text-xs text-muted">
                    {req.author} • {req.studentName}
                  </p>
                </div>
                <Badge tone={REQUEST_STATUS[req.status].tone} dot>
                  {REQUEST_STATUS[req.status].label}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
