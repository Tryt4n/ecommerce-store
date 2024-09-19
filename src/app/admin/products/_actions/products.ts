"use server";

import { notFound, redirect } from "next/navigation";
import {
  createProduct,
  updateProduct as updateProductInDB,
} from "@/db/adminData/products";
import { editProductSchema, productAddSchema } from "@/lib/zod/productSchema";
import { getProduct } from "@/db/userData/products";

type FormDataEntries = {
  [key: string]: FormDataEntryValue | string[];
};

export async function addProduct(prevState: unknown, formData: FormData) {
  const data: FormDataEntries = Object.fromEntries(formData.entries());
  if (typeof data.categories === "string") {
    data.categories = data.categories.split(",");
  }

  const result = productAddSchema.safeParse(data);

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  await createProduct(result.data).then(() => {
    redirect("/admin/products");
  });
}

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const data: FormDataEntries = Object.fromEntries(formData.entries());
  if (typeof data.categories === "string") {
    data.categories = data.categories.split(",");
  }

  const result = editProductSchema.safeParse(data);

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const product = await getProduct(id);

  if (product == null) return notFound();

  await updateProductInDB(result.data, product).then(() => {
    redirect("/admin/products");
  });
}
