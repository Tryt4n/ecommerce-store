"use server";

import db from "./db";
import { cache } from "@/lib/cache";

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

export async function getProduct(id: string) {
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

export const getProducts = cache(async () => {
  try {
    const products = await db.product.findMany({
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
      orderBy: { name: "asc" },
    });

    return products;
  } catch (error) {
    console.error(`Can't get products. Error: ${error}`);
  }
}, ["/products", "getProducts"]);
