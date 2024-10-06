import React from "react";
import { getAllAvailableProductsCount } from "@/db/userData/products";
import PageNavigation from "../_components/PageNavigation";
import ProductsPerView from "../_components/ProductsPerView";
import type { ProductsSearchParams } from "../page";

export default async function ProductsFooter({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const productsCount = await getAllAvailableProductsCount();

  return (
    <footer className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <PageNavigation
        searchParams={searchParams}
        productsCount={productsCount}
      />

      <ProductsPerView searchParams={searchParams} />
    </footer>
  );
}
