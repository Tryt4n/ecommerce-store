import React from "react";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import ProductForm from "../../_components/ProductForm";
import { getProduct } from "@/db/userData/products";
import { notFound } from "next/navigation";

export default async function AdminEditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  if (!product) return notFound();

  return (
    <>
      <AdminPageHeader>Edit Product</AdminPageHeader>

      <ProductForm product={product} />
    </>
  );
}
