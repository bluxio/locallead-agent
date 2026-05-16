import type { QualifyInput } from "@/lib/mock-qualify";
import type { Lead } from "@/types/lead";

export type QualifyRequestBody = QualifyInput & {
  phone: string;
  email: string;
};

export type GeminiUrgency = "low" | "medium" | "high" | "emergency";

export type GeminiQualifyResponse = {
  summary: string;
  urgency: GeminiUrgency;
  estimatedValue: number;
  nextAction: string;
  workflow: string[];
  ownerNote: string;
};

export type QualifyApiResponse = {
  leadId: string;
  lead: Lead;
  source: "gemini" | "mock";
  persisted: boolean;
};
