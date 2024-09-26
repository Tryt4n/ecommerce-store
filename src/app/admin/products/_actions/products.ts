"use server";

import { notFound, redirect } from "next/navigation";
import {
  createProduct,
  updateProduct as updateProductInDB,
} from "@/db/adminData/products";
import { productAddSchema } from "@/lib/zod/productSchema";
import { getProduct } from "@/db/userData/products";
import type { FormDataEntries } from "@/types/formData";

export async function addProduct(prevState: unknown, formData: FormData) {
  const data = processFormData(formData);
  const validationResult = validateAndParseData(data);

  if ("error" in validationResult) {
    return validationResult.error;
  }

  await createProduct(validationResult.data).then(() => {
    redirect("/admin/products");
  });
}

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const data = processFormData(formData);
  const validationResult = validateAndParseData(data);

  if ("error" in validationResult) {
    return validationResult.error;
  }

  const product = await getProduct(id);

  if (product == null) return notFound();

  await updateProductInDB(validationResult.data, product).then(() => {
    redirect("/admin/products");
  });
}

function processFormData(formData: FormData): FormDataEntries {
  const data: FormDataEntries = Object.fromEntries(formData.entries());

  if (typeof data.categories === "string" && data.categories !== "") {
    data.categories = data.categories.split(",");
  }

  if (typeof data.images === "string") {
    data.images = JSON.parse(data.images);
  }

  return data;
}

function validateAndParseData(data: FormDataEntries) {
  const result = productAddSchema.safeParse(data);

  if (result.success === false) {
    return { error: result.error.formErrors.fieldErrors };
  }

  return { data: { ...result.data } };
}
