import React from "react";
import { getAllAvailableProductsCount } from "@/db/userData/products";
import PageNavigation from "../_components/PageNavigation";
import ProductsPerView from "../_components/ProductsPerView";

export default async function ProductsFooter() {
  const productsCount = await getAllAvailableProductsCount();

  return (
    <footer className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <PageNavigation productsCount={productsCount} />

      <ProductsPerView />
    </footer>
  );
}
