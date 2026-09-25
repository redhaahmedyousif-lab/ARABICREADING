"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "./button";

export function CopyButton({ value, label = "نسخ" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (permissions / insecure context) — the value is still visible to copy manually.
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={copy} aria-label={label}>
      {copied ? <Check className="size-3.5 text-success" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      {copied ? "تم النسخ" : label}
    </Button>
  );
}
