import { useContext } from "react";
import { ShoppingCartContext } from "../_context/ShoppingCartContext";

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);

  if (!context) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartContextProvider"
    );
  }

  return context;
}
