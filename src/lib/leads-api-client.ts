import type { ActivityItem } from "@/types/activity";
import type { Lead, LeadStatus } from "@/types/lead";
import {
  getStoredActivity,
  getStoredLeads,
  initializeLeadsIfEmpty,
  setStoredLeads,
  updateLeadStatus,
} from "@/lib/leads-storage";

export type BoardSource = "mongodb" | "local";

export type BoardPayload = {
  source: BoardSource;
  leads: Lead[];
  activity: ActivityItem[];
};

export async function fetchBoard(): Promise<BoardPayload> {
  try {
    const res = await fetch("/api/leads", { cache: "no-store" });
    if (!res.ok) throw new Error(`board ${res.status}`);
    const data = (await res.json()) as BoardPayload;
    if (data.source === "mongodb" && Array.isArray(data.leads)) {
      setStoredLeads(data.leads);
      return data;
    }
  } catch {
    /* fall through */
  }

  initializeLeadsIfEmpty();
  return {
    source: "local",
    leads: getStoredLeads(),
    activity: getStoredActivity(),
  };
}

export async function patchLeadStatus(
  id: string,
  status: LeadStatus,
): Promise<BoardPayload | null> {
  try {
    const res = await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      return fetchBoard();
    }
  } catch {
    /* fall through */
  }

  const next = updateLeadStatus(id, status);
  return {
    source: "local",
    leads: next,
    activity: getStoredActivity(),
  };
}
