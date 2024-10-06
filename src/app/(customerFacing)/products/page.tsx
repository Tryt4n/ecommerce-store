import React from "react";
import ProductsContextProvider, {
  type ProductsSearchParams,
} from "./_context/ProductsContext";
import ProductsHeader from "./_layout/ProductsHeader";
import Products from "./_layout/Products";
import ProductsFooter from "./_layout/ProductsFooter";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  return (
    <ProductsContextProvider>
      <h1 className="sr-only">Products Page</h1>

      <article className="space-y-4">
        <ProductsHeader />

        <Products searchParams={searchParams} />

        <ProductsFooter />
      </article>
    </ProductsContextProvider>
  );
}
