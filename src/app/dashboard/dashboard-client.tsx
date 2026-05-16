"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useCallback } from "react";
import type { ComponentProps, ReactNode } from "react";
import { ClipboardList, Inbox, Search, Sparkles } from "lucide-react";

import { LeadFollowUpActions } from "@/components/dashboard/lead-follow-up-actions";
import { LeadsLineChart } from "@/components/dashboard/leads-line-chart";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { StatusPipelineChart } from "@/components/dashboard/status-pipeline-chart";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ActivityItem } from "@/types/activity";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/types/lead";
import {
  avgFirstContactMinutes,
  countLeadsCreatedToday,
  followUpNeededLeads,
  formatAvgMinutes,
  formatUsd,
  highPriorityOpenLeads,
  pipelinePotentialHigh,
} from "@/lib/lead-metrics";
import {
  getStoredActivity,
  getStoredLeads,
  initializeLeadsIfEmpty,
  updateLeadStatus,
} from "@/lib/leads-storage";
import { cn } from "@/lib/utils";
import { PAGE_GUTTER } from "@/lib/layout";

const KPI_HOVER =
  "transition-shadow duration-200 hover:shadow-[var(--lla-shadow-card-hover)]";

const dateFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function urgencyBadgeVariant(
  score: number,
): ComponentProps<typeof Badge>["variant"] {
  if (score >= 8) return "destructive";
  if (score >= 5) return "default";
  return "secondary";
}

function urgencyRowBorder(score: number): string {
  if (score >= 8) return "border-l-[3px] border-l-red-500";
  if (score >= 5) return "border-l-[3px] border-l-amber-500";
  return "border-l-[3px] border-l-transparent";
}

function statusSelectWrap(status: LeadStatus): string {
  switch (status) {
    case "New":
      return "rounded-lg bg-sky-500/10 p-0.5 ring-1 ring-sky-500/25";
    case "Contacted":
      return "rounded-lg bg-amber-500/10 p-0.5 ring-1 ring-amber-500/30";
    case "Booked":
      return "rounded-lg bg-emerald-600/10 p-0.5 ring-1 ring-emerald-600/25";
    case "Lost":
      return "rounded-lg bg-muted p-0.5 ring-1 ring-border";
    default:
      return "";
  }
}

