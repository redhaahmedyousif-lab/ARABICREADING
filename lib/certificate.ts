/** Draws an Arabic certificate of appreciation (شهادة تقدير) onto a canvas. */

export interface CertificateData {
  /** ASCII identifier for the download file name (some browsers drop non-ASCII names). */
  fileSlug: string;
  studentName: string;
  levelTitle: string;
  pagesRead: number;
  completedBooks: number;
  rank: number;
  teacherName: string;
  date: string;
}

// A4 landscape at ~150 dpi.
export const CERT_WIDTH = 1754;
export const CERT_HEIGHT = 1240;

const COLORS = {
  paper: "#fbf8f1",
  ink: "#1e1b4b",
  muted: "#57534e",
  accent: "#4f46e5",
  gold: "#b8862b",
  goldSoft: "#e9d5a1",
};

/** Arabic-Indic digits read naturally inside Arabic prose on the certificate. */
const arNum = (n: number | string) => new Intl.NumberFormat("ar-EG", { useGrouping: false }).format(Number(n));

const RANK_WORDS = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"];

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawCorner(ctx: CanvasRenderingContext2D, x: number, y: number, sx: number, sy: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 90);
  ctx.lineTo(0, 0);
  ctx.lineTo(90, 0);
  ctx.stroke();
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.arc(22, 22, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** `fontFamily` should be the page's loaded Arabic font stack (e.g. next/font's Cairo). */
export async function drawCertificate(canvas: HTMLCanvasElement, data: CertificateData, fontFamily: string) {
  // Preload only the primary face: fallback faces (e.g. next/font's local() "Cairo Fallback")
  // can reject when the local font is missing, and a font problem must never block the certificate.
  const primary = fontFamily.split(",")[0].trim();
  await Promise.all([document.fonts.load(`800 64px ${primary}`), document.fonts.load(`400 32px ${primary}`)]).catch(() => {});

  canvas.width = CERT_WIDTH;
  canvas.height = CERT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = CERT_WIDTH;
  const cx = W / 2;
  const font = (weight: number, size: number) => `${weight} ${size}px ${fontFamily}`;

  // Paper and frames
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, W, CERT_HEIGHT);
  ctx.strokeStyle = COLORS.accent;
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, W - 80, CERT_HEIGHT - 80);
  ctx.strokeStyle = COLORS.goldSoft;
  ctx.lineWidth = 3;
  ctx.strokeRect(72, 72, W - 144, CERT_HEIGHT - 144);
  drawCorner(ctx, 96, 96, 1, 1);
  drawCorner(ctx, W - 96, 96, -1, 1);
  drawCorner(ctx, 96, CERT_HEIGHT - 96, 1, -1);
  drawCorner(ctx, W - 96, CERT_HEIGHT - 96, -1, -1);

  ctx.direction = "rtl";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = COLORS.accent;
  ctx.font = font(700, 30);
  ctx.fillText("منصة تحدي القراءة", cx, 190);

  ctx.fillStyle = COLORS.ink;
  ctx.font = font(800, 110);
  ctx.fillText("شهادة تقدير", cx, 330);

  // Gold rule with a diamond
  ctx.strokeStyle = COLORS.gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 260, 385);
  ctx.lineTo(cx + 260, 385);
  ctx.stroke();
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.moveTo(cx, 370);
  ctx.lineTo(cx + 15, 385);
  ctx.lineTo(cx, 400);
  ctx.lineTo(cx - 15, 385);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLORS.muted;
  ctx.font = font(400, 38);
  ctx.fillText("تُمنح هذه الشهادة بكل فخر واعتزاز إلى", cx, 480);

  ctx.fillStyle = COLORS.accent;
  ctx.font = font(800, 96);
  ctx.fillText(data.studentName, cx, 610);

  const body =
    // Gender-neutral wording: the certificate can go to any student.
    `تقديراً للتميّز في تحدي القراءة وإحراز المركز ${RANK_WORDS[data.rank - 1] ?? arNum(data.rank)} ` +
    `في لوحة الصدارة، بإنجاز ${arNum(data.completedBooks)} كتب بمجموع ${arNum(data.pagesRead)} صفحة، ` +
    `ونيل لقب «${data.levelTitle}». مع أطيب التمنيات بدوام التفوق وحب القراءة.`;
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(400, 36);
  wrapLines(ctx, body, W - 520).forEach((line, i) => ctx.fillText(line, cx, 720 + i * 60));

  // Footer: date (left) and signature (right) — positions are visual, not logical.
  const footerY = 1030;
  ctx.strokeStyle = COLORS.muted;
  ctx.lineWidth = 2;
  for (const x of [W - 440, 440]) {
    ctx.beginPath();
    ctx.moveTo(x - 190, footerY);
    ctx.lineTo(x + 190, footerY);
    ctx.stroke();
  }
  ctx.fillStyle = COLORS.ink;
  ctx.font = font(700, 36);
  ctx.fillText(data.teacherName, W - 440, footerY - 22);
  ctx.fillText(data.date, 440, footerY - 22);
  ctx.fillStyle = COLORS.muted;
  ctx.font = font(400, 28);
  ctx.fillText("المعلم المشرف", W - 440, footerY + 48);
  ctx.fillText("التاريخ", 440, footerY + 48);

  // Seal
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.arc(cx, footerY - 10, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.paper;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, footerY - 10, 56, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = COLORS.paper;
  ctx.font = font(800, 30);
  ctx.fillText("متميّز", cx, footerY + 2);
}
