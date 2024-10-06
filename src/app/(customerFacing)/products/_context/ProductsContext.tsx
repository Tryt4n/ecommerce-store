"use client";

import { createContext, useState } from "react";
import {
  defaultProductsLayout,
  type ProductsLayout,
} from "../_types/layoutTypes";

type ProductsContextType = {
  layout: ProductsLayout;
  setLayout: (layout: ProductsLayout) => void;
};

export const ProductsContext = createContext<ProductsContextType | null>(null);

export default function ProductsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layout, setLayout] = useState<ProductsLayout>(defaultProductsLayout);

  return (
    <ProductsContext.Provider value={{ layout, setLayout }}>
      {children}
    </ProductsContext.Provider>
  );
}
