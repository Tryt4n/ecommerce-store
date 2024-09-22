import React, { Suspense } from "react";
import ListGrid from "@/layout/ListGrid";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ProductSuspense from "@/components/ProductSuspense";
import { getAllAvailableForPurchaseProducts } from "@/db/userData/products";

export default function ProductsPage() {
  return (
    <>
      <h1 className="sr-only">Products Page</h1>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Products</h2>

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
              productsFetcher={getAllAvailableForPurchaseProducts}
            />
          </Suspense>
        </ListGrid>
      </section>
    </>
  );
}
