import React from "react";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import ProductForm from "../../_components/ProductForm";
import { getProduct } from "@/db/userData/products";
import { getCategories } from "@/db/userData/categories";
import { notFound } from "next/navigation";

export default async function AdminEditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [product, productCategories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  if (!product) return notFound();

  return (
    <>
      <AdminPageHeader withDateRange={false}>Edit Product</AdminPageHeader>

      <ProductForm product={product} categories={productCategories} />
    </>
  );
}
