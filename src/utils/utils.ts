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
  return dayjs.utc(isoString).local().format("YYYY-MM-DD  hh:mm A");
};

export const trimLeadingSpace = (inputValue: string) => {
  // Get the input value from parameter
  // Check if the first character is a space
  if (inputValue.charAt(0) === " ") {
    // Remove the space at the beginning
    const newValue = inputValue.trimStart();
    return newValue;
  } else {
    // If the first character is not a space, update the state normally
    return inputValue;
  }
};

export const getFileExtension = (filename: string) => {
  if (!filename || !filename.includes(".")) return "";
  return filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
};
