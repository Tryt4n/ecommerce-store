"use client";

import React from "react";
import { useFormState } from "react-dom";
import { handlePurchaseProduct } from "../_actions/purchaseProducts";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ErrorMessage";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export default function PurchaseForm({
  user,
  products,
}: {
  user: KindeUser<Record<string, string>>;
  products: {
    productId: string;
    quantity: number;
    priceInCents: number;
  }[];
}) {
  const [error, action] = useFormState(
    handlePurchaseProduct.bind(null, products),
    undefined
  );

  return (
    <form action={action}>
      <input type="hidden" name="email" id="email" value={user.email || ""} />
      <input
        type="hidden"
        name="lastName"
        id="lastName"
        value={user.family_name || ""}
      />
      <input
        type="hidden"
        name="firstName"
        id="firstName"
        value={user.given_name || ""}
      />

      {error && typeof error === "string" && <ErrorMessage error={error} />}

      <Button>Purchase</Button>
    </form>
  );
}
