import { qualifyWithGemini } from "@/lib/gemini-qualify";
import { insertQualifiedLead } from "@/lib/lead-repository";
import { isMongoConfigured } from "@/lib/mongodb";
import { mockQualifyLead } from "@/lib/mock-qualify";
import { mapGeminiToQualifyResult } from "@/lib/qualify-map";
import type { QualifyApiResponse, QualifyRequestBody } from "@/lib/qualify-types";
import type { Lead } from "@/types/lead";

function isValidBody(body: unknown): body is QualifyRequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 1 &&
    typeof b.phone === "string" &&
    typeof b.email === "string" &&
    typeof b.serviceType === "string" &&
    typeof b.location === "string" &&
    typeof b.urgency === "string" &&
    typeof b.preferredContact === "string" &&
    typeof b.description === "string" &&
    b.description.trim().length > 8
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isValidBody(body)) {
      return Response.json(
        { error: "Invalid lead intake payload" },
        { status: 400 },
      );
    }

    const qualifyInput = {
      name: body.name.trim(),
      serviceType: body.serviceType,
      location: body.location.trim(),
      urgency: body.urgency,
      preferredContact: body.preferredContact,
      description: body.description.trim(),
    };

    let source: "gemini" | "mock" = "mock";
    let ownerNote: string | undefined;
    let qualified;

    if (process.env.GEMINI_API_KEY) {
      try {
        const gemini = await qualifyWithGemini(body);
        const mapped = mapGeminiToQualifyResult(gemini);
        ownerNote = mapped.ownerNote;
        qualified = mapped;
        source = "gemini";
      } catch (err) {
        console.error("[/api/qualify] Gemini failed, using mock:", err);
        qualified = mockQualifyLead(qualifyInput);
      }
    } else {
      qualified = mockQualifyLead(qualifyInput);
    }

    const leadId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const lead: Lead = {
      id: leadId,
      name: qualifyInput.name,
      phone: body.phone.trim(),
      email: body.email.trim(),
      serviceType: qualifyInput.serviceType,
      location: qualifyInput.location,
      urgency: qualifyInput.urgency,
      preferredContact: qualifyInput.preferredContact,
      description: qualifyInput.description,
      aiSummary: qualified.aiSummary,
      urgencyScore: qualified.urgencyScore,
      estimatedValue: qualified.estimatedValue,
      valueLow: qualified.valueLow,
      valueHigh: qualified.valueHigh,
      recommendedAction: qualified.recommendedAction,
      recommendedWorkflow: qualified.recommendedWorkflow,
      ownerNote,
      status: "New",
      createdAt,
    };

    let persisted = false;
    if (isMongoConfigured()) {
      try {
        await insertQualifiedLead(lead, { source });
        persisted = true;
      } catch (err) {
        console.error("[/api/qualify] MongoDB failed:", err);
      }
    }

    const response: QualifyApiResponse = {
      leadId,
      lead,
      source,
      persisted,
    };

    return Response.json(response);
  } catch (err) {
    console.error("[/api/qualify]", err);
    return Response.json(
      { error: "Qualification failed" },
      { status: 500 },
    );
  }
}
