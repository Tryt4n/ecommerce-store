import React from "react";
import ProductsHeader from "./_layout/ProductsHeader";
import Products from "./_layout/Products";
import ProductsFooter from "./_layout/ProductsFooter";
import type { Product } from "@prisma/client";
import type { SortingType } from "@/types/sort";

export type ProductsSearchParams = {
  page?: string;
  take?: string;
  sortBy?: keyof Product;
  order?: SortingType;
  searchQuery?: string;
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  return (
    <>
      <h1 className="sr-only">Products Page</h1>

      <article>
        <ProductsHeader searchParams={searchParams} />

        <Products searchParams={searchParams} />

        <ProductsFooter searchParams={searchParams} />
      </article>
    </>
  );
}
