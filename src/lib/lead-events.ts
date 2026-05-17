import type { ActivityItem } from "@/types/activity";
import type { LeadStatus } from "@/types/lead";
import { getLocalleadDb } from "@/lib/mongodb";

export type LeadEventDoc = {
  leadId: string;
  type: string;
  at: string;
  message: string;
  source?: string;
};

export function statusChangeMessage(
  name: string,
  status: LeadStatus,
): string {
  const verb =
    status === "Contacted"
      ? "marked as Contacted"
      : status === "Booked"
        ? "booked"
        : status === "Lost"
          ? "marked as Lost"
          : "moved to New";
  return `${name} — ${verb}`;
}

export async function insertLeadEvent(event: LeadEventDoc): Promise<void> {
  const db = await getLocalleadDb();
  await db.collection("lead_events").insertOne(event);
}

export function eventDocToActivity(
  doc: Record<string, unknown>,
): ActivityItem | null {
  if (typeof doc.at !== "string" || typeof doc.message !== "string") {
    return null;
  }
  const id =
    doc._id != null ? String(doc._id) : crypto.randomUUID();
  return { id, at: doc.at, message: doc.message };
}

export async function listLeadEvents(limit = 35): Promise<ActivityItem[]> {
  const db = await getLocalleadDb();
  const docs = await db
    .collection("lead_events")
    .find({})
    .sort({ at: -1 })
    .limit(limit)
    .toArray();

  return docs
    .map((d) => eventDocToActivity(d as Record<string, unknown>))
    .filter((a): a is ActivityItem => a !== null);
}
