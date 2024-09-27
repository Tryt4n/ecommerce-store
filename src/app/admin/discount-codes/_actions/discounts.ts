"use server";

import { notFound, redirect } from "next/navigation";
import { addDiscountSchema } from "@/lib/zod/discount";
import {
  createDiscountCode,
  getDiscountCode,
  updateDiscountCode as updateDiscountCodeInDB,
} from "@/db/adminData/discountCodes";
import type { DiscountCode } from "@prisma/client";
import type { FormDataEntries } from "@/types/formData";

export async function addDiscountCode(prevState: unknown, formData: FormData) {
  const data = processFormData(formData);
  const validationResult = validateAndParseData(data);

  if ("error" in validationResult) {
    return validationResult.error;
  }

  await createDiscountCode(validationResult.data).then(() =>
    redirect("/admin/discount-codes")
  );
}

export async function updateDiscountCode(
  code: DiscountCode["code"],
  prevState: unknown,
  formData: FormData
) {
  const data = processFormData(formData);
  const validationResult = validateAndParseData(data);

  if ("error" in validationResult) {
    return validationResult.error;
  }

  const discountCode = await getDiscountCode(code);

  if (discountCode == null) return notFound();

  await updateDiscountCodeInDB(discountCode.id, validationResult.data).then(
    () => redirect("/admin/discount-codes")
  );
}

function processFormData(formData: FormData): FormDataEntries {
  const data: FormDataEntries = Object.fromEntries(formData.entries());
  if (typeof data.productIds === "string") {
    data.productIds = data.productIds.split(",");
  }
  if (data.allProducts === "on") {
    data.productIds = [];
  }
  if (typeof data.categories === "string" && data.categories !== "") {
    data.categories = data.categories.split(",");
  }
  if ((data.categories as string[]).length > 0) {
    data.allProducts = "off";
    data.productIds = [];
  }
  if (data.categories === "") {
    data.categories = [];
  }

  return data;
}

function validateAndParseData(data: FormDataEntries) {
  const result = addDiscountSchema.safeParse({
    ...data,
    productIds:
      (data.productIds as string[]).length > 0 ? data.productIds : undefined,
  });

  if (result.success === false) {
    return { error: result.error.formErrors.fieldErrors };
  }

  return { data: { ...result.data, code: result.data.code.trim() } };
}
