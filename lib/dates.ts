/** Local calendar-day key (YYYY-MM-DD). Streaks follow the reader's own days, not UTC. */
export function dayKey(date: Date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(key: string, days: number) {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + days));
}

/** The last `n` day keys, oldest first, ending with `today`. */
export function lastDays(n: number, today = dayKey()) {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}

const weekdayFormatter = new Intl.DateTimeFormat("ar", { weekday: "short" });

export function weekdayLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return weekdayFormatter.format(new Date(y, m - 1, d));
}

export function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
