import type { Lead } from "@/types/lead";

export type QualifyInput = Pick<
  Lead,
  | "name"
  | "serviceType"
  | "location"
  | "urgency"
  | "preferredContact"
  | "description"
>;

export type QualifyResult = Pick<
  Lead,
  | "aiSummary"
  | "urgencyScore"
  | "estimatedValue"
  | "recommendedAction"
  | "valueLow"
  | "valueHigh"
>;

const URGENCY_BASE: Record<string, number> = {
  "Emergency / same day": 9,
  "Within 24–48 hours": 6,
  "This week": 4,
  "Planning / flexible": 2,
};

const VALUE_BY_SERVICE: Record<string, [number, number]> = {
  Plumbing: [175, 650],
  HVAC: [199, 899],
  Roofing: [500, 2500],
  Electrical: [200, 800],
  Handyman: [120, 400],
  "General contracting": [2000, 12000],
  Other: [150, 900],
};

function clampScore(n: number): number {
  return Math.min(10, Math.max(1, Math.round(n)));
}

function moneyRange(low: number, high: number): string {
  const fmt = (v: number) =>
    v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${Math.round(v)}`;
  return `${fmt(low)}–${fmt(high)}`;
}

function adjustRangeForKeywords(
  desc: string,
  serviceType: string,
  base: [number, number],
): [number, number] {
  const d = desc.toLowerCase();
  let [low, high] = base;

  if (
    /replace|new install|full system|re-roof|tear-?off|panel upgrade/i.test(
      desc,
    )
  ) {
    if (serviceType === "HVAC") return [4000, 12000];
    if (serviceType === "Roofing") return [8000, 25000];
    if (serviceType === "Electrical") return [1500, 6500];
  }
  if (/leak|flood|burst|sewage|no heat|won't cool|not cooling|spark/i.test(d)) {
    low *= 1.1;
    high *= 1.25;
  }
  if (/emergency|asap|urgent|today|tonight/i.test(d)) {
    high *= 1.15;
  }
  return [low, high];
}

function scoreFromDescription(description: string, base: number): number {
  const d = description.toLowerCase();
  let score = base;
  if (/emergency|asap|urgent|flood|burst|no heat|no ac|not cooling|spark/i.test(
    d,
  )) {
    score += 1.5;
  }
  if (/leak|sewage|gas smell|electrical hazard/i.test(d)) {
    score += 1;
  }
  return clampScore(score);
}

/** Plain-language heat level for the owner recap. */
function heatLabel(score: number): string {
  if (score >= 8) return "Hot";
  if (score >= 5) return "Soon";
  return "Routine";
}

function buildRecommendedAction(
  input: QualifyInput,
  score: number,
): string {
  const prefersText = input.preferredContact === "Text message";
  const prefersPhone = input.preferredContact === "Phone call";
  const prefersEmail = input.preferredContact === "Email";

  if (score >= 8 && prefersText) {
    return "Text them within 5 minutes. Confirm the address and offer a same-day window.";
  }
  if (score >= 8 && prefersPhone) {
    return "Call within 10 minutes. Ask for a quick photo if it helps, then book same-day.";
  }
  if (score >= 8) {
    return "Reply within 15 minutes with your next open slot and a clear arrival time.";
  }
  if (prefersPhone) {
    return "Call within 30 minutes. Give a rough price range and two times you can show up.";
  }
  if (prefersEmail) {
    return "Email a simple quote within 2 hours with a link or two to book online.";
  }
  return "Send a short reply, ask two quick questions, and offer your next two visit times.";
}

function trimDescription(text: string, max = 120): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/**
 * Mock lead scoring + recap. Later: swap for OpenAI with the same JSON shape.
 */
export function mockQualifyLead(input: QualifyInput): QualifyResult {
  const base = URGENCY_BASE[input.urgency] ?? 5;
  const urgencyScore = scoreFromDescription(input.description, base);

  const serviceKey = VALUE_BY_SERVICE[input.serviceType]
    ? input.serviceType
    : "Other";
  const range = adjustRangeForKeywords(
    input.description,
    input.serviceType,
    VALUE_BY_SERVICE[serviceKey],
  );
  const valueLow = Math.round(range[0]);
  const valueHigh = Math.round(range[1]);
  const estimatedValue = moneyRange(valueLow, valueHigh);

  const recommendedAction = buildRecommendedAction(input, urgencyScore);

  const heat = heatLabel(urgencyScore);
  const descShort = trimDescription(input.description);
  const how =
    input.preferredContact === "Text message"
      ? "Wants texts"
      : input.preferredContact === "Phone call"
        ? "Wants a phone call"
        : "Wants email";

  const aiSummary = `${heat} ${input.serviceType} job in ${input.location}. ${descShort} ${how}.`;

  return {
    aiSummary,
    urgencyScore,
    estimatedValue,
    recommendedAction,
    valueLow,
    valueHigh,
  };
}
