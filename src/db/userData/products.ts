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
        orderBy: { OrderItem: { _count: "desc" } },
        take: numberOfProducts,
        include: {
          categories: { select: { category: { select: { name: true } } } },
          images: {
            take: 1,
            where: { isMainForProduct: true },
            select: { url: true },
          },
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
          images: {
            take: 1,
            where: { isMainForProduct: true },
            select: { url: true },
          },
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
    take: number | undefined = undefined,
    searchQuery: string | undefined = undefined
  ) => {
    try {
      const products = await db.product.findMany({
        where: {
          isAvailableForPurchase: true,
          name: { contains: searchQuery, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
          priceInCents: true,
          isAvailableForPurchase: true,
          description: true,
          OrderItem: { select: { quantity: true } },
          categories: { select: { category: { select: { name: true } } } },
          images: {
            take: 1,
            where: { isMainForProduct: true },
            select: { url: true },
          },
        },
        // Sort by the given `orderBy` and then by `name` in ascending order in case of the same `orderBy` value
        orderBy: [{ [orderBy]: type }, { name: "asc" }],
        skip: skip,
        take: take,
      });

      // Add `_count` property to each product to store the total quantity of the product sold
      const transformedProducts = products.map((product) => {
        const _count = product.OrderItem.reduce(
          (total, orderItem) => total + orderItem.quantity,
          0
        );

        return {
          ...product,
          _count,
        };
      });

      return filterProductCategories(transformedProducts);
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

export async function getAllAvailableProductsCount(
  searchQuery: string | undefined = undefined
) {
  try {
    return await db.product.count({
      where: {
        isAvailableForPurchase: true,
        name: { contains: searchQuery, mode: "insensitive" },
      },
    });
  } catch (error) {
    console.error(`Can't get products count. Error: ${error}`);
  }
}

export async function getAllAvailableProductsIds() {
  try {
    return await db.product.findMany({
      where: { isAvailableForPurchase: true },
      select: { id: true, updatedAt: true },
    });
  } catch (error) {
    console.error(`Can't get products IDs. Error: ${error}`);
  }
}
