import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  endOfWeek,
  interval,
  max,
  min,
  startOfWeek,
} from "date-fns";
import { pl } from "date-fns/locale";
import { dateFormatter } from "./formatters";
import type {
  DashboardDateParam,
  ChartsDateRange,
  DateRange,
} from "@/db/adminData/dashboardData";
import type { Prisma } from "@prisma/client";

type CreateAndUpdateDaysArrayParams<T> = {
  dataArray: T[];
  startingDate: Date | null;
  endingDate: Date | null;
  defaultStartingDate: Date;
  dateKey: keyof T;
  valueKey: string;
  valueToTransformWith?: keyof T;
};

export type ChartDataArrayType = ReturnType<typeof createDaysArray>["array"];

export function createAndUpdateDaysArray<T>({
  dataArray,
  startingDate,
  endingDate,
  defaultStartingDate,
  dateKey,
  valueKey,
  valueToTransformWith,
}: CreateAndUpdateDaysArrayParams<T>) {
  const { array, format } = createDaysArray(
    startingDate,
    endingDate,
    defaultStartingDate,
    valueKey
  );

  return updateDaysArrayDataByDate(
    dataArray,
    array,
    dateKey,
    valueKey,
    format,
    valueToTransformWith
  );
}

function createDaysArray<T>(
  startingDate: CreateAndUpdateDaysArrayParams<T>["startingDate"],
  endingDate: CreateAndUpdateDaysArrayParams<T>["endingDate"],
  defaultStartingDate: CreateAndUpdateDaysArrayParams<T>["defaultStartingDate"],
  valueKey: CreateAndUpdateDaysArrayParams<T>["valueKey"]
) {
  const { array, format } = getChartDateArray(
    startingDate || defaultStartingDate,
    endingDate || new Date()
  );

  const daysArrayForOrders = array.map((date) => {
    return {
      date: format(date),
      [valueKey]: 0,
    };
  });

  return { array: daysArrayForOrders, format };
}

function updateDaysArrayDataByDate<T>(
  dataArray: CreateAndUpdateDaysArrayParams<T>["dataArray"],
  daysArray: ReturnType<typeof createDaysArray>["array"],
  dateKey: CreateAndUpdateDaysArrayParams<T>["dateKey"],
  valueKey: CreateAndUpdateDaysArrayParams<T>["valueKey"],
  format: ReturnType<typeof getChartDateArray>["format"],
  valueToTransformWith?: CreateAndUpdateDaysArrayParams<T>["valueToTransformWith"]
) {
  return dataArray.reduce((data, item) => {
    const formattedDate = format(item[dateKey] as Date);
    const entry = daysArray.find((day) => day.date === formattedDate);

    if (!entry || typeof entry[valueKey] !== "number") return data;

    if (valueToTransformWith) {
      const value = item[valueToTransformWith];
      if (typeof value === "number") {
        entry[valueKey] += value / 100;
      }
    } else {
      entry[valueKey] += 1;
    }

    return data;
  }, daysArray);
}

function getChartDateArray(startDate: Date, endDate: Date = new Date()) {
  const days = differenceInDays(endDate, startDate);
  if (days < 30) {
    return {
      array: eachDayOfInterval(interval(startDate, endDate)),
      format: dateFormatter,
    };
  }

  const weeks = differenceInWeeks(endDate, startDate);
  if (weeks < 30) {
    return {
      array: eachWeekOfInterval(interval(startDate, endDate), { locale: pl }),
      format: (date: Date) => {
        const start = max([startOfWeek(date, { weekStartsOn: 1 }), startDate]);
        const end = min([endOfWeek(date, { weekStartsOn: 1 }), endDate]);

        return `${dateFormatter(start)} - ${dateFormatter(end)}`;
      },
    };
  }

  const months = differenceInMonths(endDate, startDate);
  if (months < 30) {
    return {
      array: eachMonthOfInterval(interval(startDate, endDate)),
      format: new Intl.DateTimeFormat("pl-PL", {
        month: "long",
        year: "numeric",
      }).format,
    };
  }

  return {
    array: eachYearOfInterval(interval(startDate, endDate)),
    format: new Intl.DateTimeFormat("pl-PL", { year: "numeric" }).format,
  };
}

type Order = {
  pricePaidInCents: number;
};

type ProductWithRevenue<T> = T & {
  revenue: number;
};

export function calculateRevenueByProduct<T extends { orders: Order[] }>(
  products: T[]
): ProductWithRevenue<T>[] {
  return products
    .map((product) => {
      const revenue = product.orders.reduce((sum, order) => {
        return sum + order.pricePaidInCents / 100;
      }, 0);

      return {
        ...product,
        revenue,
      };
    })
    .filter((product) => product.revenue > 0);
}

export function getCreatedAtQuery(dateRange: DateRange): Prisma.DateTimeFilter {
  const query: Prisma.DateTimeFilter = {};
  if (dateRange.createdAfter) query.gt = dateRange.createdAfter;
  if (dateRange.createdBefore) query.lt = dateRange.createdBefore;
  return query;
}

export function getDateRange(
  dateRange: DashboardDateParam,
  dataRangeKey: keyof ChartsDateRange
): { startingDate: Date | null; endingDate: Date | null } {
  if ("createdAfter" in dateRange && "createdBefore" in dateRange) {
    return {
      startingDate: dateRange.createdAfter,
      endingDate: dateRange.createdBefore,
    };
  } else {
    const range = dateRange[dataRangeKey];
    return {
      startingDate: range.createdAfter,
      endingDate: range.createdBefore,
    };
  }
}
