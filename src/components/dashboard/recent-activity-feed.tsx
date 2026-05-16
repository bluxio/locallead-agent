import type { ActivityItem } from "@/types/activity";

function relTime(iso: string): string {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 45) return "Just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 86400 * 5) return `${Math.floor(sec / 86400)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

type Props = {
  items: ActivityItem[];
  /** When true, skip the section heading (parent already titled the card). */
  nested?: boolean;
};

export function RecentActivityFeed({ items, nested }: Props) {
  return (
    <div className="flex h-full min-h-[180px] flex-col">
      {!nested ? (
        <>
          <p className="text-sm font-medium">Recent activity</p>
          <p className="text-xs text-muted-foreground">
            Last updates on this board — same info a dispatcher would scan first.
          </p>
        </>
      ) : null}
      <div className={nested ? "flex-1 overflow-y-auto rounded-lg border bg-muted/20" : "mt-3 flex-1 overflow-y-auto rounded-lg border bg-muted/20"}>
        {items.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            Change a status or add a job — the feed fills up so nothing feels
            forgotten.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.map((row) => (
              <li
              key={row.id}
              className="flex gap-3 px-3 py-2.5 text-sm transition-colors duration-150 hover:bg-muted/60"
            >
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {relTime(row.at)}
                </span>
                <span className="min-w-0 leading-snug text-foreground">
                  {row.message}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
