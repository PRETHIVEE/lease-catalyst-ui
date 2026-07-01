import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

import type { EventsMonthGroup } from "../types";
import EventCard from "./EventCard";

type EventsMonthSectionProps = {
  group: EventsMonthGroup;
  sentReminderIds: Set<string>;
  sendingReminderId: string | null;
  onSendReminder: (eventId: string) => void;
};

const EventsMonthSection = ({
  group,
  sentReminderIds,
  sendingReminderId,
  onSendReminder,
}: EventsMonthSectionProps) => {
  return (
    <AccordionItem
      value={group.monthKey}
      className="border-0 not-last:border-b-0 not-last:mb-1"
      style={{ border: "1px solid #e0e0e0", borderRadius: "0.25rem" }}
    >
      <AccordionTrigger className="items-center gap-2 py-2.5 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:hidden px-4">
        <ChevronDown
          className="size-4 shrink-0 text-[#243b53] transition-transform group-aria-expanded/accordion-trigger:rotate-180"
          aria-hidden
        />
        <span className="text-[0.92rem] font-semibold text-[#243b53]">
          {group.label}
        </span>
      </AccordionTrigger>

      <AccordionContent className="pb-0 [&>div]:h-auto">
        <ul className="flex flex-col gap-2.5 py-3 px-4">
          {group.events.map((event) => (
            <li key={event.id}>
              <EventCard
                event={event}
                reminderSent={sentReminderIds.has(event.id)}
                isSendingReminder={sendingReminderId === event.id}
                onSendReminder={onSendReminder}
              />
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

export default EventsMonthSection;
