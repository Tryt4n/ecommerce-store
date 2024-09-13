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
