"use server";

import db from "./db";
import { cache } from "@/lib/cache";
import { usableDiscountCodeWhere } from "@/lib/discountCodeHelpers";
import type { DiscountCode, Prisma, Product, User } from "@prisma/client";

// Products
export const getMostPopularProducts = cache(
  async (numberOfProducts: number = 6) => {
    try {
      const products = db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: "desc" } },
        take: numberOfProducts,
      });

      return products;
    } catch (error) {
      console.error(`Can't get most popular products. Error: ${error}`);
    }
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 } // 24 hours
);

export const getNewestProducts = cache(
  async (numberOfProducts: number = 6) => {
    try {
      const products = db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: "desc" },
        take: numberOfProducts,
      });

      return products;
    } catch (error) {
      console.error(`Can't get newest products. Error: ${error}`);
    }
  },
  ["/", "getNewestProducts"],
  { revalidate: 60 * 60 * 24 } // 24 hours
);

export async function getProduct(id: Product["id"]) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        priceInCents: true,
        isAvailableForPurchase: true,
        filePath: true,
        imagePath: true,
      },
    });

    return product;
  } catch (error) {
    console.error(`Can't get product. Error: ${error}`);
  }
}

export const getAllAvailableForPurchaseProducts = cache(
  async (orderBy: keyof Product = "name", type: "asc" | "desc" = "asc") => {
    try {
      const products = await db.product.findMany({
        where: { isAvailableForPurchase: true },
        select: {
          id: true,
          name: true,
          priceInCents: true,
          isAvailableForPurchase: true,
          description: true,
          filePath: true,
          imagePath: true,
          _count: { select: { orders: true } },
        },
        orderBy: { [orderBy]: type },
      });

      return products;
    } catch (error) {
      console.error(`Can't get products. Error: ${error}`);
    }
  },
  ["/products", "getAllAvailableForPurchaseProducts"]
);

// Orders
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

// Discount Codes
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
