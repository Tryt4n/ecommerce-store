import React from "react";
import { getCategories } from "@/db/userData/categories";
import AdminPageHeader from "../../_components/AdminPageHeader";
import ProductForm from "../_components/ProductForm";

export default async function AdminNewProductPage() {
  const productCategories = await getCategories();

  return (
    <>
      <AdminPageHeader>Add Product</AdminPageHeader>

      <ProductForm categories={productCategories} />
    </>
  );
}
