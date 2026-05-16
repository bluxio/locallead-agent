import type { Lead } from "@/types/lead";

import { bucketLeadsByDay } from "@/lib/lead-metrics";

type Props = {
  leads: Lead[];
  days?: number;
  title?: string;
  subtitle?: string;
};

function padLabels(days: number): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today.getTime() - (days - 1) * 86400000);
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    out.push(
      d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    );
  }
  return out;
}

/** Lightweight SVG chart — no charting library. */
export function LeadsLineChart({
  leads,
  days = 14,
  title = "New job requests over time",
  subtitle,
}: Props) {
  const counts = bucketLeadsByDay(leads, days);
  const labels = padLabels(days);
  const max = Math.max(1, ...counts);
  const w = 520;
  const h = 140;
  const padL = 28;
  const padR = 12;
  const padT = 16;
  const padB = 28;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const n = counts.length;
  const step = innerW / Math.max(1, n - 1);
  const pts = counts.map((c, i) => {
    const x = padL + i * step;
    const y = padT + innerH - (c / max) * innerH;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");

  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          {subtitle ? (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground tabular-nums sm:text-right">
          Last {days} days · {total} total
        </p>
      </div>
      <div className="rounded-xl border border-border/40 bg-muted/30 p-3 ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-36 w-full text-primary"
          role="img"
          aria-label={`Line chart of new job requests over the last ${days} days`}
        >
          <title>New job requests per day</title>
          <line
            x1={padL}
            y1={padT + innerH}
            x2={w - padR}
            y2={padT + innerH}
            className="stroke-border"
            strokeWidth={1}
          />
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth={2.25}
            strokeLinejoin="round"
            strokeLinecap="round"
            points={polyline}
          />
          {counts.map((c, i) => {
            const x = padL + i * step;
            const y = padT + innerH - (c / max) * innerH;
            return (
              <circle
                key={`pt-${i}`}
                cx={x}
                cy={y}
                r={c > 0 ? 4 : 2.5}
                className={
                  c > 0
                    ? "fill-primary stroke-background"
                    : "fill-muted stroke-muted-foreground/30"
                }
                strokeWidth={2}
              />
            );
          })}
        </svg>
        <div className="flex justify-between px-1 pt-1 text-[10px] text-muted-foreground sm:text-xs">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      </div>
      {total === 0 && (
        <p className="text-xs text-muted-foreground">
          New job requests over the last two weeks appear here as volume builds.
        </p>
      )}
    </div>
  );
}
