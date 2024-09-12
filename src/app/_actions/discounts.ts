"use server";

import { notFound, redirect } from "next/navigation";
import db from "@/db/db";
import { addDiscountSchema } from "@/lib/zod/discount";
import { cache } from "@/lib/cache";
import { createDiscountCode } from "@/db/adminData";
import type { Prisma } from "@prisma/client";

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
  products: { select: { name: true, id: true } },
  _count: { select: { orders: true } },
};

export const getDiscountCodes = cache(async () => {
  try {
    const [unexpiredDiscountCodes, expiredDiscountCodes] =
      await db.$transaction([
        db.discountCode.findMany({
          where: { NOT: WHERE_EXPIRED },
          select: SELECT_FIELDS,
          orderBy: { createdAt: "asc" },
        }),
        db.discountCode.findMany({
          where: WHERE_EXPIRED,
          select: SELECT_FIELDS,
          orderBy: { createdAt: "asc" },
        }),
      ]);

    return {
      unexpiredDiscountCodes: unexpiredDiscountCodes,
      expiredDiscountCodes: expiredDiscountCodes,
    };
  } catch (error) {
    console.error(`Error getting discount codes. Error: ${error}`);
  }
}, ["/admin/discount-codes", "getDiscountCodes"]);

export async function addDiscountCode(prevState: unknown, formData: FormData) {
  const productIds = formData.getAll("productIds");

  const result = addDiscountSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    productIds: productIds.length > 0 ? productIds : undefined,
  });

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await createDiscountCode(data).then(() => redirect("/admin/discount-codes"));
}

export async function toggleDiscountCodeActive(id: string, isActive: boolean) {
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

export async function deleteDiscountCode(id: string) {
  try {
    const discountCode = await db.discountCode.delete({
      where: { id },
    });

    if (discountCode == null) return notFound();
  } catch (error) {
    console.error(`Error deleting discount code. Error: ${error}`);
  }
}
