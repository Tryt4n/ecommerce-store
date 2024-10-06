"use client";

import { createContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  defaultProductsLayout,
  type ProductsLayout,
} from "../_types/layoutTypes";
import type { Product } from "@prisma/client";
import type { SortingType } from "@/types/sort";

export type ProductsSearchParams = {
  page?: string;
  take?: string;
  sortBy?: keyof Product;
  order?: SortingType;
};

type ProductsContextType = {
  layout: ProductsLayout;
  setLayout: (layout: ProductsLayout) => void;
  searchParams: ProductsSearchParams;
};

export const ProductsContext = createContext<ProductsContextType | null>(null);

export default function ProductsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layout, setLayout] = useState<ProductsLayout>(defaultProductsLayout);

  const searchParams = useSearchParams();

  const page = searchParams.get("page") as ProductsSearchParams["page"];
  const take = searchParams.get("take") as ProductsSearchParams["take"];
  const sortBy = searchParams.get("sortBy") as ProductsSearchParams["sortBy"];
  const order = searchParams.get("order") as ProductsSearchParams["order"];

  const contextValues = {
    layout,
    setLayout,
    searchParams: {
      page,
      take,
      sortBy,
      order,
    },
  };

  return (
    <ProductsContext.Provider value={contextValues}>
      {children}
    </ProductsContext.Provider>
  );
}
