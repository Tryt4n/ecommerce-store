"use server";

import { redirect } from "next/navigation";
import { addDiscountSchema } from "@/lib/zod/discount";
import { createDiscountCode } from "@/db/adminData";

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
