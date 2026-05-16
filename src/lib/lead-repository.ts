import type { Lead } from "@/types/lead";
import { getLocalleadDb } from "@/lib/mongodb";

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

  await db.collection("lead_events").insertOne({
    leadId: lead.id,
    type: "qualified",
    at: lead.createdAt,
    message: `Lead qualified (${meta.source}) — ${lead.name} · ${lead.serviceType}`,
    source: meta.source,
  });
}
