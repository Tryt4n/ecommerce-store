import db from "@/db/init";
import type { DiscountCode, Prisma, Product } from "@prisma/client";

export function usableDiscountCodeWhere(productId: Product["id"]) {
  return {
    isActive: true,
    AND: [
      {
        OR: [{ allProducts: true }, { products: { some: { id: productId } } }],
      },
      {
        OR: [{ limit: null }, { limit: { gt: db.discountCode.fields.uses } }],
      },
      {
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    ],
  } satisfies Prisma.DiscountCodeWhereInput;
}

export function getDiscountedAmount(
  discountAmount: DiscountCode["discountAmount"],
  discountType: DiscountCode["discountType"],
  priceInCents: Product["priceInCents"]
) {
  switch (discountType) {
    case "PERCENTAGE":
      return Math.max(
        1,
        Math.ceil(priceInCents - priceInCents * (discountAmount / 100))
      );
    case "FIXED":
      return Math.max(1, Math.ceil(priceInCents - discountAmount * 100));
    default:
      throw new Error(`Invalid discount type ${discountType satisfies never}`);
  }
}
