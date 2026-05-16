import type { QualifyRequestBody } from "@/lib/qualify-types";
import type { GeminiQualifyResponse } from "@/lib/qualify-types";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `You are LocalLead Agent, an operational AI for home-service businesses (HVAC, plumbing, roofing, electrical).
Analyze the inbound homeowner request and respond with ONLY valid JSON (no markdown) matching this schema:
{
  "summary": "string — 1-2 sentence owner-facing lead summary",
  "urgency": "low" | "medium" | "high" | "emergency",
  "estimatedValue": number — single USD midpoint estimate for the job,
  "nextAction": "string — single immediate action for the owner",
  "workflow": ["string", "..."] — 3 to 5 ordered operational steps,
  "ownerNote": "string — short alert line for owner SMS/push (under 280 chars)"
}
Be specific to the service type, location, and description. For life-safety or no-heat/no-AC scenarios use emergency or high.`;

function buildUserPrompt(input: QualifyRequestBody): string {
  return [
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Service: ${input.serviceType}`,
    `Location: ${input.location}`,
    `Customer urgency: ${input.urgency}`,
    `Preferred contact: ${input.preferredContact}`,
    `Description: ${input.description}`,
  ].join("\n");
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

function parseGeminiJson(raw: string): GeminiQualifyResponse {
  const parsed = JSON.parse(extractJson(raw)) as Partial<GeminiQualifyResponse>;
  const urgency = parsed.urgency;
  const validUrgency =
    urgency === "low" ||
    urgency === "medium" ||
    urgency === "high" ||
    urgency === "emergency"
      ? urgency
      : "medium";

  if (
    typeof parsed.summary !== "string" ||
    typeof parsed.nextAction !== "string" ||
    typeof parsed.ownerNote !== "string" ||
    typeof parsed.estimatedValue !== "number" ||
    !Array.isArray(parsed.workflow)
  ) {
    throw new Error("Gemini response missing required fields");
  }

  const workflow = parsed.workflow
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .slice(0, 5);

  if (workflow.length === 0) {
    throw new Error("Gemini workflow empty");
  }

  return {
    summary: parsed.summary.trim(),
    urgency: validUrgency,
    estimatedValue: Math.max(50, Math.round(parsed.estimatedValue)),
    nextAction: parsed.nextAction.trim(),
    workflow,
    ownerNote: parsed.ownerNote.trim(),
  };
}

export async function qualifyWithGemini(
  input: QualifyRequestBody,
): Promise<GeminiQualifyResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(input) }] }],
      generationConfig: {
        temperature: 0.35,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned empty content");
  }

  return parseGeminiJson(text);
}
