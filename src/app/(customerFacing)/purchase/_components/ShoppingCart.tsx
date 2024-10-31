"use client";

import React, { useState } from "react";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { formatCurrency } from "@/lib/formatters";
import ShoppingCartList from "@/components/ShoppingCartList";
import DiscountCodeForm from "./DiscountCodeForm";
import PurchaseForm from "./PurchaseForm";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ShoppingCart() {
  const { shoppingCart } = useShoppingCart();
  const { getUser } = useKindeBrowserClient();
  const [discountCode, setDiscountCode] = useState<string>();

  const user = getUser();

  return (
    <>
      {user ? (
        <>
          {shoppingCart && shoppingCart.length >= 1 ? (
            <article>
              <h2 className="sr-only">Shopping Cart List</h2>

              <Separator className="mb-2 mt-8" />
              <ShoppingCartList />
              <Separator className="mb-8 mt-2" />

              <p className="my-4 text-end text-base font-medium">
                Total:&nbsp;
                {formatCurrency(
                  shoppingCart.reduce(
                    (acc, item) => acc + item.priceInCents * item.quantity,
                    0
                  ) / 100
                )}
              </p>

              <DiscountCodeForm
                discountCode={discountCode}
                setDiscountCode={setDiscountCode}
              />
              <PurchaseForm user={user} discountCode={discountCode} />
            </article>
          ) : (
            <p className="my-4 text-center text-base">
              Shopping cart is empty.
            </p>
          )}
        </>
      ) : (
        <LoadingSpinner size={48} />
      )}
    </>
  );
}
