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

  // Check basic discount code validity conditions
  if (
    !discountCodeDB ||
    !discountCodeDB.isActive ||
    (discountCodeDB.limit && discountCodeDB.uses >= discountCodeDB.limit) ||
    (discountCodeDB.expiresAt && new Date() > discountCodeDB.expiresAt)
  ) {
    return { error: "Invalid discount code." };
  }

  // Check if the discount code is compatible with the products in the cart
  const isCompatibleWithProducts =
    discountCodeDB.allProducts ||
    discountCodeDB.products.some((discountProduct) =>
      products.some((cartProduct) => discountProduct.id === cartProduct.id)
    );

  if (!isCompatibleWithProducts) {
    return {
      error: "Discount code is not applicable to the products in your cart.",
    };
  }

  const discountedProducts = products.map((product) => {
    const oldPriceInCents = product.priceInCents;
    let priceInCents = product.priceInCents;

    // Apply discount only to compatible products
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
