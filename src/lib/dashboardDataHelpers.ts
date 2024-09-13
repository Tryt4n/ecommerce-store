import { eachDayOfInterval, interval } from "date-fns";
import { dateFormatter } from "./formatters";

type CreateAndUpdateDaysArrayParams<T> = {
  dataArray: T[];
  startingDate: Date | null;
  endingDate: Date | null;
  defaultStartingDate: Date;
  dateKey: keyof T;
  valueKey: string;
  valueToTransformWith?: keyof T;
};

export type ChartDataArrayType = ReturnType<typeof createDaysArray>;

export function createAndUpdateDaysArray<T>({
  dataArray,
  startingDate,
  endingDate,
  defaultStartingDate,
  dateKey,
  valueKey,
  valueToTransformWith,
}: CreateAndUpdateDaysArrayParams<T>) {
  const daysArray = createDaysArray(
    startingDate,
    endingDate,
    defaultStartingDate,
    valueKey
  );

  return updateDaysArrayDataByDate(
    dataArray,
    daysArray,
    dateKey,
    valueKey,
    valueToTransformWith
  );
}

function createDaysArray<T>(
  startingDate: CreateAndUpdateDaysArrayParams<T>["startingDate"],
  endingDate: CreateAndUpdateDaysArrayParams<T>["endingDate"],
  defaultStartingDate: CreateAndUpdateDaysArrayParams<T>["defaultStartingDate"],
  valueKey: CreateAndUpdateDaysArrayParams<T>["valueKey"]
) {
  const daysArrayForOrders = eachDayOfInterval(
    interval(startingDate || defaultStartingDate, endingDate || new Date())
  ).map((date) => {
    return {
      date: dateFormatter(date),
      [valueKey]: 0,
    };
  });

  return daysArrayForOrders;
}

function updateDaysArrayDataByDate<T>(
  dataArray: CreateAndUpdateDaysArrayParams<T>["dataArray"],
  daysArray: ReturnType<typeof createDaysArray>,
  dateKey: CreateAndUpdateDaysArrayParams<T>["dateKey"],
  valueKey: CreateAndUpdateDaysArrayParams<T>["valueKey"],
  valueToTransformWith?: CreateAndUpdateDaysArrayParams<T>["valueToTransformWith"]
) {
  return dataArray.reduce((data, item) => {
    const formattedDate = dateFormatter(item[dateKey] as Date);
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
