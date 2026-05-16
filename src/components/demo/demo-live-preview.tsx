"use client";

import { useMemo } from "react";

import type { QualifyResult } from "@/lib/mock-qualify";
import {
  buildCustomerAutoText,
  buildOwnerNotification,
  responseTimingLabel,
} from "@/lib/lead-comms";
import type { Lead } from "@/types/lead";
import { RecommendedWorkflow } from "@/components/dashboard/recommended-workflow";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DemoPreviewDisplay = {
  name: string;
  phone: string;
  serviceType: string;
  location: string;
  urgency: string;
  preferredContact: string;
  description: string;
};

type Props = {
  qualify: QualifyResult;
  display: DemoPreviewDisplay;
  mode: "example" | "live";
};

function toLead(display: DemoPreviewDisplay, q: QualifyResult): Lead {
  return {
    id: "preview",
    name: display.name,
    phone: display.phone,
    email: "preview@local",
    serviceType: display.serviceType,
    location: display.location,
    urgency: display.urgency,
    preferredContact: display.preferredContact,
    description: display.description,
    ...q,
    status: "New",
    createdAt: new Date().toISOString(),
  };
}

export function DemoLivePreview({ qualify, display, mode }: Props) {
  const lead = useMemo(() => toLead(display, qualify), [display, qualify]);

  const heat =
    qualify.urgencyScore >= 8
      ? "Rush"
      : qualify.urgencyScore >= 5
        ? "Soon"
        : "Routine";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-foreground">
          What your team gets
        </p>
        <Badge
          variant={mode === "live" ? "default" : "secondary"}
          className="h-5 text-[10px]"
        >
          {mode === "live" ? "Updating" : "Sample"}
        </Badge>
      </div>

      <div className="rounded-2xl border border-border/55 bg-card/90 p-4 shadow-[var(--lla-shadow-card)]">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Owner alert
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-foreground/95">
          {buildOwnerNotification(lead)}
        </p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-muted/35 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Auto-text to customer
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-foreground/95">
          {buildCustomerAutoText(lead)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
          <span className="rounded-md bg-background/80 px-2 py-0.5 font-medium text-foreground">
            {display.preferredContact}
          </span>
          <span className="rounded-md bg-background/80 px-2 py-0.5 font-medium text-foreground">
            {responseTimingLabel(lead)}
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 font-medium",
              qualify.urgencyScore >= 8
                ? "bg-red-500/12 text-red-800 dark:text-red-200"
                : "bg-muted text-foreground",
            )}
          >
            Heat {qualify.urgencyScore}/10 · {heat}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-transparent p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          Lead summary
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-foreground/90">
          {qualify.aiSummary}
        </p>
        <p className="mt-3 text-[11px] font-medium text-muted-foreground">
          Est. job value{" "}
          <span className="text-foreground">{qualify.estimatedValue}</span>
        </p>
      </div>

      {(qualify.recommendedWorkflow?.length ?? 0) > 0 ? (
        <div className="rounded-2xl border border-border/50 bg-card/90 p-4 shadow-[var(--lla-shadow-card)]">
          <RecommendedWorkflow
            steps={qualify.recommendedWorkflow ?? []}
            compact
          />
        </div>
      ) : null}
    </div>
  );
}
