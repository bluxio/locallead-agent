import { Bell, MessageSquare, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Static hero visual — not wired to data. */
export function HeroProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(closest-side,oklch(0.55_0.14_255/0.18),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -bottom-6 top-1/2 rounded-full bg-primary/[0.07] blur-3xl"
      />
      <div className="relative space-y-3">
        <div
          className={cn(
            "flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-[var(--lla-shadow-card)] backdrop-blur-sm",
          )}
        >
          <div className="flex min-w-0 flex-1 gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Bell className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] font-semibold text-foreground">
                  New lead alert
                </p>
                <Badge variant="destructive" className="h-5 px-2 text-[10px]">
                  Rush
                </Badge>
              </div>
              <p className="text-[12px] text-muted-foreground">
                HVAC · Plano, TX · prefers text
              </p>
              <p className="line-clamp-2 text-[12px] leading-snug text-foreground/90">
                AC not cooling upstairs — homeowner available this afternoon.
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            now
          </span>
        </div>

        <div className="ml-4 rounded-2xl border border-border/50 bg-muted/40 p-3 shadow-inner">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <MessageSquare className="size-3.5" aria-hidden />
            Auto-text preview
          </div>
          <p className="text-[12px] leading-relaxed text-foreground/95">
            Hi Sarah, this is Plano HVAC Pros. We got your hvac request and can
            help with: AC not cooling upstairs… Are you free for a quick call or
            a same-day visit today?
          </p>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-card p-4 shadow-[var(--lla-shadow-card)]">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Owner summary
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-foreground/90">
            Hot HVAC job in Plano. AC not cooling upstairs. Wants texts. Next:
            respond within five minutes with a same-day window.
          </p>
        </div>
      </div>
    </div>
  );
}
