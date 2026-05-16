import Link from "next/link";

import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/35 bg-muted/25">
      <div
        className={cn(
          PAGE_GUTTER,
          "flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between sm:py-14",
        )}
      >
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-foreground">
            LocalLead Agent
          </p>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
            Helps local trades answer faster and book more jobs. Your leads stay
            on this device until you clear browser storage.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] font-medium text-muted-foreground">
          <Link
            className="transition-colors duration-150 hover:text-foreground"
            href="/demo"
          >
            Log a job request
          </Link>
          <Link
            className="transition-colors duration-150 hover:text-foreground"
            href="/dashboard"
          >
            Command center
          </Link>
          <span className="text-muted-foreground/80">
            © {new Date().getFullYear()} LocalLead Agent
          </span>
        </div>
      </div>
    </footer>
  );
}
