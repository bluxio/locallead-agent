import { cn } from "@/lib/utils";

type Props = {
  steps: string[];
  className?: string;
  /** Tighter spacing for cards and table rows */
  compact?: boolean;
};

export function RecommendedWorkflow({ steps, className, compact }: Props) {
  if (!steps.length) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p
        className={cn(
          "font-semibold uppercase tracking-wide text-primary",
          compact ? "text-[10px]" : "text-[11px]",
        )}
      >
        Recommended workflow
      </p>
      <ol className={cn("space-y-2", compact && "space-y-1.5")}>
        {steps.map((step, index) => (
          <li
            key={index}
            className={cn(
              "flex gap-2.5 leading-snug text-foreground/90",
              compact ? "text-[12px]" : "text-[13px] sm:text-sm",
            )}
          >
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-primary/12 font-semibold text-primary ring-1 ring-primary/15",
                compact ? "size-5 text-[10px]" : "size-6 text-[11px]",
              )}
              aria-hidden
            >
              {index + 1}
            </span>
            <span className="min-w-0 pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
