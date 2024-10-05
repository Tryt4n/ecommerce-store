"use server";

import db from "../init";
import { cache } from "@/lib/cache";
import type { Product } from "@prisma/client";
import type { SortingType } from "@/types/sort";

export const getMostPopularProducts = cache(
  async (numberOfProducts: number = 6) => {
    try {
      const products = await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: "desc" } },
        take: numberOfProducts,
        include: {
          categories: { select: { category: { select: { name: true } } } },
          images: { take: 1, select: { url: true } },
        },
      });

      return filterProductCategories(products);
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
      const products = await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: "desc" },
        take: numberOfProducts,
        include: {
          categories: { select: { category: { select: { name: true } } } },
          images: { take: 1, select: { url: true } },
        },
      });

      return filterProductCategories(products);
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
        images: { select: { id: true, url: true, isMainForProduct: true } },
        productFile: { select: { id: true, name: true, url: true } },
        categories: {
          select: { category: { select: { name: true } } },
        },
      },
    });

    if (!product) return null;

    return filterProductCategories([product])[0];
  } catch (error) {
    console.error(`Can't get product. Error: ${error}`);
  }
}

export const getAllAvailableForPurchaseProducts = cache(
  async (
    orderBy: keyof Product = "name",
    type: SortingType = "asc",
    skip: number | undefined = undefined,
    take: number | undefined = undefined
  ) => {
    try {
      const products = await db.product.findMany({
        where: { isAvailableForPurchase: true },
        select: {
          id: true,
          name: true,
          priceInCents: true,
          isAvailableForPurchase: true,
          description: true,
          _count: { select: { orders: true } },
          categories: { select: { category: { select: { name: true } } } },
          images: { take: 1, select: { url: true } },
        },
        // Sort by the given `orderBy` and then by `name` in ascending order in case of the same `orderBy` value
        orderBy: [{ [orderBy]: type }, { name: "asc" }],
        skip: skip,
        take: take,
      });

      return filterProductCategories(products);
    } catch (error) {
      console.error(`Can't get products. Error: ${error}`);
    }
  },
  ["/products", "getAllAvailableForPurchaseProducts"]
);

function filterProductCategories<
  T extends { categories: { category: { name: string } }[] },
>(products: T[]) {
  return products.map((product) => ({
    ...product,
    categories: product.categories.map((category) => category.category.name),
  }));
}

export async function getAllAvailableProductsCount() {
  try {
    return await db.product.count({ where: { isAvailableForPurchase: true } });
  } catch (error) {
    console.error(`Can't get products count. Error: ${error}`);
  }
}
