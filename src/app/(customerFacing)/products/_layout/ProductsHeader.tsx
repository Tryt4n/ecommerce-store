import React from "react";
import FiltersButton from "../_components/FiltersButton";
import LayoutButton from "../_components/LayoutButton";
import type { ProductsSearchParams } from "../page";

export default function ProductsHeader({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  return (
    <header className="flex justify-between">
      <h2 className="text-3xl font-bold">Products</h2>

      <div className="flex gap-2 sm:gap-4">
        <FiltersButton searchParams={searchParams} />
        <LayoutButton />
      </div>
    </header>
  );
}
