"use server";

import db from "../init";
import { usableDiscountCodeWhere } from "@/lib/discountCodeHelpers";
import type { DiscountCode, Prisma, Product } from "@prisma/client";

export async function getDiscountCode(
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

export async function updateDiscountCode(
  discountCodeId: DiscountCode["id"],
  data: Prisma.DiscountCodeUpdateInput
) {
  try {
    return await db.discountCode.update({
      where: { id: discountCodeId },
      data,
    });
  } catch (error) {
    console.error(`Error updating discount code. Error: ${error}`);
  }
}
