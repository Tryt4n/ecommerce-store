import React from "react";
import SearchInput from "@/components/SearchInput";
import FiltersButton from "../_components/FiltersButton";
import LayoutButton from "../_components/LayoutButton";
import type { ProductsSearchParams } from "../page";

export default function ProductsHeader({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  return (
    <header className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">Products</h2>

      <div className="flex -translate-y-[3.375rem] flex-col-reverse justify-between gap-4 sm:translate-y-0 sm:flex-row">
        <SearchInput className="sm:max-w-[66%] lg:max-w-[50%]" />

        <div className="flex justify-end gap-2 sm:gap-4">
          <FiltersButton searchParams={searchParams} />
          <LayoutButton />
        </div>
      </div>
    </header>
  );
}
