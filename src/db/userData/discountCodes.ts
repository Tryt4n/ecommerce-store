"use server";

import db from "../init";
import { usableDiscountCodeWhere } from "@/lib/discountCodeHelpers";
import type { DiscountCode, Product } from "@prisma/client";

export async function checkDiscountCode(
  coupon: DiscountCode["code"],
  productId: Product["id"]
) {
  try {
    return await db.discountCode.findUnique({
      where: { ...usableDiscountCodeWhere(productId), code: coupon },
      select: {
        id: true,
        code: true,
        discountAmount: true,
        discountType: true,
      },
    });
  } catch (error) {
    console.error(`Error getting discount code. Error: ${error}`);
  }
}
