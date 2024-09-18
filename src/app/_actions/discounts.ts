"use server";

import { notFound, redirect } from "next/navigation";
import { addDiscountSchema } from "@/lib/zod/discount";
import {
  createDiscountCode,
  getDiscountCode,
  updateDiscountCode as updateDiscountCodeInDB,
} from "@/db/adminData/discountCodes";
import type { DiscountCode } from "@prisma/client";

export async function addDiscountCode(prevState: unknown, formData: FormData) {
  const productIds = formData.getAll("productIds");

  const result = addDiscountSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    productIds: productIds.length > 0 ? productIds : undefined,
  });

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = { ...result.data, code: result.data.code.trim() };

  await createDiscountCode(data).then(() => redirect("/admin/discount-codes"));
}

export async function updateDiscountCode(
  code: DiscountCode["code"],
  prevState: unknown,
  formData: FormData
) {
  const productIds = formData.getAll("productIds");

  const result = addDiscountSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    productIds: productIds.length > 0 ? productIds : undefined,
  });

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = { ...result.data, code: result.data.code.trim() };
  const discountCode = await getDiscountCode(code);

  if (discountCode == null) return notFound();

  await updateDiscountCodeInDB(discountCode.id, data).then(() =>
    redirect("/admin/discount-codes")
  );
}
