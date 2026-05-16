"use client";

import { useState } from "react";
import {
  CalendarPlus,
  CheckCircle,
  MessageSquare,
  Phone,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { buildCustomerAutoText } from "@/lib/lead-comms";
import type { Lead } from "@/types/lead";
import { cn } from "@/lib/utils";

/** Placeholder scheduling URL — replace with your real booking page in production. */
const SAMPLE_BOOKING_URL = "https://book.example.com/schedule";

type Props = {
  lead: Lead;
  onMarkContacted: () => void;
  onMarkBooked: () => void;
  className?: string;
};

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * One-tap follow-up strip. Later: Twilio Programmable SMS from “Text customer”;
 * voice from “Call now”; calendar deep link for “Send booking link”.
 */
export function LeadFollowUpActions({
  lead,
  onMarkContacted,
  onMarkBooked,
  className,
}: Props) {
  const [bookingHint, setBookingHint] = useState(false);
  const digits = digitsOnly(lead.phone);
  const body = buildCustomerAutoText(lead);
  const telHref = digits ? `tel:${digits}` : undefined;
  const smsHref = digits
    ? `sms:${digits}?body=${encodeURIComponent(body)}`
    : undefined;

  function copyBookingLink() {
    void navigator.clipboard.writeText(SAMPLE_BOOKING_URL);
    setBookingHint(true);
    window.setTimeout(() => setBookingHint(false), 2200);
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 border-t border-border/35 pt-3 md:border-t-0 md:pt-0 lg:max-w-[340px]",
        className,
      )}
    >
      {telHref ? (
        <a
          href={telHref}
          className={buttonVariants({ variant: "outline", size: "sm" })}
          aria-label={`Call ${lead.name}`}
        >
          <Phone className="size-3.5" />
          Call now
        </a>
      ) : (
        <Button type="button" variant="outline" size="sm" disabled>
          <Phone className="size-3.5" />
          Call now
        </Button>
      )}
      {smsHref ? (
        <a
          href={smsHref}
          className={buttonVariants({ variant: "outline", size: "sm" })}
          aria-label={`Text ${lead.name} with draft message`}
        >
          <MessageSquare className="size-3.5" />
          Text customer
        </a>
      ) : (
        <Button type="button" variant="outline" size="sm" disabled>
          <MessageSquare className="size-3.5" />
          Text customer
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={copyBookingLink}
      >
        <CalendarPlus className="size-3.5" />
        Booking link
      </Button>
      {bookingHint && (
        <span className="w-full text-xs text-muted-foreground md:w-auto">
          Booking link copied — paste into your text or email.
        </span>
      )}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={
          lead.status === "Contacted" ||
          lead.status === "Booked" ||
          lead.status === "Lost"
        }
        onClick={onMarkContacted}
      >
        <CheckCircle className="size-3.5" />
        Mark contacted
      </Button>
      <Button
        type="button"
        variant="default"
        size="sm"
        disabled={lead.status === "Booked" || lead.status === "Lost"}
        onClick={onMarkBooked}
      >
        Mark booked
      </Button>
    </div>
  );
}
