import React from "react";
import { checkPermissions } from "@/lib/checkPermissions";
import AdminPageHeader from "../_components/AdminPageHeader";
import ProductsTable from "./_components/ProductsTable";

export default async function AdminProductsPage() {
  await checkPermissions("admin");

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
