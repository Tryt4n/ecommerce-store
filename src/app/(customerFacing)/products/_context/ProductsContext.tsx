"use client";

import { createContext, useEffect, useState } from "react";
import { getAllAvailableProductsCount } from "@/db/userData/products";
import {
  defaultProductsLayout,
  type ProductsLayout,
} from "../_types/layoutTypes";

type ProductsContextType = {
  layout: ProductsLayout;
  setLayout: (layout: ProductsLayout) => void;
  productsCount: number | null;
};

export const ProductsContext = createContext<ProductsContextType | null>(null);

export default function ProductsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layout, setLayout] = useState<ProductsLayout>(defaultProductsLayout);
  const [productsCount, setProductsCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProductsCount() {
      const count = await getAllAvailableProductsCount();
      if (count) {
        setProductsCount(count);
      }
    }

    fetchProductsCount();
  }, []);

  return (
    <ProductsContext.Provider value={{ layout, setLayout, productsCount }}>
      {children}
    </ProductsContext.Provider>
  );
}