function SectionTitle({
  children,
  description,
}: {
  children: ReactNode;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {children}
      </h2>
      {description ? (
        <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function statusChipVariant(
  status: LeadStatus,
): ComponentProps<typeof Badge>["variant"] {
  switch (status) {
    case "New":
      return "secondary";
    case "Contacted":
      return "outline";
    case "Booked":
      return "default";
    case "Lost":
      return "outline";
    default:
      return "secondary";
  }
}

function LeadMiniCard({
  lead,
  onRefresh,
}: {
  lead: Lead;
  onRefresh: () => void;
}) {
  return (
    <Card
      size="sm"
      className="border-border/55 bg-card/90 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] transition-shadow duration-200 hover:shadow-[var(--lla-shadow-card-hover)] dark:ring-white/[0.04]"
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{lead.name}</CardTitle>
              <Badge
                variant={statusChipVariant(lead.status)}
                className="h-5 text-[10px] font-medium uppercase tracking-wide"
              >
                {lead.status}
              </Badge>
            </div>
            <CardDescription>
              {lead.serviceType} · {lead.location}
            </CardDescription>
          </div>
          <Badge variant={urgencyBadgeVariant(lead.urgencyScore)} className="shrink-0 tabular-nums">
            {lead.urgencyScore}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 text-[13px] leading-relaxed text-muted-foreground">
        <p className="line-clamp-2 text-foreground/85">{lead.aiSummary}</p>
        <LeadFollowUpActions
          lead={lead}
          onMarkContacted={() => {
            updateLeadStatus(lead.id, "Contacted");
            onRefresh();
          }}
          onMarkBooked={() => {
            updateLeadStatus(lead.id, "Booked");
            onRefresh();
          }}
        />
      </CardContent>
    </Card>
  );
}

export function DashboardClient() {
  const [hydrated, setHydrated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");

  const refresh = useCallback(() => {
    initializeLeadsIfEmpty();
    setLeads(getStoredLeads());
    setActivity(getStoredActivity());
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      refresh();
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, [refresh]);

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === "visible") refresh();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [refresh]);

  const stats = useMemo(() => {
    const counts: Record<LeadStatus, number> = {
      New: 0,
      Contacted: 0,
      Booked: 0,
      Lost: 0,
    };
    for (const l of leads) counts[l.status] += 1;
    return counts;
  }, [leads]);

  const avgMinutes = useMemo(() => avgFirstContactMinutes(leads), [leads]);
  const pipeline = useMemo(() => pipelinePotentialHigh(leads), [leads]);
  const todayCount = useMemo(() => countLeadsCreatedToday(leads), [leads]);
  const hotOpen = useMemo(() => highPriorityOpenLeads(leads), [leads]);
  const followUps = useMemo(() => followUpNeededLeads(leads), [leads]);

  const todayPriorityLead = useMemo(() => {
    const rush = leads
      .filter(
        (l) =>
          l.urgencyScore >= 8 &&
          l.status !== "Booked" &&
          l.status !== "Lost",
      )
      .sort(
        (a, b) =>
          b.urgencyScore - a.urgencyScore ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    if (rush[0]) return rush[0];
    return followUpNeededLeads(leads)[0] ?? null;
  }, [leads]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      const blob = [
        l.name,
        l.serviceType,
        l.location,
        l.urgency,
        l.aiSummary,
        l.phone,
        l.email,
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [leads, query, statusFilter]);

  function onStatusChange(id: string, status: LeadStatus) {
    const next = updateLeadStatus(id, status);
    setLeads(next);
    setActivity(getStoredActivity());
  }

  if (!hydrated) {
    return (
      <div className={cn(PAGE_GUTTER, "space-y-8 py-10")}>
        <div className="space-y-3">
          <Skeleton className="h-9 w-56 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-lg rounded-lg" />
        </div>
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-[5.5rem] w-full rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-44 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  const todaySubtitle =
    todayCount === 0
      ? "No new requests yet today."
      : `${todayCount} new job request${todayCount === 1 ? "" : "s"} so far today.`;

  return (
    <div className={cn(PAGE_GUTTER, "space-y-12 pb-16 pt-10")}>
      <div className="flex flex-col gap-6 border-b border-border/40 pb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Lead command center
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            The first five minutes after a job hits your inbox: who to call,
            what to text, and what&apos;s still on the hook—without digging
            through threads.
          </p>
        </div>
        <Link
          href="/demo"
          className={cn(buttonVariants({ variant: "default", size: "lg" }))}
        >
          Log a new job
        </Link>
      </div>

      {todayPriorityLead ? (
        <section className="relative overflow-hidden rounded-2xl border border-border/55 bg-gradient-to-br from-card via-card to-muted/25 p-6 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.05] sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-28 size-[22rem] rounded-full bg-[radial-gradient(closest-side,oklch(0.58_0.14_255/0.12),transparent_70%)] blur-2xl"
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Today&apos;s priority
                </span>
                {todayPriorityLead.urgencyScore >= 8 ? (
                  <Badge variant="destructive" className="h-5 text-[10px]">
                    Rush lane
                  </Badge>
                ) : todayPriorityLead.status === "New" ? (
                  <Badge variant="secondary" className="h-5 text-[10px]">
                    Inbox
                  </Badge>
                ) : null}
                <Badge
                  variant={urgencyBadgeVariant(todayPriorityLead.urgencyScore)}
                  className="h-5 tabular-nums"
                >
                  Heat {todayPriorityLead.urgencyScore}/10
                </Badge>
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {todayPriorityLead.name}
                </h2>
                <p className="mt-1.5 text-[14px] text-muted-foreground">
                  {todayPriorityLead.serviceType} · {todayPriorityLead.location}
                </p>
              </div>
              <p className="line-clamp-2 text-[13px] leading-relaxed text-foreground/85 sm:text-sm">
                {todayPriorityLead.aiSummary}
              </p>
              <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4 ring-1 ring-primary/10">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  <Sparkles className="size-3.5" aria-hidden />
                  Recommended next action
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground">
                  {todayPriorityLead.recommendedAction}
                </p>
              </div>
            </div>
            <div className="w-full shrink-0 space-y-3 border-t border-border/40 pt-6 lg:max-w-[340px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <p className="text-[12px] font-medium text-muted-foreground">
                One-tap follow-up
              </p>
              <LeadFollowUpActions
                lead={todayPriorityLead}
                onMarkContacted={() =>
                  onStatusChange(todayPriorityLead.id, "Contacted")
                }
                onMarkBooked={() =>
                  onStatusChange(todayPriorityLead.id, "Booked")
                }
                className="border-t-0 pt-0"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-border/60 bg-muted/15 px-6 py-12 text-center sm:px-10">
          <p className="text-[15px] font-medium text-foreground">
            Nothing in the priority queue yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
            Log a homeowner request to see owner alerts and follow-up actions here.
            Rush jobs and new inbox leads surface automatically.
          </p>
          <Link
            href="/demo"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 inline-flex",
            )}
          >
            Log a new job
          </Link>
        </section>
      )}

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Live metrics
        </p>
        <Card className="overflow-hidden border-border/55 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.04]">
          <div className="grid grid-cols-2 divide-x divide-y divide-border/50 sm:grid-cols-5 sm:divide-y-0">
            <div
              className={cn(
                "flex flex-col items-start gap-1 px-5 py-5 text-left transition-colors hover:bg-muted/30 sm:py-6",
                KPI_HOVER,
              )}
            >
              <span className="text-[11px] font-medium text-muted-foreground">
                Today&apos;s intakes
              </span>
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {todayCount}
              </span>
              <span className="text-[11px] leading-snug text-muted-foreground">
                New since midnight
              </span>
            </div>
            <div
              className={cn(
                "flex flex-col items-start gap-1 px-5 py-5 text-left transition-colors hover:bg-muted/30 sm:py-6",
                KPI_HOVER,
              )}
            >
              <span className="text-[11px] font-medium text-muted-foreground">
                Rush open
              </span>
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {hotOpen.length}
              </span>
              <span className="text-[11px] leading-snug text-muted-foreground">
                Heat 8+ in play
              </span>
            </div>
            <div
              className={cn(
                "flex flex-col items-start gap-1 px-5 py-5 text-left transition-colors hover:bg-muted/30 sm:py-6",
                KPI_HOVER,
              )}
            >
              <span className="text-[11px] font-medium text-muted-foreground">
                New inbox
              </span>
              <span className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {followUps.length}
              </span>
              <span className="text-[11px] leading-snug text-muted-foreground">
                Needs first touch
              </span>
            </div>
            <div
              className={cn(
                "flex flex-col items-start gap-1 bg-gradient-to-br from-primary/[0.06] to-transparent px-5 py-5 text-left transition-colors hover:bg-primary/[0.08] sm:py-6",
                KPI_HOVER,
              )}
            >
              <span className="text-[11px] font-medium text-primary">
                Pipeline upside
              </span>
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
                {leads.length === 0 ? "—" : formatUsd(pipeline)}
              </span>
              <span className="text-[11px] leading-snug text-muted-foreground">
                Open jobs (excl. Lost)
              </span>
            </div>
            <div
              className={cn(
                "flex flex-col items-start gap-1 px-5 py-5 text-left transition-colors hover:bg-muted/30 sm:py-6",
                KPI_HOVER,
              )}
            >
              <span className="text-[11px] font-medium text-muted-foreground">
                Avg. first reply
              </span>
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-3xl">
                {avgMinutes != null ? formatAvgMinutes(avgMinutes) : "—"}
              </span>
              <span className="text-[11px] leading-snug text-muted-foreground">
                New → first move
              </span>
            </div>
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <SectionTitle description="Volume trend so you can spot busy days.">
          Lead volume
        </SectionTitle>
        <Card className="border-border/55 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.04]">
          <CardContent className="pt-6">
            <LeadsLineChart
              leads={leads}
              days={14}
              title="New job requests over time"
              subtitle={todaySubtitle}
            />
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="space-y-4">
            <SectionTitle description="Counts across your stages.">
              Where jobs sit
            </SectionTitle>
            <Card className="border-border/55 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.04]">
              <CardContent className="pt-6">
                <StatusPipelineChart counts={stats} />
              </CardContent>
            </Card>
          </section>
        </div>
        <Card className="flex min-h-[300px] flex-col border-border/55 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.04] lg:min-h-[340px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold tracking-tight">
              Recent activity
            </CardTitle>
            <CardDescription>
              Last moves your team (or you) made on the board.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col pt-0">
            <RecentActivityFeed items={activity} nested />
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <SectionTitle description="Rush work and fresh inbox side by side—before you scroll the full ledger.">
          Priority queues
        </SectionTitle>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Rush lane
              </h3>
              <Badge variant="outline" className="text-[10px] font-medium tabular-nums">
                {hotOpen.length} open
              </Badge>
            </div>
            {hotOpen.length === 0 ? (
              <Card className="border-dashed border-border/55 bg-muted/15 shadow-none">
                <CardContent className="py-10 text-center text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  No open rush jobs. When heat hits 8+ and the job isn&apos;t booked or lost, it shows up here.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {hotOpen.slice(0, 4).map((lead) => (
                  <LeadMiniCard key={lead.id} lead={lead} onRefresh={refresh} />
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                New inbox
              </h3>
              <Badge variant="outline" className="text-[10px] font-medium tabular-nums">
                {followUps.length} waiting
              </Badge>
            </div>
            {followUps.length === 0 ? (
              <Card className="border-dashed border-border/55 bg-muted/15 shadow-none">
                <CardContent className="py-10 text-center text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  Inbox is clear. Book the jobs you&apos;ve already spoken with, or log a new request.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {followUps.slice(0, 4).map((lead) => (
                  <LeadMiniCard key={lead.id} lead={lead} onRefresh={refresh} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Card className="overflow-hidden border-border/55 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.04]">
        <CardHeader className="border-b border-border/40 bg-muted/25 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base font-semibold tracking-tight">
              All leads
            </CardTitle>
            <CardDescription>
              Sample North Texas jobs load when the board is empty. New requests
              from the intake form appear at the top of this list.
            </CardDescription>
          </div>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto">
              <div className="grid w-full gap-2 sm:max-w-xs">
                <Label htmlFor="search" className="sr-only">
                  Search leads
                </Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search…"
                    className="pl-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid w-full gap-2 sm:w-44">
                <Label className="text-xs font-medium text-muted-foreground">
                  Status
                </Label>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    if (v) setStatusFilter(v as LeadStatus | "all");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 px-4 py-20 text-center">
              <div className="flex size-[4.5rem] items-center justify-center rounded-2xl bg-muted/80 shadow-inner ring-1 ring-border/50">
                <Inbox className="size-9 text-muted-foreground" />
              </div>
              <div className="max-w-md space-y-2">
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  Nothing in the inbox yet
                </p>
                <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  Log a homeowner request to add a row here, or refresh after clearing
                  browser storage to reload the sample North Texas jobs.
                </p>
              </div>
              <Link href="/demo" className={buttonVariants({ size: "lg" })}>
                Log a job request
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 px-4 py-16 text-center">
              <ClipboardList className="size-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Nothing matches</p>
                <p className="max-w-sm text-[13px] text-muted-foreground sm:text-sm">
                  Try another search word, or set status back to &quot;All.&quot;
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1 sm:mx-0 sm:px-0">
              <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Job</TableHead>
                  <TableHead>Heat</TableHead>
                  <TableHead className="hidden lg:table-cell">Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Inbox time</TableHead>
                  <TableHead className="hidden min-w-[180px] xl:table-cell">
                    Lead summary
                  </TableHead>
                  <TableHead className="min-w-[11rem] sm:min-w-[200px]">
                    Follow up
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className={cn(urgencyRowBorder(lead.urgencyScore))}
                  >
                    <TableCell className="max-w-[9rem] font-medium sm:max-w-none">
                      <span className="block truncate">{lead.name}</span>
                      <span className="mt-1 line-clamp-2 text-[11px] font-normal leading-snug text-muted-foreground xl:hidden">
                        {lead.aiSummary}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {lead.serviceType}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-muted-foreground md:hidden">
                          {lead.serviceType}
                        </span>
                        <Badge
                          variant={urgencyBadgeVariant(lead.urgencyScore)}
                          className="w-fit tabular-nums"
                        >
                          {lead.urgencyScore}/10
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden max-w-[140px] truncate lg:table-cell">
                      {lead.location}
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
                        <Badge
                          variant={statusChipVariant(lead.status)}
                          className="h-6 w-fit shrink-0 text-[10px] font-semibold uppercase tracking-wide"
                        >
                          {lead.status}
                        </Badge>
                        <div
                          className={cn(
                            "min-w-0 flex-1",
                            statusSelectWrap(lead.status),
                          )}
                        >
                          <Select
                            value={lead.status}
                            onValueChange={(v) => {
                              if (v) onStatusChange(lead.id, v as LeadStatus);
                            }}
                          >
                            <SelectTrigger size="sm" className="min-w-[128px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LEAD_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {dateFmt.format(new Date(lead.createdAt))}
                    </TableCell>
                    <TableCell className="hidden max-w-[min(22rem,50vw)] whitespace-normal text-[13px] leading-relaxed text-muted-foreground xl:table-cell">
                      {lead.aiSummary}
                    </TableCell>
                    <TableCell className="whitespace-normal align-top text-[13px]">
                      <LeadFollowUpActions
                        lead={lead}
                        onMarkContacted={() =>
                          onStatusChange(lead.id, "Contacted")
                        }
                        onMarkBooked={() => onStatusChange(lead.id, "Booked")}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
