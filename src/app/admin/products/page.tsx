import React from "react";
import AdminPageHeader from "../_components/AdminPageHeader";
import ProductsTable from "./_components/ProductsTable";

export default function AdminProductsPage() {
  return (
    <>
      <AdminPageHeader
        searchable
        withLink={{ label: "Add Product", href: "/admin/products/new" }}
      >
        Products
      </AdminPageHeader>

      <ProductsTable />
    </>
  );
}
