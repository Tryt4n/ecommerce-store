import React, { Suspense, type ComponentProps } from "react";
import ListGrid from "@/layout/ListGrid";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ProductSuspense from "@/components/ProductSuspense";
import { getProducts } from "@/db/data";
import type ProductsGridSection from "../_components/ProductsGridSection";

export default function ProductsPage() {
  return (
    <ListGrid>
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductSuspense
          productsFetcher={
            getProducts as ComponentProps<
              typeof ProductsGridSection
            >["productsFetcher"] // type assertion because `getProducts` is not assignable to type `() => Promise<Product[] | undefined>` but it has the same signature and all required properties
          }
        />
      </Suspense>
    </ListGrid>
  );
}
