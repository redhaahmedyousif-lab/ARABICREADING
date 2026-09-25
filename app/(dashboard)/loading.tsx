export default function Loading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="جارٍ التحميل">
      <div className="h-9 w-64 rounded-xl bg-surface-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-surface-muted" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-surface-muted" />
    </div>
  );
}
