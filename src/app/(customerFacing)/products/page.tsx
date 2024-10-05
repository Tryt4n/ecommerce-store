import React, { Suspense } from "react";
import {
  getAllAvailableForPurchaseProducts,
  getAllAvailableProductsCount,
} from "@/db/userData/products";
import ProductsContextProvider from "./_context/ProductsContext";
import CustomLayoutListGrid from "./_components/CustomLayoutListGrid";
import CustomProductsSuspense from "./_components/CustomProductsSuspense";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import LayoutButton from "./_components/LayoutButton";
import ProductsPerView from "./_components/ProductsPerView";
import PageNavigation from "./_components/PageNavigation";
import type { Product } from "@prisma/client";
import type { SortingType } from "@/types/sort";

export type ProductsSearchParams = {
  page?: string;
  take?: string;
  sortBy?: keyof Product;
  order?: SortingType;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const productsCount = await getAllAvailableProductsCount();

  return (
    <ProductsContextProvider>
      <h1 className="sr-only">Products Page</h1>

      <article className="space-y-4">
        <header className="flex justify-between">
          <h2 className="text-3xl font-bold">Products</h2>

          <LayoutButton />
        </header>

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

        <footer className="flex flex-row items-center justify-between gap-4">
          <PageNavigation
            searchParams={searchParams}
            productsCount={productsCount}
          />

          <ProductsPerView searchParams={searchParams} />
        </footer>
      </article>
    </ProductsContextProvider>
  );
}
