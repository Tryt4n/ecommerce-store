"use client";

import React, { createContext, useEffect, useState } from "react";
import type { ShoppingCart } from "@/types/shoppingCart";

type ChangeProductQuantity = "increment" | "decrement";

type ShoppingCartContext = {
  shoppingCart: ShoppingCart | undefined;
  setShoppingCart: (value: ShoppingCart | undefined) => void;
  getShoppingCartFromLocalStorage: () => ShoppingCart;
  setShoppingCartLocalStorage: (value: ShoppingCart) => void;
  deleteProductFromShoppingCart: (productId: string) => void;
  changeProductQuantityInShoppingCart: (
    productId: string,
    type: ChangeProductQuantity
  ) => void;
};

export const ShoppingCartContext = createContext<ShoppingCartContext | null>(
  null
);

export default function ShoppingCartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shoppingCart, setShoppingCart] = useState<ShoppingCart | undefined>();

  useEffect(() => {
    const cart = getShoppingCartFromLocalStorage();

    if (cart) {
      setShoppingCart(cart);
    }
  }, []);

  function deleteProductFromShoppingCart(productId: string) {
    const cart = getShoppingCartFromLocalStorage();

    const updatedCart = cart.filter((item) => item.id !== productId);

    updateShoppingCart(updatedCart);
  }

  function changeProductQuantityInShoppingCart(
    productId: string,
    type: ChangeProductQuantity
  ) {
    const cart = getShoppingCartFromLocalStorage();

    const itemIndex = cart.findIndex((item) => item.id === productId);

    // If the product is not in the cart, return
    if (itemIndex === -1) {
      return;
    }

    // If the product is already in the cart, update the quantity
    if (type === "increment") {
      if (cart[itemIndex].quantity >= 99) return;
      cart[itemIndex].quantity += 1;
    } else {
      if (cart[itemIndex].quantity <= 1) {
        return;
      }

      cart[itemIndex].quantity -= 1;
    }

    updateShoppingCart(cart);
  }

  function getShoppingCartFromLocalStorage(): ShoppingCart {
    return JSON.parse(localStorage.getItem("shoppingCart") || "[]");
  }

  function setShoppingCartLocalStorage(value: ShoppingCart) {
    localStorage.setItem("shoppingCart", JSON.stringify(value));
  }

  function updateShoppingCart(value: ShoppingCart) {
    setShoppingCartLocalStorage(value);
    setShoppingCart(value);
  }

  const contextValue: ShoppingCartContext = {
    shoppingCart,
    setShoppingCart,
    getShoppingCartFromLocalStorage,
    setShoppingCartLocalStorage,
    deleteProductFromShoppingCart,
    changeProductQuantityInShoppingCart,
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
}
