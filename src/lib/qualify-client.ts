import type { QualifyApiResponse, QualifyRequestBody } from "@/lib/qualify-types";
import { mockQualifyLead } from "@/lib/mock-qualify";
import type { Lead } from "@/types/lead";

export async function submitLeadForQualification(
  body: QualifyRequestBody,
): Promise<QualifyApiResponse> {
  try {
    const res = await fetch("/api/qualify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`API ${res.status}`);
    }

    return (await res.json()) as QualifyApiResponse;
  } catch {
    const qualified = mockQualifyLead({
      name: body.name,
      serviceType: body.serviceType,
      location: body.location,
      urgency: body.urgency,
      preferredContact: body.preferredContact,
      description: body.description,
    });

    const lead: Lead = {
      id: crypto.randomUUID(),
      name: body.name,
      phone: body.phone,
      email: body.email,
      serviceType: body.serviceType,
      location: body.location,
      urgency: body.urgency,
      preferredContact: body.preferredContact,
      description: body.description,
      ...qualified,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    return {
      leadId: lead.id,
      lead,
      source: "mock",
      persisted: false,
    };
  }
}
