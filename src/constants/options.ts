export const SERVICE_TYPES = [
  "Plumbing",
  "HVAC",
  "Roofing",
  "Electrical",
  "Handyman",
  "General contracting",
  "Other",
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const URGENCY_OPTIONS = [
  { value: "Emergency / same day", label: "Emergency / same day" },
  { value: "Within 24–48 hours", label: "Within 24–48 hours" },
  { value: "This week", label: "This week" },
  { value: "Planning / flexible", label: "Planning / flexible" },
] as const;

export const CONTACT_METHODS = [
  { value: "Phone call", label: "Phone call" },
  { value: "Text message", label: "Text message" },
  { value: "Email", label: "Email" },
] as const;
