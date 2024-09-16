"use server";

import { notFound } from "next/navigation";
import db from "../init";
import type { Order } from "@prisma/client";
import type { SortingType } from "@/types/sort";

export async function getOrders(
  orderBy: keyof Order = "createdAt",
  type: SortingType = "asc"
) {
  try {
    return db.order.findMany({
      select: {
        id: true,
        pricePaidInCents: true,
        product: true,
        user: true,
        discountCode: {
          select: { code: true, discountType: true, discountAmount: true },
        },
      },
      orderBy: { [orderBy]: type },
    });
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
