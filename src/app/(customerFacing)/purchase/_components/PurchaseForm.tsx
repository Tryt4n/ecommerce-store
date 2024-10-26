"use client";

import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { handlePurchaseProduct } from "../_actions/purchaseProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [purchaseData, action] = useFormState(
    handlePurchaseProduct.bind(null, products),
    undefined
  );
  const { clearShoppingCart } = useShoppingCart();
  const router = useRouter();

  const [invoice, setInvoice] = useState(false);

  useEffect(() => {
    if (!purchaseData) return;

    if (purchaseData.data?.url) {
      router.push(purchaseData.data.url);
      clearShoppingCart();
    }
  }, [purchaseData, clearShoppingCart, router]);

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

      <div className="my-2 flex items-center">
        <Label
          htmlFor="invoice"
          className="cursor-pointer pr-1 font-semibold"
          aria-label="Do you want an invoice?"
        >
          Invoice?
        </Label>
        <Checkbox
          name="invoice"
          id="invoice"
          title="Check if you want to receive an invoice."
          checked={invoice}
          onCheckedChange={() => setInvoice(!invoice)}
          aria-controls="invoiceForm"
        />
      </div>

      <div
        id="invoiceForm"
        className={`${!invoice ? "h-0 overflow-hidden" : "mb-4 mt-2"}`}
        aria-hidden={!invoice}
      >
        <div>
          <Label htmlFor="companyName">Name</Label>
          <Input
            name="companyName"
            id="companyName"
            type="text"
            placeholder="Company Name"
            minLength={5}
            maxLength={100}
            required={invoice}
          />
        </div>

        <div>
          <Label htmlFor="companyAddress">Address</Label>
          <Input
            name="companyAddress"
            id="companyAddress"
            type="text"
            placeholder="Street, City, Postal Code"
            minLength={12}
            maxLength={200}
            required={invoice}
          />
        </div>

        <div>
          <Label htmlFor="NIP">NIP</Label>
          <Input
            name="NIP"
            id="NIP"
            type="text"
            placeholder="1234567890"
            minLength={10}
            maxLength={10}
            pattern="[0-9]{10}"
            required={invoice}
          />
        </div>
      </div>

      {purchaseData?.error && <ErrorMessage error={purchaseData.error} />}

      <Button>Purchase</Button>
    </form>
  );
}
