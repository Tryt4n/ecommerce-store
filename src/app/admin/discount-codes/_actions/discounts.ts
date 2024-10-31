"use server";

import { redirect } from "next/navigation";
import { addDiscountSchema } from "@/lib/zod/discount";
import {
  createStripeDiscountCode,
  deleteStripeCoupon,
  getAllStripeProductsByCategory,
} from "@/lib/stripe/stripe";
import {
  checkIfDiscountCodeExists,
  createDiscountCode,
  deleteDiscountCode as deleteDiscountCodeInDB,
} from "@/db/adminData/discountCodes";
import type { DiscountCode } from "@prisma/client";
import type { FormDataEntries } from "@/types/formData";

type DiscountCodeErrors = {
  code?: string[] | undefined;
  discountAmount?: string[] | undefined;
  discountType?: string[] | undefined;
  allProducts?: string[] | undefined;
  productIds?: string[] | undefined;
  categories?: string[] | undefined;
  expiresAt?: string[] | undefined;
  limit?: string[] | undefined;
  stripeError?: string[] | undefined;
} | null;

export async function addDiscountCode(prevState: unknown, formData: FormData) {
  const data = processFormData(formData);
  const validationResult = validateAndParseData(data);

  let errors: DiscountCodeErrors = null;

  if ("error" in validationResult) {
    errors = validationResult.error ? validationResult.error : null;
    return errors;
  }

  // Destructure data from validationResult
  const {
    code,
    discountType,
    discountAmount,
    limit,
    allProducts,
    productIds,
    categories,
    expiresAt,
  } = validationResult.data;

  // Check if discount code with the same code already exists
  if (await checkIfDiscountCodeExists(code)) {
    errors = { code: ["Discount code with the same code already exists."] };
    return errors;
  }

  // Get products for the discount code if they are selected
  let products = !allProducts ? productIds : undefined;

  // Get products for the discount code if categories are selected
  if (categories && categories.length > 0) {
    // Get IDs of products with selected categories from Stripe and assign them to products
    await getAllStripeProductsByCategory(categories).then(
      (stripeProducts) => (products = stripeProducts)
    );
  }

  // Create discount code in Stripe
  const discountCode = await createStripeDiscountCode({
    name: code,
    discountType: discountType,
    discountAmount:
      discountType === "FIXED" ? discountAmount * 100 : discountAmount,
    expiresAt: expiresAt,
    products,
    redemptions: limit,
    metadata: categories ? { categories: categories.join(", ") } : undefined,
  });

  if (discountCode.error) {
    return { stripeError: [discountCode.error] };
  }
  if (!discountCode.coupon || !discountCode.promotionCode) {
    return { stripeError: ["Failed to create discount code"] };
  }

  // Create discount code in the database
  await createDiscountCode({
    ...validationResult.data,
    id: discountCode.coupon.id,
  }).then(() => redirect("/admin/discount-codes"));
}

export async function deleteDiscountCode(id: DiscountCode["id"]) {
  await Promise.all([deleteStripeCoupon(id), deleteDiscountCodeInDB(id)]);
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
