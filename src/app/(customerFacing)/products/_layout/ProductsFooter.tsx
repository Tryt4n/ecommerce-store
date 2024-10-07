import React from "react";
import PageNavigation from "../_components/PageNavigation";
import ProductsPerView from "../_components/ProductsPerView";
import type { ProductsSearchParams } from "../page";

export default function ProductsFooter({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  return (
    <footer className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <PageNavigation searchParams={searchParams} />

      <ProductsPerView searchParams={searchParams} />
    </footer>
  );
}
