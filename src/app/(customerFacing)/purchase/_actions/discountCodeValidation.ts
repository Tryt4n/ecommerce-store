"use server";

import { getDiscountCode } from "@/db/adminData/discountCodes";
import type { ShoppingCart } from "@/types/shoppingCart";

export async function validateDiscountCode(
  products: ShoppingCart,
  prevState: unknown,
  formData: FormData
) {
  const discountCode = formData.get("discountCode") as string;

  if (!discountCode || discountCode === "") {
    return { error: "Enter discount code." };
  }

  const discountCodeDB = discountCode
    ? await getDiscountCode(discountCode)
    : undefined;

  if (!discountCodeDB) {
    return { error: "Invalid discount code." };
  }

  const discountedProducts = products.map((product) => {
    const oldPriceInCents = product.priceInCents;
    let priceInCents = product.priceInCents;
    if (
      discountCodeDB.allProducts ||
      discountCodeDB.products.some((p) => p.id === product.id)
    ) {
      if (discountCodeDB.discountType === "PERCENTAGE") {
        priceInCents = Math.round(
          priceInCents * (1 - discountCodeDB.discountAmount / 100)
        );
      } else {
        priceInCents -= discountCodeDB.discountAmount;
      }
    }
    return { ...product, priceInCents, oldPriceInCents };
  });

  return { success: true, discountedProducts };
}
