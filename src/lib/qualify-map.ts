import type { GeminiQualifyResponse } from "@/lib/qualify-types";
import type { QualifyResult } from "@/lib/mock-qualify";

const URGENCY_SCORE: Record<GeminiQualifyResponse["urgency"], number> = {
  emergency: 9,
  high: 7,
  medium: 5,
  low: 3,
};

function formatMoney(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${Math.round(n)}`;
}

export function mapGeminiToQualifyResult(
  g: GeminiQualifyResponse,
): QualifyResult & { ownerNote: string } {
  const valueLow = Math.round(g.estimatedValue * 0.85);
  const valueHigh = Math.round(g.estimatedValue * 1.15);

  return {
    aiSummary: g.summary,
    urgencyScore: URGENCY_SCORE[g.urgency],
    estimatedValue: `${formatMoney(valueLow)}–${formatMoney(valueHigh)}`,
    valueLow,
    valueHigh,
    recommendedAction: g.nextAction,
    recommendedWorkflow: g.workflow,
    ownerNote: g.ownerNote,
  };
}
