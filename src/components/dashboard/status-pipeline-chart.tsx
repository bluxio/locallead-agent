import type { LeadStatus } from "@/types/lead";

const ORDER: LeadStatus[] = ["New", "Contacted", "Booked", "Lost"];

const BAR: Record<LeadStatus, string> = {
  New: "bg-primary/90",
  Contacted: "bg-amber-500/85 dark:bg-amber-500/70",
  Booked: "bg-emerald-600/85 dark:bg-emerald-500/75",
  Lost: "bg-muted-foreground/35",
};

type Props = {
  counts: Record<LeadStatus, number>;
};

/** Width-proportional bars — simple stage mix. */
export function StatusPipelineChart({ counts }: Props) {
  const total = ORDER.reduce((s, k) => s + counts[k], 0) || 1;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        How jobs are spread across your stages (including Lost so nothing
        hides).
      </p>
      <ul className="space-y-2.5 pt-1">
        {ORDER.map((status) => {
          const n = counts[status];
          const pct = Math.round((n / total) * 1000) / 10;
          const width = Math.max(6, (n / total) * 100);
          return (
            <li key={status} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{status}</span>
                <span className="tabular-nums text-muted-foreground">
                  {n} ({pct}%)
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${BAR[status]}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
