"use server";

import db from "@/db/db";
import type { Product } from "@prisma/client";

export async function userOrderExist(email: string, productId: Product["id"]) {
  try {
    return (
      (await db.order.findFirst({
        where: { user: { email }, productId },
        select: { id: true },
      })) != null
    );
  } catch (error) {
    console.error(error);
  }
}
