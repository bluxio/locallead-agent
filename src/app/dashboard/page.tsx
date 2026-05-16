import { SiteShell } from "@/components/layout/site-shell";
import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  return (
    <SiteShell>
      <DashboardClient />
    </SiteShell>
  );
}
