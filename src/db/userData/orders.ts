"use server";

import db from "../init";
import type { User } from "@prisma/client";

export async function getAllUserOrders(email: User["email"]) {
  try {
    return await db.order.findMany({
      where: { user: { email } },
      select: {
        id: true,
        createdAt: true,
        isPaid: true,
        receiptUrl: true,
        checkoutSessionUrl: true,
        invoicePdfUrl: true,
        orderItems: {
          select: {
            id: true,
            quantity: true,
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
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    `Could not get all orders for user ${email}. Error: ${error}`;
  }
}
