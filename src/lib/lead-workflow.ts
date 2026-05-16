import { mockQualifyLead } from "@/lib/mock-qualify";
import type { Lead } from "@/types/lead";

/** Returns stored workflow steps or regenerates them for older saved leads. */
export function getLeadWorkflow(lead: Lead): string[] {
  if (lead.recommendedWorkflow && lead.recommendedWorkflow.length > 0) {
    return lead.recommendedWorkflow;
  }
  return (
    mockQualifyLead({
      name: lead.name,
      serviceType: lead.serviceType,
      location: lead.location,
      urgency: lead.urgency,
      preferredContact: lead.preferredContact,
      description: lead.description,
    }).recommendedWorkflow ?? []
  );
}
