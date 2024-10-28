"use client";

import React, { createContext, useEffect, useState } from "react";
import { decode, encode } from "@/lib/helpers";
import type { ShoppingCart } from "@/types/shoppingCart";

type ChangeProductQuantity = "increment" | "decrement";

type ShoppingCartContext = {
  shoppingCart: ShoppingCart | undefined;
  getShoppingCartFromLocalStorage: () => ShoppingCart;
  deleteProductFromShoppingCart: (productId: string) => void;
  changeProductQuantityInShoppingCart: (
    productId: string,
    type: ChangeProductQuantity
  ) => void;
  updateShoppingCart: (value: ShoppingCart) => void;
  clearShoppingCart: () => void;
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

  // Load the shopping cart from the local storage on the initial render
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

    if (itemIndex === -1) return; // If the product is not in the cart, return

    // If the product is already in the cart, update the quantity
    if (type === "increment") {
      if (cart[itemIndex].quantity >= 99) return; // If the quantity is 99, return
      cart[itemIndex].quantity += 1; // Increment the quantity
    } else {
      if (cart[itemIndex].quantity <= 1) return; // If the quantity is 1, return
      cart[itemIndex].quantity -= 1; // Decrement the quantity
    }

    updateShoppingCart(cart);
  }

  function getShoppingCartFromLocalStorage(): ShoppingCart {
    const localStorageEncodedData = localStorage.getItem("shoppingCart");
    return localStorageEncodedData
      ? JSON.parse(decode(localStorageEncodedData))
      : [];
  }

  function setShoppingCartLocalStorage(value: ShoppingCart) {
    const encodedData = encode(JSON.stringify(value));
    localStorage.setItem("shoppingCart", encodedData);
  }

  function updateShoppingCart(value: ShoppingCart) {
    setShoppingCartLocalStorage(value);
    setShoppingCart(value);
  }

  function clearShoppingCart() {
    localStorage.removeItem("shoppingCart");
  }

  const contextValue: ShoppingCartContext = {
    shoppingCart,
    getShoppingCartFromLocalStorage,
    deleteProductFromShoppingCart,
    changeProductQuantityInShoppingCart,
    updateShoppingCart,
    clearShoppingCart,
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
}
