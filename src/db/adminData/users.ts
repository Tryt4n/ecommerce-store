"use server";

import { notFound } from "next/navigation";
import db from "../init";
import { getCreatedAtQuery } from "@/lib/dashboardDataHelpers";
import type { Prisma, User } from "@prisma/client";
import type { SortingType } from "@/types/sort";
import type { DateRange } from "@/types/ranges";

export async function deleteUser(id: User["id"]) {
  try {
    const user = await db.user.delete({ where: { id } });

    if (user == null) return notFound();
  } catch (error) {
    console.error(`Can't delete user. Error: ${error}`);
  }
}

export async function getUsers(
  orderBy: keyof User = "createdAt",
  type: SortingType = "desc",
  dateRange?: DateRange
) {
  try {
    let createdAtQuery: Prisma.DateTimeFilter | undefined;

    if (dateRange) {
      createdAtQuery = getCreatedAtQuery(dateRange);
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        orders: {
          select: {
            id: true,
            pricePaidInCents: true,
            product: true,
            productId: true,
          },
        },
      },
      orderBy: { [orderBy]: type },
      where: { createdAt: createdAtQuery },
    });

    const usersOrdersValue = users.map((user) => ({
      ...user,
      ordersValue: user.orders.reduce(
        (sum, order) => sum + order.pricePaidInCents,
        0
      ),
    }));

    return usersOrdersValue;
  } catch (error) {
    console.error(`Can't get users. Error: ${error}`);
  }
}
