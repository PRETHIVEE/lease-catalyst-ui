import IconButton from "@/components/common/IconButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, BellOff, Send } from "lucide-react";

import type { RentEvent } from "../types";
import { formatCurrency, formatDueDate } from "../utils/formatters";

type EventCardProps = {
  event: RentEvent;
  reminderSent: boolean;
  isSendingReminder: boolean;
  onSendReminder: (eventId: string) => void;
};

const EventCard = ({
  event,
  reminderSent,
  isSendingReminder,
  onSendReminder,
}: EventCardProps) => {
  const propertyTitle = `${event.propertyCode} - ${event.propertyName}`;

  return (
    <article className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.84rem] font-semibold text-font-color-primary">
            {propertyTitle}
          </p>
          <p className="mt-0.5 text-[0.78rem] text-[#00000070]">{event.address}</p>
        </div>

        <div className="min-w-0 flex-1 lg:max-w-xs">
          <div className="flex items-center gap-1.5">
            <p className="text-[0.84rem] font-semibold text-font-color-primary">
              Rent Payment Due Date
            </p>
            {event.notificationsMuted ? (
              <IconButton
                aria-label="Automated notifications muted for this event"
                className="pointer-events-none p-0.5 text-[#9ca3af]"
                disabled
              >
                <BellOff className="size-3.5" aria-hidden />
              </IconButton>
            ) : (
              <IconButton
                aria-label="Automated notifications enabled for this event"
                className="pointer-events-none p-0.5 text-main-theme"
                disabled
              >
                <Bell className="size-3.5" aria-hidden />
              </IconButton>
            )}
          </div>
          <p className="mt-0.5 text-[0.78rem] text-[#00000070]">
            <span className="font-medium text-font-color-primary">
              {formatCurrency(event.amount)}
            </span>{" "}
            ({event.paymentType})
          </p>
        </div>

        <p className="shrink-0 text-[0.84rem] font-semibold text-font-color-primary lg:w-24 lg:text-right">
          {formatDueDate(event.dueDate)}
        </p>

        <div className="shrink-0 lg:w-44">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={cn(
              "w-full border-main-theme text-main-theme hover:bg-[#f0fdf4]",
              reminderSent && "border-slate-300 text-[#6b7280] hover:bg-transparent"
            )}
            disabled={isSendingReminder || reminderSent}
            onClick={() => onSendReminder(event.id)}
          >
            <Send className="size-3.5" aria-hidden />
            {reminderSent
              ? "Reminder sent"
              : isSendingReminder
                ? "Sending…"
                : "Send reminder"}
          </Button>
          <p className="mt-1 truncate text-center text-[0.7rem] text-[#00000060] lg:text-right">
            {event.tenantName}
          </p>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
