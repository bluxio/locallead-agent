import type { ActivityItem } from "@/types/activity";
import type { Lead } from "@/types/lead";
import { mockQualifyLead } from "@/lib/mock-qualify";

function daysAgo(days: number, hours = 10, minutes = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

type SeedSpec = {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  location: string;
  urgency: string;
  preferredContact: string;
  description: string;
  status: Lead["status"];
  createdAt: string;
  firstContactAt?: string;
};

const SEED_SPECS: SeedSpec[] = [
  {
    id: "seed-hvac-plano-rush",
    name: "Sarah Chen",
    phone: "(972) 555-0142",
    email: "sarah.chen@email.com",
    serviceType: "HVAC",
    location: "Plano, TX",
    urgency: "Emergency / same day",
    preferredContact: "Text message",
    description:
      "Upstairs AC not cooling since last night. Thermostat at 78°F, kids home from school.",
    status: "New",
    createdAt: daysAgo(0, 8, 12),
  },
  {
    id: "seed-plumbing-dallas",
    name: "Marcus Webb",
    phone: "(214) 555-0288",
    email: "marcus.webb@email.com",
    serviceType: "Plumbing",
    location: "Dallas, TX",
    urgency: "Within 24–48 hours",
    preferredContact: "Phone call",
    description:
      "Kitchen sink draining slowly, gurgling when dishwasher runs. Started two days ago.",
    status: "Contacted",
    createdAt: daysAgo(1, 14, 5),
    firstContactAt: daysAgo(1, 15, 20),
  },
  {
    id: "seed-roofing-frisco",
    name: "Linda Okonkwo",
    phone: "(469) 555-0311",
    email: "linda.o@email.com",
    serviceType: "Roofing",
    location: "Frisco, TX",
    urgency: "This week",
    preferredContact: "Email",
    description:
      "Shingles lifted after last storm near the garage. Small leak in attic during rain.",
    status: "New",
    createdAt: daysAgo(2, 11, 40),
  },
  {
    id: "seed-electrical-mckinney",
    name: "James Rivera",
    phone: "(469) 555-0194",
    email: "jrivera@email.com",
    serviceType: "Electrical",
    location: "McKinney, TX",
    urgency: "Emergency / same day",
    preferredContact: "Text message",
    description:
      "Half the kitchen outlets dead after a breaker trip. Need someone today if possible.",
    status: "New",
    createdAt: daysAgo(0, 7, 45),
  },
  {
    id: "seed-hvac-allen-booked",
    name: "Patricia Gomez",
    phone: "(972) 555-0440",
    email: "pat.gomez@email.com",
    serviceType: "HVAC",
    location: "Allen, TX",
    urgency: "Within 24–48 hours",
    preferredContact: "Phone call",
    description: "Annual tune-up plus check on a noisy outdoor unit.",
    status: "Booked",
    createdAt: daysAgo(4, 9, 0),
    firstContactAt: daysAgo(4, 9, 35),
  },
  {
    id: "seed-plumbing-richardson-lost",
    name: "David Kim",
    phone: "(972) 555-0522",
    email: "david.kim@email.com",
    serviceType: "Plumbing",
    location: "Richardson, TX",
    urgency: "Planning / flexible",
    preferredContact: "Text message",
    description: "Quote for water heater replacement in garage—flexible on timing.",
    status: "Lost",
    createdAt: daysAgo(6, 16, 10),
    firstContactAt: daysAgo(6, 17, 0),
  },
];

function specToLead(spec: SeedSpec): Lead {
  const qualify = mockQualifyLead({
    name: spec.name,
    serviceType: spec.serviceType,
    location: spec.location,
    urgency: spec.urgency,
    preferredContact: spec.preferredContact,
    description: spec.description,
  });
  return {
    ...spec,
    ...qualify,
  };
}

/** Realistic North Dallas–area sample jobs for first-time visitors. */
export function getSampleLeads(): Lead[] {
  return SEED_SPECS.map(specToLead);
}

export function getSampleActivity(leads: Lead[]): ActivityItem[] {
  const items: ActivityItem[] = leads.map((lead) => ({
    id: `act-new-${lead.id}`,
    at: lead.createdAt,
    message: `New lead — ${lead.name} · ${lead.serviceType} (${lead.location})`,
  }));

  const contacted = leads.find((l) => l.status === "Contacted");
  if (contacted?.firstContactAt) {
    items.push({
      id: `act-contacted-${contacted.id}`,
      at: contacted.firstContactAt,
      message: `${contacted.name} — marked as Contacted`,
    });
  }

  const booked = leads.find((l) => l.status === "Booked");
  if (booked?.firstContactAt) {
    items.push({
      id: `act-booked-${booked.id}`,
      at: daysAgo(3, 11, 0),
      message: `${booked.name} — booked`,
    });
  }

  return items.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
}
