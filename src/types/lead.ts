export const LEAD_STATUSES = ["New", "Contacted", "Booked", "Lost"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  location: string;
  urgency: string;
  preferredContact: string;
  description: string;
  /** Short recap for the owner (shown as “Lead summary” in the UI). */
  aiSummary: string;
  urgencyScore: number;
  estimatedValue: string;
  /** Used for revenue rollups on the board; optional on older saved rows. */
  valueLow?: number;
  valueHigh?: number;
  recommendedAction: string;
  /** Multi-step operational playbook from the qualification agent. */
  recommendedWorkflow?: string[];
  /** Gemini owner alert line when API path is used. */
  ownerNote?: string;
  status: LeadStatus;
  createdAt: string;
  /** First time the lead moved out of “New” — used for avg. response time. */
  firstContactAt?: string;
};
