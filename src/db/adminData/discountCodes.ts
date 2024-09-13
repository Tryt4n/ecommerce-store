"use server";

import { notFound } from "next/navigation";
import db from "@/db/db";
import type { z } from "zod";
import type { addDiscountSchema } from "@/lib/zod/discount";
import type { DiscountCode, Prisma } from "@prisma/client";

export async function createDiscountCode(
  data: z.infer<typeof addDiscountSchema>
) {
  try {
    return await db.discountCode.create({
      data: {
        code: data.code,
        discountAmount: data.discountAmount,
        discountType: data.discountType,
        allProducts: data.allProducts,
        products:
          data.productIds != null
            ? { connect: data.productIds.map((id) => ({ id })) }
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
  _count: { select: { orders: true } },
};

export async function getDiscountCodes(
  orderBy: keyof DiscountCode = "createdAt",
  type: "asc" | "desc" = "asc"
) {
  try {
    const [unexpiredDiscountCodes, expiredDiscountCodes] =
      await db.$transaction([
        db.discountCode.findMany({
          where: { NOT: WHERE_EXPIRED },
          select: SELECT_FIELDS,
          orderBy: { [orderBy]: type },
        }),
        db.discountCode.findMany({
          where: WHERE_EXPIRED,
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
