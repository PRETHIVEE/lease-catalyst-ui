import { Accordion } from "@/components/ui/accordion";
import { useSnackbarStore } from "@/store/snackbar-store";
import { useCallback, useState } from "react";

import { mockEventsByMonth } from "../data/mockEvents";
import EventsMonthSection from "./EventsMonthSection";

const defaultOpenMonths = mockEventsByMonth.map((group) => group.monthKey);

const EventsList = () => {
  const { showSnackbar } = useSnackbarStore();
  const [sentReminderIds, setSentReminderIds] = useState<Set<string>>(
    () => new Set()
  );
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(
    null
  );

  const handleSendReminder = useCallback(
    (eventId: string) => {
      const event = mockEventsByMonth
        .flatMap((group) => group.events)
        .find((item) => item.id === eventId);

      if (!event || sentReminderIds.has(eventId)) {
        return;
      }

      setSendingReminderId(eventId);

      window.setTimeout(() => {
        setSendingReminderId(null);
        setSentReminderIds((previous) => new Set(previous).add(eventId));
        showSnackbar(
          `Reminder sent to ${event.tenantName} for ${event.propertyCode} - ${event.propertyName}.`,
          "success"
        );
      }, 600);
    },
    [sentReminderIds, showSnackbar]
  );

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-[#f8fafc] p-4">
      <Accordion
        type="multiple"
        defaultValue={defaultOpenMonths}
        className="w-full"
      >
        {mockEventsByMonth.map((group) => (
          <EventsMonthSection
            key={group.monthKey}
            group={group}
            sentReminderIds={sentReminderIds}
            sendingReminderId={sendingReminderId}
            onSendReminder={handleSendReminder}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default EventsList;
