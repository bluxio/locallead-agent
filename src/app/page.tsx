import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Check,
  MessageSquare,
  PhoneMissed,
  Sparkles,
  StickyNote,
  Timer,
  TrendingUp,
} from "lucide-react";

import { HeroProductPreview } from "@/components/marketing/hero-product-preview";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

const trustBullets = [
  "No account required—works in your browser.",
  "Owner alerts and customer texts are ready to review before you hit send.",
  "Built for HVAC, plumbing, roofing, electrical, and other local trades.",
];

export default function HomePage() {
  return (
    <SiteShell>
      <main>
        <section className="relative overflow-hidden border-b border-border/40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_-20%,oklch(0.62_0.12_255/0.14),transparent_50%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,oklch(0.96_0.02_255/0.45),transparent_55%)] dark:bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,oklch(0.22_0.04_255/0.35),transparent_55%)]"
          />
          <div
            className={cn(
              PAGE_GUTTER,
              "relative grid gap-14 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,1fr)] lg:items-center lg:gap-16 lg:py-28",
            )}
          >
            <div className="max-w-xl lg:max-w-none">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
                LocalLead Agent
              </p>
              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06]">
                Win the first five minutes after every lead.
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-[17px] leading-relaxed text-muted-foreground sm:text-lg lg:max-w-xl">
                One calm intake flow: capture the job, text the homeowner, and hand
                your owner a ready-to-run summary—before the next crew texts them back.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/demo" className={buttonVariants({ size: "lg" })}>
                  Log a job request
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  See your command center
                </Link>
              </div>
              <ul className="mt-10 space-y-3">
                {trustBullets.map((line) => (
                  <li key={line} className="flex gap-3 text-[14px] leading-snug text-foreground/90">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/15">
                      <Check className="size-3" aria-hidden />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 scale-110 bg-[radial-gradient(closest-side,oklch(0.55_0.14_255/0.2),transparent_72%)] blur-2xl"
              />
              <HeroProductPreview />
            </div>
          </div>
        </section>

        <section className={cn(PAGE_GUTTER, "py-16 sm:py-24")}>
          <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Built for crews who live in the van, not the CRM
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Every benefit shows up as something your team can see and act on—not a slide deck promise.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <Card className="overflow-hidden border-border/55 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.05]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg tracking-tight">Respond before competitors</CardTitle>
                <CardDescription className="text-[13px] leading-relaxed">
                  See the SLA clock on every job so the first text is yours, not theirs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Response race
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] font-medium text-foreground">Your crew</span>
                      <Badge className="tabular-nums">4 min</Badge>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-background/80">
                      <div className="h-full w-[18%] rounded-full bg-primary" />
                    </div>
                    <div className="flex items-center justify-between gap-3 text-muted-foreground">
                      <span className="text-[13px]">Typical competitor</span>
                      <span className="text-[12px] tabular-nums">45+ min</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-background/80">
                      <div className="h-full w-[72%] rounded-full bg-muted-foreground/25" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/55 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.05]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg tracking-tight">Know which jobs are urgent</CardTitle>
                <CardDescription className="text-[13px] leading-relaxed">
                  Heat scoring surfaces the no-AC and burst-pipe calls before the tune-ups.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/[0.06] to-transparent p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">HVAC · Allen, TX</p>
                      <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2">
                        Upstairs zone not cooling — kids home from school.
                      </p>
                    </div>
                    <Badge variant="destructive" className="shrink-0 tabular-nums">
                      9/10
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground">
                    <span className="rounded-md bg-background/80 px-2 py-1 ring-1 ring-border/50">
                      Same-day
                    </span>
                    <span className="rounded-md bg-background/80 px-2 py-1 ring-1 ring-border/50">
                      Wants text
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-border/55 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.05]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg tracking-tight">Track every lead to booked or lost</CardTitle>
                <CardDescription className="text-[13px] leading-relaxed">
                  Nothing disappears into a thread—status stays on the board where the whole team sees it.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-xl border border-border/50 bg-muted/25 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Pipeline snapshot
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="font-normal">
                      New
                      <span className="ml-1 tabular-nums text-muted-foreground">4</span>
                    </Badge>
                    <TrendingUp className="size-3.5 text-muted-foreground" aria-hidden />
                    <Badge variant="outline" className="border-amber-500/35 bg-amber-500/10 font-normal">
                      Contacted
                      <span className="ml-1 tabular-nums text-muted-foreground">2</span>
                    </Badge>
                    <TrendingUp className="size-3.5 text-muted-foreground" aria-hidden />
                    <Badge className="border-0 bg-emerald-600/90 font-normal text-white hover:bg-emerald-600">
                      Booked
                      <span className="ml-1 tabular-nums opacity-90">1</span>
                    </Badge>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
                    Drag or update status on any row—activity log keeps the handoff honest.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-y border-border/40 bg-muted/20">
          <div className={cn(PAGE_GUTTER, "py-16 sm:py-24")}>
            <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                From chaos to a single operational thread
              </h2>
              <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Same day on the job—two different systems. LocalLead is the after picture.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="relative rounded-2xl border border-border/50 bg-card/50 p-6 shadow-inner ring-1 ring-black/[0.04] dark:ring-white/[0.06] sm:p-8">
                <Badge variant="outline" className="mb-6 border-dashed text-[11px] font-semibold uppercase tracking-wide">
                  Before
                </Badge>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border/60">
                      <PhoneMissed className="size-5 text-muted-foreground" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Missed calls stack up</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                        Voicemail says &quot;call me back&quot; but not which unit, which side of the house, or how hot it is inside.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border/60">
                      <StickyNote className="size-5 text-muted-foreground" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Sticky-note dispatch</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                        Half the story lives in texts, half on a notepad on the dash—easy to lose on a busy Friday.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border/60">
                      <Timer className="size-5 text-muted-foreground" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Slow follow-up</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                        By the time someone reads the thread, the homeowner already booked whoever texted first.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative space-y-3 rounded-2xl border border-primary/15 bg-gradient-to-b from-card to-muted/15 p-6 shadow-[var(--lla-shadow-card)] ring-1 ring-primary/10 sm:p-8">
                <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary">
                  After · LocalLead
                </Badge>
                <div className="rounded-xl border border-border/55 bg-card/95 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Bell className="size-3.5" aria-hidden />
                    Lead captured
                  </div>
                  <p className="mt-2 text-[13px] font-medium text-foreground">Emergency HVAC · McKinney</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    Downstairs unit leaking water into the closet — needs a truck today.
                  </p>
                </div>
                <div className="ml-1 rounded-xl border border-border/45 bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <MessageSquare className="size-3.5" aria-hidden />
                    Text preview queued
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-foreground/95">
                    Hi Chris — McKinney HVAC Pros here. We saw your cooling issue and can route a tech today…
                  </p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-transparent p-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="size-3.5" aria-hidden />
                    Owner summary + status
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-foreground/90">
                    Rush job. Prefers text. Next step: confirm ETA in under five minutes — board set to{" "}
                    <span className="font-medium text-foreground">New</span> until someone owns it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={cn(PAGE_GUTTER, "py-16 sm:py-20")}>
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-primary px-8 py-11 text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-black/5 sm:flex-row sm:items-center sm:px-12 sm:py-12">
            <div className="max-w-xl">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Ship the whole flow in one sitting
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-primary-foreground/90 sm:text-[15px]">
                Log a homeowner request, review the owner packet, then work the job on your command center—like a busy Monday morning.
              </p>
            </div>
            <Link
              href="/demo"
              className={buttonVariants({
                size: "lg",
                variant: "secondary",
                className: "shrink-0",
              })}
            >
              Log a job request
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
