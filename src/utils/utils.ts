import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Formats a UTC ISO string to "YYYY-MM-DD  hh:mm A" in local time.
 * Input:  "2026-05-14T07:40:40.221095Z"
 * Output: "2026-05-14  10:40 PM"
 */
export const formatDateTime = (isoString: string): string => {
  return dayjs.utc(isoString).local().format("YYYY-MM-DD hh:mm A");
};
