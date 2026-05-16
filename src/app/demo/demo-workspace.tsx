"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

import { RecommendedWorkflow } from "@/components/dashboard/recommended-workflow";
import {
  DemoLivePreview,
  type DemoPreviewDisplay,
} from "@/components/demo/demo-live-preview";
import { getLeadWorkflow } from "@/lib/lead-workflow";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CONTACT_METHODS, SERVICE_TYPES, URGENCY_OPTIONS } from "@/constants/options";
import {
  buildCustomerAutoText,
  buildOwnerNotification,
  responseTimingLabel,
} from "@/lib/lead-comms";
import { appendLead } from "@/lib/leads-storage";
import { mockQualifyLead, type QualifyInput } from "@/lib/mock-qualify";
import { submitLeadForQualification } from "@/lib/qualify-client";
import type { Lead } from "@/types/lead";
import { cn } from "@/lib/utils";

type Phase = "form" | "success";

const EXAMPLE_INPUT: QualifyInput = {
  name: "Jordan Martinez",
  serviceType: "HVAC",
  location: "Plano, TX",
  urgency: "Emergency / same day",
  preferredContact: "Text message",
  description:
    "Upstairs AC not cooling since last night, thermostat stuck at 78°F.",
};

const EXAMPLE_DISPLAY: DemoPreviewDisplay = {
  name: EXAMPLE_INPUT.name,
  phone: "(469) 555-0199",
  serviceType: EXAMPLE_INPUT.serviceType,
  location: EXAMPLE_INPUT.location,
  urgency: EXAMPLE_INPUT.urgency,
  preferredContact: EXAMPLE_INPUT.preferredContact,
  description: EXAMPLE_INPUT.description,
};

const EXAMPLE_QUALIFY = mockQualifyLead(EXAMPLE_INPUT);

function priorityLabel(score: number): { label: string; variant: "destructive" | "default" | "secondary" } {
  if (score >= 8) return { label: "Rush priority", variant: "destructive" };
  if (score >= 5) return { label: "Time-sensitive", variant: "default" };
  return { label: "Standard intake", variant: "secondary" };
}

