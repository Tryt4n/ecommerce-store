"use server";

import { notFound } from "next/navigation";
import db from "../init";
import { getCreatedAtQuery } from "@/lib/dashboardDataHelpers";
import type { Order, Prisma } from "@prisma/client";
import type { SortingType } from "@/types/sort";
import type { DateRange } from "@/types/ranges";

export async function getOrders(
  orderBy: keyof Order = "createdAt",
  type: SortingType = "desc",
  dateRange?: DateRange
) {
  try {
    let createdAtQuery: Prisma.DateTimeFilter | undefined;

    if (dateRange) {
      createdAtQuery = getCreatedAtQuery(dateRange);
    }

    const orders = await db.order.findMany({
      select: {
        id: true,
        createdAt: true,
        pricePaidInCents: true,
        product: { select: { name: true } },
        user: true,
        discountCode: {
          select: { code: true },
        },
      },
      orderBy: { [orderBy]: type },
      where: { createdAt: createdAtQuery },
    });

    const filteredOrders = orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      pricePaidInCents: order.pricePaidInCents,
      productName: order.product.name,
      userEmail: order.user.email,
      discountCode: order.discountCode?.code,
    }));

    return filteredOrders;
  } catch (error) {
    console.error(`Can't get orders. Error: ${error}`);
  }
}

export async function deleteOrder(id: Order["id"]) {
  try {
    const order = await db.order.delete({ where: { id } });

    if (order == null) return notFound();
  } catch (error) {
    console.error(`Can't delete order. Error: ${error}`);
  }
}
