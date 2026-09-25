import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div className="space-y-4">
        <p className="text-6xl font-extrabold text-primary">404</p>
        <h1 className="text-xl font-bold text-foreground">الصفحة غير موجودة</h1>
        <p className="text-sm text-muted">ربما نُقلت الصفحة أو أن الرابط غير صحيح.</p>
        <Link href="/" className={buttonStyles()}>
          العودة إلى الرئيسية
        </Link>
      </div>
    </div>
  );
}
