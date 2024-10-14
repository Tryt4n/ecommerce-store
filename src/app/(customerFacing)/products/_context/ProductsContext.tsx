"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAllAvailableProductsCount } from "@/db/userData/products";
import {
  defaultProductsLayout,
  type ProductsLayout,
} from "../_types/layoutTypes";
import { getLastPageNumber } from "../_helpers/pageNumber";
import type { ProductsSearchParams } from "../page";

type ProductsContextType = {
  layout: ProductsLayout;
  setLayout: (layout: ProductsLayout) => void;
  productsCount: number | null;
  handleResetSearchQueryParam: () => void;
};

export const ProductsContext = createContext<ProductsContextType | null>(null);

export default function ProductsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layout, setLayout] = useState<ProductsLayout>(() => {
    // Check if window is defined to avoid SSR error
    if (typeof window !== "undefined") {
      const savedLayout = localStorage.getItem("productsLayout");
      return savedLayout
        ? (savedLayout as ProductsLayout)
        : defaultProductsLayout;
    }
    return defaultProductsLayout;
  });

  const [productsCount, setProductsCount] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get search params
  const searchQueryParam = searchParams.get("searchQuery");
  const pageParam = searchParams.get("page");
  const takeParam = searchParams.get("take");
  const sortByParam = searchParams.get("sortBy");
  const orderParam = searchParams.get("order");

  // Fetch products count based on search query
  const fetchProductsCount = useCallback(async (query?: string) => {
    const count = await getAllAvailableProductsCount(query);

    setProductsCount(count || 0); // Set the count to 0 if it is null
  }, []);

  // Fetch products count on initial render and when search query changes
  useEffect(() => {
    fetchProductsCount(searchQueryParam || undefined);
  }, [fetchProductsCount, searchQueryParam]);

  // Get the last page number
  const lastPageNumber = getLastPageNumber(productsCount, takeParam);

  // Redirect to the last page if the current page number is greater than the last page number
  if (lastPageNumber && pageParam && Number(pageParam) > lastPageNumber) {
    const params = new URLSearchParams({
      page: lastPageNumber.toString(),
    } as ProductsSearchParams);

    // Pass the rest of the search params if they exist
    takeParam && params.set("take", takeParam);
    sortByParam && params.set("sortBy", sortByParam);
    orderParam && params.set("order", orderParam);
    searchQueryParam && params.set("searchQuery", searchQueryParam);

    // Update the URL with the new page number
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleResetSearchQueryParam() {
    const params = new URLSearchParams(searchParams);
    params.delete("searchQuery");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <ProductsContext.Provider
      value={{ layout, setLayout, productsCount, handleResetSearchQueryParam }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
