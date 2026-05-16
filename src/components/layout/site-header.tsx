import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAGE_GUTTER } from "@/lib/layout";

const nav = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "New request" },
  { href: "/dashboard", label: "Command center" },
];

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/35 bg-background/70 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/55",
        className,
      )}
    >
      <div
        className={cn(PAGE_GUTTER, "flex h-[3.25rem] items-center justify-between gap-4")}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground transition-opacity duration-150 hover:opacity-85"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/20 ring-1 ring-black/[0.04] dark:ring-white/10">
            LL
          </span>
          <span className="hidden text-[15px] sm:inline">LocalLead Agent</span>
        </Link>
        <nav className="flex items-center gap-0.5 text-[13px] font-medium">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted/90 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
