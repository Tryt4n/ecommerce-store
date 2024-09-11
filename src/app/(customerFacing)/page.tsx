import React from "react";
import ProductsGridSection from "./_components/ProductsGridSection";
import { getMostPopularProducts, getNewestProducts } from "@/db/data";

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Home page</h1>

      <ProductsGridSection
        title="Most Popular"
        productsFetcher={() => getMostPopularProducts(3)}
      />

      <ProductsGridSection
        title="Newest"
        productsFetcher={() => getNewestProducts(3)}
      />
    </>
  );
}
