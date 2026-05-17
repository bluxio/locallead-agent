import { updateLeadStatusInDb } from "@/lib/lead-repository";
import { isMongoConfigured } from "@/lib/mongodb";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

type RouteContext = { params: Promise<{ id: string }> };

function isLeadStatus(value: unknown): value is LeadStatus {
  return (
    typeof value === "string" &&
    (LEAD_STATUSES as readonly string[]).includes(value)
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!isMongoConfigured()) {
    return Response.json({ error: "MongoDB not configured" }, { status: 503 });
  }

  try {
    const body: unknown = await request.json();
    const status =
      body && typeof body === "object" && "status" in body
        ? (body as { status: unknown }).status
        : undefined;

    if (!isLeadStatus(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await updateLeadStatusInDb(id, status);
    if (!updated) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    return Response.json({ ok: true, lead: updated });
  } catch (err) {
    console.error("[PATCH /api/leads/[id]/status]", err);
    return Response.json({ error: "Status update failed" }, { status: 500 });
  }
}
