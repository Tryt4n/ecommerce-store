import React, { Suspense } from "react";
import { getAllAvailableForPurchaseProducts } from "@/db/userData/products";
import CustomLayoutListGrid from "../_components/CustomLayoutListGrid";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import CustomProductsSuspense from "../_components/CustomProductsSuspense";
import type { ProductsSearchParams } from "../page";

export default function Products({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  return (
    <CustomLayoutListGrid>
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
        <CustomProductsSuspense
          productsFetcher={getAllAvailableForPurchaseProducts}
          searchParams={searchParams}
        />
      </Suspense>
    </CustomLayoutListGrid>
  );
}
