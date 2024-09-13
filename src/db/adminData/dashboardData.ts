"use server";

import db from "@/db/init";
import {
  calculateRevenueByProduct,
  createAndUpdateDaysArray,
} from "@/lib/dashboardDataHelpers";
import { startOfDay } from "date-fns";
import type { Prisma } from "@prisma/client";

export async function getDashboardData(
  createdAfter: Date | null,
  createdBefore: Date | null
) {
  try {
    const createdAtQuery: Prisma.DateTimeFilter = {};
    if (createdAfter) createdAtQuery.gt = createdAfter;
    if (createdBefore) createdAtQuery.lt = createdBefore;

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
        where: { createdAt: createdAtQuery },
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
        where: { createdAt: createdAtQuery },
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
        where: { createdAt: createdAtQuery },
      }),
    ]);

    const updatedUsersCreationDates = createAndUpdateDaysArray({
      dataArray: usersCreationDates,
      startingDate: createdAfter,
      endingDate: createdBefore,
      defaultStartingDate: startOfDay(ordersData[0].createdAt),
      dateKey: "createdAt",
      valueKey: "totalUsers",
    });

    const updatedOrdersData = createAndUpdateDaysArray({
      dataArray: ordersData,
      startingDate: createdAfter,
      endingDate: createdBefore,
      defaultStartingDate: startOfDay(ordersData[0].createdAt),
      dateKey: "createdAt",
      valueKey: "totalSales",
      valueToTransformWith: "pricePaidInCents",
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
        usersCreationDates: updatedUsersCreationDates,
        ordersCreationData: updatedOrdersData,
        revenueByProduct: productsWithRevenue,
      },
    };
  } catch (error) {
    console.error(`Can't get dashboard data. Error: ${error}`);
  }
}
