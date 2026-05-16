import type { ActivityItem } from "@/types/activity";
import type { Lead, LeadStatus } from "@/types/lead";
import { getSampleActivity, getSampleLeads } from "@/lib/seed-leads";

const STORAGE_KEY = "locadle-agent:leads:v1";
const ACTIVITY_KEY = "locadle-agent:activity:v1";
const MAX_ACTIVITY = 35;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function parseLeads(raw: string | null): Lead[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(Boolean) as Lead[];
  } catch {
    return [];
  }
}

function parseActivity(raw: string | null): ActivityItem[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(Boolean) as ActivityItem[];
  } catch {
    return [];
  }
}

function prependActivity(item: ActivityItem): void {
  if (!isBrowser()) return;
  const next = [item, ...parseActivity(localStorage.getItem(ACTIVITY_KEY))].slice(
    0,
    MAX_ACTIVITY,
  );
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
}

/** Reads leads from localStorage. Later: Supabase `from('leads').select()`. */
export function getStoredLeads(): Lead[] {
  if (!isBrowser()) return [];
  return parseLeads(localStorage.getItem(STORAGE_KEY));
}

/**
 * Loads sample North Texas jobs when the board is empty so demos start with context.
 * New submissions from the intake form are prepended and appear alongside these rows.
 */
export function initializeLeadsIfEmpty(): Lead[] {
  if (!isBrowser()) return [];
  const existing = getStoredLeads();
  if (existing.length > 0) return existing;

  const sample = getSampleLeads();
  setStoredLeads(sample);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(getSampleActivity(sample)));
  return sample;
}

/** Recent timeline for the dashboard. Later: Supabase `lead_events` or realtime channel. */
export function getStoredActivity(): ActivityItem[] {
  if (!isBrowser()) return [];
  return parseActivity(localStorage.getItem(ACTIVITY_KEY));
}

/** Persists the full list. Later: Supabase upsert per row or RPC. */
export function setStoredLeads(leads: Lead[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

/** Appends a new lead. Later: `supabase.from('leads').insert(lead)`. */
export function appendLead(lead: Lead): void {
  const existing = getStoredLeads();
  setStoredLeads([lead, ...existing]);
  prependActivity({
    id: crypto.randomUUID(),
    at: lead.createdAt,
    message: `New lead — ${lead.name} · ${lead.serviceType} (${lead.location})`,
  });
}

/** Updates status by id. Later: `supabase.from('leads').update(...).eq('id', id)`. */
export function updateLeadStatus(id: string, status: LeadStatus): Lead[] {
  const leads = getStoredLeads();
  const lead = leads.find((l) => l.id === id);
  if (!lead || lead.status === status) return leads;

  const prev = lead.status;
  const now = new Date().toISOString();
  let firstContactAt = lead.firstContactAt;
  if (prev === "New" && status !== "New" && !firstContactAt) {
    firstContactAt = now;
  }

  const next = leads.map((l) =>
    l.id === id
      ? {
          ...l,
          status,
          firstContactAt: firstContactAt ?? l.firstContactAt,
        }
      : l,
  );
  setStoredLeads(next);

  const verb =
    status === "Contacted"
      ? "marked as Contacted"
      : status === "Booked"
        ? "booked"
        : status === "Lost"
          ? "marked as Lost"
          : "moved to New";

  prependActivity({
    id: crypto.randomUUID(),
    at: now,
    message: `${lead.name} — ${verb}`,
  });

  return next;
}
