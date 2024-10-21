"use client";

import React from "react";
import PurchaseForm from "./PurchaseForm";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function ShoppingCart() {
  const { shoppingCart } = useShoppingCart();
  const { getUser } = useKindeBrowserClient();

  const user = getUser();

  const products = shoppingCart?.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    priceInCents: product.priceInCents,
  }));

  return (
    <>
      {user && shoppingCart && products && products?.length > 0 ? (
        <PurchaseForm user={user} products={products} />
      ) : (
        <p>Shopping cart is empty.</p>
      )}
    </>
  );
}
