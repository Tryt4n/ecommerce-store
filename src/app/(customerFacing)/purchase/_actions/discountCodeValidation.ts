"use server";

import { getDiscountCode } from "@/db/adminData/discountCodes";
import type { ShoppingCart } from "@/types/shoppingCart";

type ProductWithOldPrice = ShoppingCart[number] & {
  oldPriceInCents: number;
};

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

  let discountedAmount = 0;
  let discountedProduct = null;
  const allProducts: ProductWithOldPrice[] = products.map((product) => ({
    ...product,
    oldPriceInCents: product.priceInCents,
  }));

  if (discountCodeDB.allProducts) {
    // Calculate total order value
    const totalOrderValue = products.reduce(
      (sum, product) => sum + product.priceInCents * product.quantity,
      0
    );

    // Calculate discount for entire order
    if (discountCodeDB.discountType === "PERCENTAGE") {
      discountedAmount = Math.round(
        totalOrderValue * (discountCodeDB.discountAmount / 100)
      );
    } else {
      // FIXED discount
      discountedAmount = discountCodeDB.discountAmount * 100; // Multiply by 100 because is in cents
    }

    // Apply discount proportionally to all products
    const discountRatio = 1 - discountedAmount / totalOrderValue;
    allProducts.forEach((product) => {
      const oldPriceInCents = product.priceInCents;
      product.oldPriceInCents = oldPriceInCents;
      product.priceInCents = Math.round(oldPriceInCents * discountRatio);
    });
  } else {
    // Single product discount
    const targetProduct = products.find((product) =>
      discountCodeDB.products.some((p) => p.id === product.id)
    );

    if (targetProduct) {
      // Calculate discount per unit
      let discountPerUnit = 0;
      if (discountCodeDB.discountType === "PERCENTAGE") {
        discountPerUnit = Math.round(
          targetProduct.priceInCents * (discountCodeDB.discountAmount / 100)
        );
      } else {
        // FIXED discount per unit
        discountPerUnit = Math.min(
          discountCodeDB.discountAmount,
          targetProduct.priceInCents
        );
      }

      // Calculate total discount for all units of the product
      discountedAmount = discountPerUnit * targetProduct.quantity;

      // Find the product in allProducts and update it
      const productIndex = allProducts.findIndex(
        (p) => p.id === targetProduct.id
      );
      if (productIndex !== -1) {
        discountedProduct = {
          ...allProducts[productIndex],
          oldPriceInCents: allProducts[productIndex].priceInCents,
          priceInCents:
            allProducts[productIndex].priceInCents - discountPerUnit,
        };
        allProducts[productIndex] = discountedProduct;
      }
    }
  }

  return {
    success: true,
    allProducts,
    discountedProduct,
    discountedAmount,
  };
}
