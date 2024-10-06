import React, { Suspense } from "react";
import ProductsSectionHeader from "./ProductsSectionHeader";
import ListGrid from "@/layout/ListGrid";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ProductsSuspense from "@/components/ProductsSuspense";
import type {
  getMostPopularProducts,
  getNewestProducts,
} from "@/db/userData/products";

type ProductsGridSectionProps = {
  title: string;
  productsFetcher: typeof getMostPopularProducts | typeof getNewestProducts;
};

export default function ProductsGridSection({
  title,
  productsFetcher,
}: ProductsGridSectionProps) {
  return (
    <article className="space-y-4">
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
          <ProductsSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </ListGrid>
    </article>
  );
}
