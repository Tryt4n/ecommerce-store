import { isValid, startOfDay, subDays } from "date-fns";
import { dateFormatter } from "./formatters";

export const RANGE_OPTIONS = {
  last_3_days: {
    label: "Last 3 days",
    startDate: startOfDay(subDays(new Date(), 2)),
    endDate: null,
  },
  last_7_days: {
    label: "Last 7 days",
    startDate: startOfDay(subDays(new Date(), 6)),
    endDate: null,
  },
  last_30_days: {
    label: "Last 30 days",
    startDate: startOfDay(subDays(new Date(), 29)),
    endDate: null,
  },
  last_90_days: {
    label: "Last 90 days",
    startDate: startOfDay(subDays(new Date(), 89)),
    endDate: null,
  },
  last_year: {
    label: "Last 365 days",
    startDate: startOfDay(subDays(new Date(), 364)),
    endDate: null,
  },
  all_time: {
    label: "All time",
    startDate: null,
    endDate: null,
  },
} as const;

export function getRangeOption(range?: string, from?: string, to?: string) {
  if (!range) {
    const startDate = new Date(from || "");
    const endDate = new Date(to || "");

    if (!isValid(startDate) || !isValid(endDate)) return;

    return {
      label: `${dateFormatter(startDate)} - ${dateFormatter(endDate)}`,
      startDate: startDate,
      endDate: endDate,
    };
  }

  return RANGE_OPTIONS[range as keyof typeof RANGE_OPTIONS];
}
