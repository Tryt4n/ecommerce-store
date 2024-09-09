import React from "react";
import AdminPageHeader from "../../_components/AdminPageHeader";
import ProductForm from "../_components/ProductForm";

export default function AdminNewProductPage() {
  return (
    <>
      <AdminPageHeader>Add Product</AdminPageHeader>

      <ProductForm />
    </>
  );
}