export function DemoWorkspace() {
  const [phase, setPhase] = useState<Phase>("form");
  const [pending, setPending] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState<string>(SERVICE_TYPES[0]);
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState<string>(URGENCY_OPTIONS[0].value);
  const [preferredContact, setPreferredContact] = useState<string>(
    CONTACT_METHODS[0].value,
  );
  const [description, setDescription] = useState("");

  const [savedLead, setSavedLead] = useState<Lead | null>(null);

  const canSubmit = useMemo(() => {
    const phoneDigits = phone.replace(/\D/g, "");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return (
      name.trim().length > 1 &&
      phoneDigits.length >= 10 &&
      emailOk &&
      location.trim().length > 1 &&
      description.trim().length > 8
    );
  }, [name, phone, email, location, description]);

  const previewLive = useMemo(() => {
    return (
      name.trim().length > 1 &&
      location.trim().length > 1 &&
      description.trim().length > 8
    );
  }, [name, location, description]);

  const previewQualify = useMemo(() => {
    if (!previewLive) return EXAMPLE_QUALIFY;
    return mockQualifyLead({
      name: name.trim(),
      serviceType,
      location: location.trim(),
      urgency,
      preferredContact,
      description: description.trim(),
    });
  }, [
    previewLive,
    name,
    serviceType,
    location,
    urgency,
    preferredContact,
    description,
  ]);

  const previewDisplay: DemoPreviewDisplay = useMemo(() => {
    if (!previewLive) return EXAMPLE_DISPLAY;
    return {
      name: name.trim() || EXAMPLE_DISPLAY.name,
      phone: phone.trim() || "(000) 000-0000",
      serviceType,
      location: location.trim(),
      urgency,
      preferredContact,
      description: description.trim(),
    };
  }, [previewLive, name, phone, serviceType, location, urgency, preferredContact, description]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || pending) return;

    setPending(true);

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      serviceType,
      location: location.trim(),
      urgency,
      preferredContact,
      description: description.trim(),
    };

    const result = await submitLeadForQualification(payload);
    appendLead(result.lead);
    setSavedLead(result.lead);
    setPhase("success");
    setPending(false);
  }

  function resetDemo() {
    setPhase("form");
    setSavedLead(null);
  }

  if (phase === "success" && savedLead) {
    const pri = priorityLabel(savedLead.urgencyScore);
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={pri.variant} className="h-7 px-3 text-[11px] font-semibold uppercase tracking-wide">
            {pri.label}
          </Badge>
          <span className="text-[13px] text-muted-foreground">
            Lead packet · ready on your command center
          </span>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-transparent p-5 shadow-[var(--lla-shadow-card)]">
          <CheckCircle2
            className="mt-0.5 size-6 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
          <div className="min-w-0 space-y-1">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              Request captured
            </p>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              Here&apos;s exactly what your crew would see in the first minutes—owner ping,
              customer text, and the next move spelled out.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--lla-shadow-card)]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Owner alert
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/95">
              {savedLead.ownerNote ?? buildOwnerNotification(savedLead)}
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-muted/35 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Customer auto-text
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground/95">
              {buildCustomerAutoText(savedLead)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border/40 pt-4 text-[12px]">
              <span className="rounded-lg bg-background/90 px-2.5 py-1 font-medium text-foreground ring-1 ring-border/40">
                {savedLead.preferredContact}
              </span>
              <span className="rounded-lg bg-background/90 px-2.5 py-1 font-medium text-foreground ring-1 ring-border/40">
                {responseTimingLabel(savedLead)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-card p-5 ring-1 ring-primary/10">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Recommended next action
              </p>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground">
              {savedLead.recommendedAction}
            </p>
            <div className="mt-5 grid gap-3 border-t border-border/40 pt-5 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Heat score</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">
                  {savedLead.urgencyScore}
                  <span className="text-sm font-normal text-muted-foreground">/10</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Est. value</p>
                <p className="mt-1 text-lg font-semibold">{savedLead.estimatedValue}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Board status</p>
                <p className="mt-1 text-lg font-semibold">{savedLead.status}</p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-muted/40 p-3 text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Summary · </span>
              {savedLead.aiSummary}
            </p>
          </div>

          <div className="rounded-2xl border border-border/55 bg-card p-5 shadow-[var(--lla-shadow-card)]">
            <RecommendedWorkflow steps={getLeadWorkflow(savedLead)} />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={resetDemo}>
            Submit another request
          </Button>
          <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
            Open command center
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start lg:gap-12">
      <form onSubmit={handleSubmit} className="min-w-0 space-y-6">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-1 shadow-[var(--lla-shadow-card)] ring-1 ring-black/[0.03] dark:ring-white/[0.04]">
          <Card className="border-0 shadow-none sm:rounded-[1.35rem]">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-xl tracking-tight">Homeowner request</CardTitle>
              <CardDescription className="text-[14px] leading-relaxed">
                Same fields a real customer would submit. Nothing is sent until you choose to call or text from the command center.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="Jordan Martinez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="(469) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="jordan@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Service type</Label>
                  <Select
                    value={serviceType}
                    onValueChange={(v) => {
                      if (v) setServiceType(v);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select
                    value={urgency}
                    onValueChange={(v) => {
                      if (v) setUrgency(v);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {URGENCY_OPTIONS.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  placeholder="Neighborhood or city (e.g. Plano, TX)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred contact</Label>
                <Select
                  value={preferredContact}
                  onValueChange={(v) => {
                    if (v) setPreferredContact(v);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_METHODS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">What do you need done?</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  placeholder="Example: upstairs AC not cooling, thermostat at 78°F, started yesterday evening."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col border-t border-border/40 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit || pending}
                className="min-w-44"
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Building lead packet…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Generate lead packet
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>

      <aside
        className={cn(
          "relative min-w-0 rounded-2xl border border-border/45 bg-muted/20 p-4 sm:p-5 lg:sticky lg:top-24",
          "shadow-[inset_0_1px_0_0_oklch(1_0_0/0.04)] dark:shadow-[inset_0_1px_0_0_oklch(1_0_0/0.06)]",
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl bg-[radial-gradient(closest-side,oklch(0.58_0.12_255/0.12),transparent_75%)] opacity-90"
        />
        <div className="relative space-y-1 pb-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Live preview
          </p>
          <p className="text-[15px] font-medium leading-snug text-foreground">
            What the owner sees before the first call
          </p>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            Updates as you fill the form—so dispatch always gets context, timing, and the right channel.
          </p>
        </div>
        <DemoLivePreview
          qualify={previewQualify}
          display={previewDisplay}
          mode={previewLive ? "live" : "example"}
        />
      </aside>
    </div>
  );
}
