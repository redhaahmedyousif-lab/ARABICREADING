"use client";

import { useState } from "react";
import { KeyRound, RefreshCw, Trash2, UserPlus, Users } from "lucide-react";
import { useSignedIn } from "@/context/AppContext";
import { MIN_PASSWORD_LENGTH, generatePassword } from "@/lib/auth/crypto";
import { getStudentStats } from "@/lib/stats";
import { LevelBadge } from "@/components/dashboard/level-badge";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CopyButton,
  EmptyState,
  Field,
  Input,
} from "@/components/ui";

interface IssuedCredentials {
  name: string;
  username: string;
  password: string;
}

/** One-time display of freshly issued credentials. */
function CredentialsNotice({ creds, onDismiss }: { creds: IssuedCredentials; onDismiss: () => void }) {
  const text = `اسم المستخدم: ${creds.username}\nكلمة المرور: ${creds.password}`;
  return (
    <Alert tone="success">
      <div className="space-y-2">
        <p>
          بيانات دخول <strong>{creds.name}</strong> — سلّمها للطالب، فلن تظهر كلمة المرور مرة أخرى.
        </p>
        <div dir="ltr" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 font-mono text-xs text-foreground">
          <span>user: {creds.username}</span>
          <span>password: {creds.password}</span>
        </div>
        <div className="flex justify-end gap-1">
          <CopyButton value={text} />
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            إخفاء
          </Button>
        </div>
      </div>
    </Alert>
  );
}

function CreateStudentForm({ onCreated }: { onCreated: (creds: IssuedCredentials) => void }) {
  const { actions } = useSignedIn();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(() => generatePassword());
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    const result = await actions.createStudent({ name, username, password });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onCreated({ name: name.trim(), ...result.data });
    setName("");
    setUsername("");
    setPassword(generatePassword());
  };

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-1">
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="size-5 text-primary" aria-hidden />
          إنشاء حساب طالب
        </CardTitle>
        <CardDescription>تُولَّد كلمة مرور مؤقتة تلقائياً ويمكنك تعديلها.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="اسم الطالب">
            {(id) => (
              <Input id={id} required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: ليلى محمود" />
            )}
          </Field>
          <Field label="اسم المستخدم" hint="أحرف إنجليزية صغيرة وأرقام و(_ .) — من 3 إلى 20 حرفاً.">
            {(id) => (
              <Input
                id={id}
                required
                dir="ltr"
                className="text-start"
                autoCapitalize="none"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="layla"
              />
            )}
          </Field>
          <Field label="كلمة المرور المؤقتة">
            {(id) => (
              <div className="flex gap-2">
                <Input
                  id={id}
                  required
                  dir="ltr"
                  minLength={MIN_PASSWORD_LENGTH}
                  className="text-start font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setPassword(generatePassword())}
                  aria-label="توليد كلمة مرور جديدة"
                >
                  <RefreshCw className="size-4" aria-hidden />
                </Button>
              </div>
            )}
          </Field>
          {error && <Alert tone="danger">{error}</Alert>}
          <Button type="submit" className="w-full" disabled={pending}>
            <UserPlus className="size-4" aria-hidden />
            {pending ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function StudentsPanel() {
  const { db, actions } = useSignedIn();
  const [issued, setIssued] = useState<IssuedCredentials | null>(null);
  // Destructive row actions need a second click; only one row confirms at a time.
  const [confirming, setConfirming] = useState<{ id: string; action: "reset" | "delete" } | null>(null);
  const [notice, setNotice] = useState("");

  const resetPassword = async (studentId: string) => {
    const student = db.students.find((s) => s.id === studentId);
    const result = await actions.resetStudentPassword(studentId);
    setConfirming(null);
    if (result.ok && student) setIssued({ name: student.name, username: student.username, password: result.data.password });
  };

  const deleteStudent = (studentId: string) => {
    const student = db.students.find((s) => s.id === studentId);
    const result = actions.deleteStudent(studentId);
    setConfirming(null);
    if (result.ok && student) {
      if (issued?.username === student.username) setIssued(null);
      setNotice(`حُذف حساب ${student.name}.`);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>حسابات الطلاب</CardTitle>
          <span className="text-xs text-muted tabular-nums">{db.students.length} طالب</span>
        </CardHeader>
        <CardContent className="space-y-4">
          {issued && <CredentialsNotice creds={issued} onDismiss={() => setIssued(null)} />}
          {notice && !issued && <Alert tone="info">{notice}</Alert>}

          {db.students.length === 0 ? (
            <EmptyState icon={Users} title="لا يوجد طلاب" description="أنشئ أول حساب طالب من النموذج." />
          ) : (
            <div className="-mx-5 overflow-x-auto sm:-mx-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-subtle">
                    <th scope="col" className="px-5 pb-3 text-start font-medium sm:px-6">
                      الطالب
                    </th>
                    <th scope="col" className="hidden px-3 pb-3 text-center font-medium sm:table-cell">
                      كتب منجزة
                    </th>
                    <th scope="col" className="hidden px-3 pb-3 text-center font-medium sm:table-cell">
                      التتابع
                    </th>
                    <th scope="col" className="hidden px-3 pb-3 text-center font-medium md:table-cell">
                      النقاط
                    </th>
                    <th scope="col" className="px-5 pb-3 text-end font-medium sm:px-6">
                      <span className="sr-only">إجراءات</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {db.students.map((student) => {
                    const stats = getStudentStats(student, db.requests);
                    const pending = confirming?.id === student.id ? confirming.action : null;
                    return (
                      <tr key={student.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-3 sm:px-6">
                          <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-foreground">{student.name}</p>
                              <LevelBadge pagesRead={stats.pagesRead} />
                            </div>
                          <p dir="ltr" className="text-end font-mono text-xs text-subtle">
                            @{student.username}
                          </p>
                        </td>
                        <td className="hidden px-3 py-3 text-center text-muted tabular-nums sm:table-cell">
                          {stats.completedBooks}
                        </td>
                        <td className="hidden px-3 py-3 text-center text-muted tabular-nums sm:table-cell">
                          🔥 {stats.currentStreak}
                        </td>
                        <td className="hidden px-3 py-3 text-center font-semibold text-foreground tabular-nums md:table-cell">
                          {stats.points}
                        </td>
                        <td className="px-5 py-3 sm:px-6">
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {pending ? (
                              <>
                                <span className="text-xs text-muted">
                                  {pending === "delete" ? "حذف الحساب وكل بياناته؟" : "إصدار كلمة مرور جديدة؟"}
                                </span>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => (pending === "delete" ? deleteStudent(student.id) : resetPassword(student.id))}
                                >
                                  {pending === "delete" ? "تأكيد الحذف" : "تأكيد"}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setConfirming(null)}>
                                  إلغاء
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setConfirming({ id: student.id, action: "reset" })}
                                >
                                  <KeyRound className="size-3.5" aria-hidden />
                                  إعادة تعيين كلمة المرور
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => setConfirming({ id: student.id, action: "delete" })}
                                  aria-label={`حذف ${student.name}`}
                                >
                                  <Trash2 className="size-3.5" aria-hidden />
                                  حذف
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <aside>
        <CreateStudentForm onCreated={setIssued} />
      </aside>
    </div>
  );
}
