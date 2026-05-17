import type { ActivityItem } from "@/types/activity";
import type { Lead, LeadStatus } from "@/types/lead";
import {
  insertLeadEvent,
  listLeadEvents,
  statusChangeMessage,
} from "@/lib/lead-events";
import { getLocalleadDb } from "@/lib/mongodb";

const STRIP_FROM_LEAD = new Set([
  "_id",
  "qualifiedBy",
  "insertedAt",
]);

export function documentToLead(doc: Record<string, unknown>): Lead | null {
  if (typeof doc.id !== "string" || typeof doc.name !== "string") {
    return null;
  }
  const lead = { ...doc } as Record<string, unknown>;
  for (const key of STRIP_FROM_LEAD) {
    delete lead[key];
  }
  return lead as Lead;
}

export async function insertQualifiedLead(
  lead: Lead,
  meta: { source: "gemini" | "mock" },
): Promise<void> {
  const db = await getLocalleadDb();

  await db.collection("leads").insertOne({
    ...lead,
    qualifiedBy: meta.source,
    insertedAt: new Date().toISOString(),
  });

  await insertLeadEvent({
    leadId: lead.id,
    type: "qualified",
    at: lead.createdAt,
    message: `Lead qualified (${meta.source}) — ${lead.name} · ${lead.serviceType}`,
    source: meta.source,
  });
}

export async function listLeadsFromDb(): Promise<Lead[]> {
  const db = await getLocalleadDb();
  const docs = await db
    .collection("leads")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs
    .map((d) => documentToLead(d as Record<string, unknown>))
    .filter((l): l is Lead => l !== null);
}

export async function listBoardFromDb(): Promise<{
  leads: Lead[];
  activity: ActivityItem[];
}> {
  const [leads, activity] = await Promise.all([
    listLeadsFromDb(),
    listLeadEvents(),
  ]);
  return { leads, activity };
}

export async function updateLeadStatusInDb(
  id: string,
  status: LeadStatus,
): Promise<Lead | null> {
  const db = await getLocalleadDb();
  const existing = await db.collection("leads").findOne({ id });
  if (!existing) return null;

  const lead = documentToLead(existing as Record<string, unknown>);
  if (!lead || lead.status === status) return lead;

  const now = new Date().toISOString();
  let firstContactAt = lead.firstContactAt;
  if (lead.status === "New" && status !== "New" && !firstContactAt) {
    firstContactAt = now;
  }

  await db.collection("leads").updateOne(
    { id },
    {
      $set: {
        status,
        ...(firstContactAt ? { firstContactAt } : {}),
      },
    },
  );

  await insertLeadEvent({
    leadId: id,
    type: "status_change",
    at: now,
    message: statusChangeMessage(lead.name, status),
    source: "dashboard",
  });

  return {
    ...lead,
    status,
    firstContactAt: firstContactAt ?? lead.firstContactAt,
  };
}
