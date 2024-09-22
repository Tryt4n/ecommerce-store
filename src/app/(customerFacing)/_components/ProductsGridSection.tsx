import React, { Suspense } from "react";
import ProductsSectionHeader from "./ProductsSectionHeader";
import ListGrid from "@/layout/ListGrid";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ProductSuspense from "@/components/ProductSuspense";
import type {
  getAllAvailableForPurchaseProducts,
  getMostPopularProducts,
  getNewestProducts,
} from "@/db/userData/products";

type ProductsGridSectionProps = {
  title: string;
  productsFetcher:
    | typeof getMostPopularProducts
    | typeof getNewestProducts
    | typeof getAllAvailableForPurchaseProducts;
};

export default function ProductsGridSection({
  title,
  productsFetcher,
}: ProductsGridSectionProps) {
  return (
    <section className="space-y-4">
      <ProductsSectionHeader title={title} />

      <ListGrid>
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </ListGrid>
    </section>
  );
}
