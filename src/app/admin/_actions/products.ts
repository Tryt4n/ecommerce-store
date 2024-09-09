"use server";

import { notFound, redirect } from "next/navigation";
import {
  createProduct,
  updateProduct as updateProductInDB,
} from "@/db/adminData";
import { editProductSchema, productAddSchema } from "@/lib/zod/productSchema";
import { getProduct } from "@/db/data";

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = productAddSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  await createProduct(data).then(() => {
    redirect("/admin/products");
  });
}

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await getProduct(id);

  if (product == null) return notFound();

  await updateProductInDB(data, product).then(() => {
    redirect("/admin/products");
  });
}
