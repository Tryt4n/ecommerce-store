import React from "react";
import { getAllAvailableProductsCount } from "@/db/userData/products";
import PageNavigation from "../_components/PageNavigation";
import ProductsPerView from "../_components/ProductsPerView";
import { defaultProductsPerPage } from "../_types/layoutTypes";
import type { ProductsSearchParams } from "../page";

export default async function ProductsFooter({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const productsCount = await getAllAvailableProductsCount();

  const lastPageNumber =
    productsCount &&
    Math.ceil(
      productsCount / (Number(searchParams.take) || defaultProductsPerPage)
    );

  return (
    <footer className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <PageNavigation
        searchParams={searchParams}
        lastPageNumber={lastPageNumber}
      />

      <ProductsPerView
        searchParams={searchParams}
        lastPageNumber={lastPageNumber}
      />
    </footer>
  );
}
