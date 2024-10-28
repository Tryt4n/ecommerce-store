import React from "react";
import ShoppingCart from "./_components/ShoppingCart";

export default async function PurchasePage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <ShoppingCart />
    </>
  );
}
