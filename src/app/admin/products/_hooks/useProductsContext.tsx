import { useContext } from "react";
import { AdminProductsContext } from "../_contexts/AdminProductsContext";

export default function useProductsContext() {
  const context = useContext(AdminProductsContext);

  if (!context) {
    throw new Error(
      "useProductsContext must be used within a AdminProductsContextProvider"
    );
  }

  return context;
}
