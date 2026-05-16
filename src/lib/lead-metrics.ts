import type { Lead } from "@/types/lead";

/** Fallback $ high when older demo rows lack `valueHigh`. */
export function inferValueHigh(lead: Lead): number {
  if (typeof lead.valueHigh === "number" && lead.valueHigh > 0) {
    return lead.valueHigh;
  }
  const s = lead.estimatedValue ?? "";
  const parts = s.split(/[–-]/);
  if (parts.length < 2) return 400;
  const hi = parts[1]?.trim() ?? "";
  const k = hi.match(/\$?([\d.]+)\s*k/i);
  if (k) return Math.round(parseFloat(k[1]) * 1000);
  const n = hi.match(/\$?\s*([\d,]+)/);
  if (n) return parseInt(n[1].replace(/,/g, ""), 10) || 400;
  return 400;
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `$${Math.round(n / 1000)}k`;
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function minutesBetween(isoA: string, isoB: string): number {
  return Math.abs(new Date(isoB).getTime() - new Date(isoA).getTime()) / 60000;
}

export function pipelinePotentialHigh(leads: Lead[]): number {
  return leads
    .filter((l) => l.status !== "Lost")
    .reduce((s, l) => s + inferValueHigh(l), 0);
}

export function avgFirstContactMinutes(leads: Lead[]): number | null {
  const deltas = leads
    .filter((l) => l.firstContactAt)
    .map((l) => minutesBetween(l.createdAt, l.firstContactAt!));
  if (!deltas.length) return null;
  return deltas.reduce((a, b) => a + b, 0) / deltas.length;
}

export function formatAvgMinutes(m: number): string {
  if (m < 90) return `${Math.round(m)} min`;
  const h = m / 60;
  return h < 10 ? `${h.toFixed(1)} hrs` : `${Math.round(h)} hrs`;
}

export function bucketLeadsByDay(leads: Lead[], days: number): number[] {
  const buckets = Array.from({ length: days }, () => 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = today.getTime() - (days - 1) * 86400000;

  for (const lead of leads) {
    const t = new Date(lead.createdAt).getTime();
    if (t < start) continue;
    const dayIndex = Math.floor((t - start) / 86400000);
    if (dayIndex >= 0 && dayIndex < days) buckets[dayIndex] += 1;
  }
  return buckets;
}

export function countLeadsCreatedToday(leads: Lead[]): number {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return leads.filter((l) => new Date(l.createdAt) >= start).length;
}

/** Rush jobs still in play (not booked, not lost). */
export function highPriorityOpenLeads(leads: Lead[]): Lead[] {
  return leads.filter(
    (l) =>
      l.urgencyScore >= 8 &&
      l.status !== "Booked" &&
      l.status !== "Lost",
  );
}

/** New inbox — needs owner touch, hottest first. */
export function followUpNeededLeads(leads: Lead[]): Lead[] {
  return leads
    .filter((l) => l.status === "New")
    .sort((a, b) => b.urgencyScore - a.urgencyScore);
}
