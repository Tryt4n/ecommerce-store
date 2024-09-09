import React from "react";
import AdminPageHeader from "../_components/AdminPageHeader";
import ProductsTable from "./_components/ProductsTable";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <AdminPageHeader>Products</AdminPageHeader>
        <Button href="/admin/products/new">Add Product</Button>
      </div>

      <ProductsTable />
    </>
  );
}
