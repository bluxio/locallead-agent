import { SiteShell } from "@/components/layout/site-shell";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

import { DemoWorkspace } from "./demo-workspace";

export default function DemoPage() {
  return (
    <SiteShell>
      <div className={cn(PAGE_GUTTER, "py-12 sm:py-16")}>
        <div className="mb-10 max-w-2xl space-y-4 lg:mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
            Guided intake
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Log a homeowner request
          </h1>
          <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-[17px]">
            Fill it out the way a customer would. On desktop, the owner preview updates
            as you type. When you submit, the job appears on your command center with
            any existing sample jobs.
          </p>
        </div>
        <DemoWorkspace />
      </div>
    </SiteShell>
  );
}
