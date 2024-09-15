import React from "react";
import AdminProductsContextProvider from "./_contexts/AdminProductsContext";
import AdminPageHeader from "../_components/AdminPageHeader";
import ProductsTable from "./_components/ProductsTable";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  return (
    <AdminProductsContextProvider>
      <div className="flex items-center justify-between gap-4">
        <AdminPageHeader>Products</AdminPageHeader>
        <Button href="/admin/products/new">Add Product</Button>
      </div>

      <ProductsTable />
    </AdminProductsContextProvider>
  );
}
