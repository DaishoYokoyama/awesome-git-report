import { isValid, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const getSystemTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const isValidTimezone = (tz: string): boolean => {
  try {
    formatInTimeZone(new Date(), tz, "yyyy-MM-dd");
    return true;
  } catch {
    return false;
  }
};

export const validateDate = (dateStr: string) => {
  try {
    const parsedDate = parseISO(dateStr);
    if (!isValid(parsedDate)) {
      throw new Error(`Invalid date: ${dateStr}`);
    }
    return parsedDate;
  } catch (error) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
};
