"use client";

import { createContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getAllProducts } from "@/db/adminData/products";
import { arraysEqual, sortArray } from "@/lib/sort";
import { setSortingSearchParams } from "@/lib/searchParams";
import type { SortingType } from "@/types/sort";

type Products = Awaited<ReturnType<typeof getAllProducts>>;
type SortingField = keyof NonNullable<Products>[number];

type AdminProductsContext = {
  products: Products;
  sortProducts: (
    sortingField: SortingField,
    sortingType: SortingType,
    dataToSort?: Products
  ) => void;
};

export const AdminProductsContext = createContext<AdminProductsContext | null>(
  null
);

export default function AdminProductsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<AdminProductsContext["products"]>();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);
  const currentSortBy = searchParams.get("sortBy") as SortingField;
  const currentSortType = searchParams.get("sortType") as null | SortingType;

  useEffect(() => {
    async function fetchProducts() {
      const fetchedProducts = await getAllProducts("createdAt").then((res) => {
        if (!currentSortBy || !currentSortType || !res) return res;

        return sortArray(res, currentSortBy, currentSortType);
      });

      setProducts(fetchedProducts);
    }

    fetchProducts();
  }, [currentSortBy, currentSortType, setProducts]);

  function sortProducts(
    sortingField: keyof NonNullable<Products>[number],
    sortingType: SortingType,
    dataToSort: Products = products
  ) {
    if (!dataToSort) return;

    // Set the sorting params
    setSortingSearchParams(
      params,
      currentSortBy,
      sortingField,
      currentSortType,
      sortingType
    );
    // Update the URL with the new sorting params
    router.push(`${pathname}?${params.toString()}`, { scroll: false });

    // Sort the products based on the sorting field and type
    const sortedProducts = sortArray(dataToSort, sortingField, sortingType);

    // Reverse the array if it is already sorted in the same order
    if (arraysEqual(sortedProducts, dataToSort)) {
      sortedProducts.reverse();
    }

    setProducts(sortedProducts);
  }

  const contextValue = {
    products,
    sortProducts,
  };

  return (
    <AdminProductsContext.Provider value={contextValue}>
      {children}
    </AdminProductsContext.Provider>
  );
}
