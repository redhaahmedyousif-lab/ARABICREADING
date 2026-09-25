"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/crypto";
import { Alert, Button, Field, PasswordInput } from "@/components/ui";

const EMPTY = { current: "", next: "", confirm: "" };

export function ChangePasswordForm() {
  const { actions } = useApp();
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<{ tone: "success" | "danger"; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (values.next !== values.confirm) {
      setStatus({ tone: "danger", message: "تأكيد كلمة المرور غير مطابق." });
      return;
    }
    setPending(true);
    const result = await actions.changePassword(values.current, values.next);
    setPending(false);
    if (result.ok) {
      setValues(EMPTY);
      setStatus({ tone: "success", message: "تم تغيير كلمة المرور بنجاح." });
    } else {
      setStatus({ tone: "danger", message: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="كلمة المرور الحالية">
        {(id) => <PasswordInput id={id} required autoComplete="current-password" value={values.current} onChange={set("current")} />}
      </Field>
      <Field label="كلمة المرور الجديدة" hint={`${MIN_PASSWORD_LENGTH} أحرف على الأقل.`}>
        {(id) => (
          <PasswordInput id={id} required minLength={MIN_PASSWORD_LENGTH} autoComplete="new-password" value={values.next} onChange={set("next")} />
        )}
      </Field>
      <Field label="تأكيد كلمة المرور الجديدة">
        {(id) => <PasswordInput id={id} required autoComplete="new-password" value={values.confirm} onChange={set("confirm")} />}
      </Field>
      {status && <Alert tone={status.tone}>{status.message}</Alert>}
      <Button type="submit" disabled={pending}>
        {pending ? "جارٍ الحفظ..." : "تحديث كلمة المرور"}
      </Button>
    </form>
  );
}
