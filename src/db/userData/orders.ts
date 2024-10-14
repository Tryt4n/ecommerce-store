"use server";

import db from "../init";
import type { Product, User } from "@prisma/client";

export async function userOrderExist(
  email: User["email"],
  productId: Product["id"]
) {
  try {
    return await db.order.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getAllUserOrders(email: User["email"]) {
  try {
    return await db.order.findMany({
      where: { user: { email } },
      select: {
        id: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            images: {
              take: 1,
              where: { isMainForProduct: true },
              select: { url: true },
            },
            priceInCents: true,
            productFile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    `Could not get all orders for user ${email}. Error: ${error}`;
  }
}
