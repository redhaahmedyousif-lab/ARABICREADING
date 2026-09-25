"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Printer } from "lucide-react";
import { type CertificateData, drawCertificate } from "@/lib/certificate";
import { Alert, Button, Dialog, buttonStyles } from "@/components/ui";

interface CertificateDialogProps {
  data: CertificateData | null;
  onClose: () => void;
}

/** Prints an image through a hidden iframe, so only the certificate is on the page. */
function printImage(src: string) {
  const frame = document.createElement("iframe");
  frame.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(
    `<!doctype html><html><head><title>شهادة تقدير</title><style>@page{size:A4 landscape;margin:0}html,body{margin:0}img{width:100%;height:100vh;object-fit:contain;display:block}</style></head><body><img src="${src}"></body></html>`,
  );
  doc.close();
  const img = doc.querySelector("img");
  const go = () => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    setTimeout(() => frame.remove(), 1000);
  };
  if (img?.complete) go();
  else img?.addEventListener("load", go);
}

export function CertificateDialog({ data, onClose }: CertificateDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!data || !canvas) return;
    let cancelled = false;
    let url: string | null = null;
    const fontFamily = getComputedStyle(document.body).fontFamily;
    drawCertificate(canvas, data, fontFamily)
      // Blob URL (not a data: URL) so the download keeps its file name and stays light.
      .then(() => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png")))
      .then((blob) => {
        if (cancelled) return;
        if (!blob) throw new Error("empty canvas");
        url = URL.createObjectURL(blob);
        setImageUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError("تعذّر إنشاء الشهادة. حاول مرة أخرى.");
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
      setImageUrl(null);
      setError("");
    };
  }, [data]);

  const fileName = `certificate-${data?.fileSlug ?? "student"}.png`;

  return (
    <Dialog open={data !== null} onClose={onClose} title="شهادة تقدير">
      <canvas ref={canvasRef} hidden />
      {error && <Alert tone="danger">{error}</Alert>}
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- generated blob URL, not an optimizable asset
        <img
          src={imageUrl}
          alt={`شهادة تقدير للطالب ${data?.studentName ?? ""}`}
          className="w-full rounded-xl border border-border shadow-card"
        />
      ) : (
        !error && <div className="aspect-[1754/1240] w-full animate-pulse rounded-xl bg-surface-muted" aria-busy="true" />
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" disabled={!imageUrl} onClick={() => imageUrl && printImage(imageUrl)}>
          <Printer className="size-4" aria-hidden />
          طباعة / حفظ PDF
        </Button>
        {imageUrl ? (
          <a href={imageUrl} download={fileName} className={buttonStyles()}>
            <Download className="size-4" aria-hidden />
            تنزيل الشهادة (PNG)
          </a>
        ) : (
          <Button disabled>
            <Download className="size-4" aria-hidden />
            تنزيل الشهادة (PNG)
          </Button>
        )}
      </div>
    </Dialog>
  );
}
