"use server";

import { notFound } from "next/navigation";
import db from "@/db/init";
import { getCreatedAtQuery } from "@/lib/dashboardDataHelpers";
import type { z } from "zod";
import type { addDiscountSchema } from "@/lib/zod/discount";
import type { DiscountCode, Prisma } from "@prisma/client";
import type { SortingType } from "@/types/sort";
import type { DateRange } from "@/types/ranges";

export async function createDiscountCode(
  data: z.infer<typeof addDiscountSchema>
) {
  try {
    const { productIds, categories } = data;

    return await db.discountCode.create({
      data: {
        code: data.code,
        discountAmount: data.discountAmount,
        discountType: data.discountType,
        // Make sure allProducts is false if categories are selected
        allProducts:
          categories && categories.length > 0 ? false : data.allProducts,
        // Connect all products
        products:
          productIds != null
            ? { connect: productIds.map((id) => ({ id })) }
            : undefined,
        // Connect all categories
        categories:
          categories != null
            ? { connect: categories.map((name) => ({ name })) }
            : undefined,
        expiresAt: data.expiresAt,
        limit: data.limit,
      },
    });
  } catch (error) {
    console.error(`Can't create discount code. Error: ${error}`);
  }
}

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  OR: [
    { limit: { not: null, lte: db.discountCode.fields.uses } },
    { expiresAt: { not: null, lte: new Date() } },
  ],
};

const SELECT_FIELDS: Prisma.DiscountCodeSelect = {
  id: true,
  allProducts: true,
  code: true,
  discountAmount: true,
  discountType: true,
  expiresAt: true,
  limit: true,
  uses: true,
  isActive: true,
  products: { select: { name: true, id: true }, orderBy: { name: "asc" } },
  categories: { select: { name: true, id: true }, orderBy: { name: "asc" } },
  _count: { select: { orders: true } },
};

export async function getDiscountCodes(
  orderBy: keyof DiscountCode = "createdAt",
  type: SortingType = "desc",
  dateRange?: DateRange
) {
  try {
    let createdAtQuery: Prisma.DateTimeFilter | undefined;

    if (dateRange) {
      createdAtQuery = getCreatedAtQuery(dateRange);
    }

    const [unexpiredDiscountCodes, expiredDiscountCodes] =
      await db.$transaction([
        db.discountCode.findMany({
          where: { NOT: WHERE_EXPIRED, createdAt: createdAtQuery },
          select: SELECT_FIELDS,
          orderBy: { [orderBy]: type },
        }),
        db.discountCode.findMany({
          where: { ...WHERE_EXPIRED, createdAt: createdAtQuery },
          select: SELECT_FIELDS,
          orderBy: { [orderBy]: type },
        }),
      ]);

    return {
      unexpiredDiscountCodes: unexpiredDiscountCodes,
      expiredDiscountCodes: expiredDiscountCodes,
    };
  } catch (error) {
    console.error(`Error getting discount codes. Error: ${error}`);
  }
}

export async function toggleDiscountCodeActive(
  id: DiscountCode["id"],
  isActive: DiscountCode["isActive"]
) {
  try {
    await db.discountCode.update({
      where: { id },
      data: { isActive },
    });
  } catch (error) {
    console.error(
      `Error toggling discount code active status. Error: ${error}`
    );
  }
}

export async function deleteDiscountCode(id: DiscountCode["id"]) {
  try {
    const discountCode = await db.discountCode.delete({
      where: { id },
    });

    if (discountCode == null) return notFound();
  } catch (error) {
    console.error(`Error deleting discount code. Error: ${error}`);
  }
}

export async function getDiscountCode(code: DiscountCode["code"]) {
  try {
    return await db.discountCode.findUnique({
      where: { code },
      select: SELECT_FIELDS,
    });
  } catch (error) {
    console.error(`Error getting discount code. Error: ${error}`);
  }
}

export async function updateDiscountCode(
  id: DiscountCode["id"],
  data: Partial<
    z.infer<typeof addDiscountSchema> & Prisma.DiscountCodeUpdateInput
  >
) {
  try {
    const { productIds, categories, ...restData } = data;

    return await db.$transaction([
      // Disconnect all existing products and categories
      db.discountCode.update({
        where: { id },
        data: {
          products: { set: [] },
          categories: { set: [] },
        },
      }),
      // Update the discount code with new data and connect new products and categories
      db.discountCode.update({
        where: { id },
        data: {
          ...restData,
          allProducts:
            categories && categories.length > 0 ? false : data.allProducts,
          products: data.allProducts
            ? undefined
            : productIds && productIds.length > 0
              ? { connect: productIds.map((id) => ({ id })) }
              : undefined,
          categories:
            categories && categories.length > 0
              ? { connect: categories.map((name) => ({ name })) }
              : undefined,
        },
      }),
    ]);
  } catch (error) {
    console.error(`Error updating discount code. Error: ${error}`);
  }
}
