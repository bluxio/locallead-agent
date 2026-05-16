import type { Lead } from "@/types/lead";

function firstName(full: string): string {
  const t = full.trim().split(/\s+/)[0];
  return t && t.length > 0 ? t : "there";
}

/** City-ish string from “Plano, TX” → “Plano”. */
function cityFromLocation(location: string): string {
  const part = location.split(",")[0]?.trim();
  return part && part.length > 0 ? part : location.trim() || "your area";
}

/**
 * Short public-facing business label for demo texts.
 * Later: replace with company name from settings / Supabase.
 */
export function demoBusinessLabel(lead: Lead): string {
  const city = cityFromLocation(lead.location);
  return `${city} ${lead.serviceType} Pros`;
}

function shortJobTease(lead: Lead): string {
  const d = lead.description.replace(/\s+/g, " ").trim();
  if (d.length <= 72) return d;
  return `${d.slice(0, 70)}…`;
}

/** Customer-facing SMS body (Twilio would send this). */
export function buildCustomerAutoText(lead: Lead): string {
  const who = firstName(lead.name);
  const brand = demoBusinessLabel(lead);
  const teaser = shortJobTease(lead);
  return `Hi ${who}, this is ${brand}. We got your ${lead.serviceType.toLowerCase()} request and can help with: ${teaser} Are you free for a quick call or a same-day visit today?`;
}

function prefersLine(lead: Lead): string {
  switch (lead.preferredContact) {
    case "Text message":
      return "Prefers text";
    case "Phone call":
      return "Prefers a phone call";
    default:
      return "Prefers email";
  }
}

/** Owner push / inbox line (SMS, email, or push — Twilio etc. later). */
export function buildOwnerNotification(lead: Lead): string {
  const tier =
    lead.urgencyScore >= 8
      ? "New high-priority"
      : lead.urgencyScore >= 5
        ? "New time-sensitive"
        : "New";
  const brief = shortJobTease(lead);
  const timing = responseTimingLabel(lead);
  return `${tier} ${lead.serviceType} lead in ${lead.location.trim()}. ${brief} ${prefersLine(lead)}. Recommended: ${timing.toLowerCase()}.`;
}

/** Plain-language SLA hint for the team. */
export function responseTimingLabel(lead: Lead): string {
  if (lead.urgencyScore >= 8) return "Respond within 5 minutes";
  if (lead.urgencyScore >= 5) return "Respond within 30 minutes";
  return "Reply same business day";
}
