"use server";

import db from "@/db/init";
import {
  calculateRevenueByProduct,
  createAndUpdateDaysArray,
  getCreatedAtQuery,
  getDateRange,
} from "@/lib/dashboardDataHelpers";
import { startOfDay } from "date-fns";
import type { Prisma } from "@prisma/client";
import type { DateRange } from "@/types/ranges";

export type ChartsDateRange = {
  salesDataRangeData: DateRange;
  customersDataRangeData: DateRange;
  revenueByProductData: DateRange;
};

export type DashboardDateParam = DateRange | ChartsDateRange;

export async function getDashboardData(dateRange: DashboardDateParam) {
  try {
    let createdAtQuery: Prisma.DateTimeFilter | undefined;
    let createdAtQueryForSalesDataRangeData: Prisma.DateTimeFilter | undefined;
    let createdAtQueryForCustomersDataRangeData:
      | Prisma.DateTimeFilter
      | undefined;
    let createdAtQueryForRevenueByProductData:
      | Prisma.DateTimeFilter
      | undefined;

    if ("createdAfter" in dateRange && "createdBefore" in dateRange) {
      createdAtQuery = getCreatedAtQuery(dateRange);
    } else {
      createdAtQueryForSalesDataRangeData = getCreatedAtQuery(
        dateRange.salesDataRangeData
      );
      createdAtQueryForCustomersDataRangeData = getCreatedAtQuery(
        dateRange.customersDataRangeData
      );
      createdAtQueryForRevenueByProductData = getCreatedAtQuery(
        dateRange.revenueByProductData
      );
    }

    const [
      usersCount,
      usersCreationDates,
      salesData,
      ordersData,
      activeProductsCount,
      inactiveProductsCount,
      productsData,
    ] = await db.$transaction([
      // usersCount
      db.user.count(),
      // usersCreationDates
      db.user.findMany({
        select: { createdAt: true },
        where: {
          createdAt: createdAtQuery || createdAtQueryForCustomersDataRangeData,
        },
        orderBy: { createdAt: "asc" },
      }),
      // salesData
      db.order.aggregate({
        _sum: { pricePaidInCents: true },
        _count: true,
      }),
      // ordersData
      db.order.findMany({
        select: { createdAt: true, pricePaidInCents: true },
        where: {
          createdAt: createdAtQuery || createdAtQueryForSalesDataRangeData,
        },
        orderBy: { createdAt: "asc" },
      }),
      // activeProducts
      db.product.count({
        where: { isAvailableForPurchase: true },
      }),
      // inactiveProducts
      db.product.count({
        where: { isAvailableForPurchase: false },
      }),
      // productsData
      db.product.findMany({
        select: { name: true, orders: { select: { pricePaidInCents: true } } },
        where: {
          createdAt: createdAtQuery || createdAtQueryForRevenueByProductData,
        },
      }),
    ]);

    const { startingDate: salesStartingDate, endingDate: salesEndingDate } =
      getDateRange(dateRange, "salesDataRangeData");

    const updatedOrdersData = createAndUpdateDaysArray({
      dataArray: ordersData,
      startingDate: salesStartingDate,
      endingDate: salesEndingDate,
      defaultStartingDate:
        ordersData.length > 0
          ? startOfDay(ordersData[0].createdAt)
          : new Date(),
      dateKey: "createdAt",
      valueKey: "totalSales",
      valueToTransformWith: "pricePaidInCents",
    });

    const {
      startingDate: customersStartingDate,
      endingDate: customersEndingDate,
    } = getDateRange(dateRange, "customersDataRangeData");

    const updatedUsersCreationDates = createAndUpdateDaysArray({
      dataArray: usersCreationDates,
      startingDate: customersStartingDate,
      endingDate: customersEndingDate,
      defaultStartingDate:
        ordersData.length > 0
          ? startOfDay(ordersData[0].createdAt)
          : new Date(),
      dateKey: "createdAt",
      valueKey: "totalUsers",
    });

    const productsWithRevenue = calculateRevenueByProduct(productsData);

    return {
      usersData: {
        usersCount,
        averageValuePerUser:
          usersCount === 0
            ? 0
            : (salesData._sum.pricePaidInCents || 0) / usersCount / 100,
      },
      productsData: {
        activeProductsCount,
        inactiveProductsCount,
      },
      salesData: {
        amount: (salesData._sum.pricePaidInCents || 0) / 100,
        numberOfSales: salesData._count,
      },
      chartsData: {
        salesDataRangeData: updatedOrdersData,
        customersDataRangeData: updatedUsersCreationDates,
        revenueByProductData: productsWithRevenue,
      },
    };
  } catch (error) {
    console.error(`Can't get dashboard data. Error: ${error}`);
  }
}
