export function StatPill({ value, label, note }: { value: string; label: string; note: string }) {
  return (
    <div className="border-l border-line pl-5">
      <div className="font-mono text-3xl text-ink">{value}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{label}</div>
      <div className="mt-1 text-xs text-muted">{note}</div>
    </div>
  );
}
