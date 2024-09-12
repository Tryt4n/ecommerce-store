"use client";

import React, { useState } from "react";
import { useFormState } from "react-dom";
import { DiscountCodeType } from "@prisma/client";
import { addDiscountCode } from "@/app/_actions/discounts";
import { getProducts } from "@/db/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import ErrorMessage from "@/components/ErrorMessage";
import SubmitButton from "@/components/SubmitButton";

type DiscountCodeFormProps = {
  products: Awaited<ReturnType<typeof getProducts>>;
};

export default function DiscountCodeForm({ products }: DiscountCodeFormProps) {
  const [error, action] = useFormState(addDiscountCode, {});
  const [allProducts, setAllProducts] = useState(true);
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  return (
    <form action={action} className="space-y-8 overflow-y-hidden px-1">
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input type="text" name="code" id="code" required minLength={5} />
        {error?.code && <ErrorMessage error={error.code} />}
      </div>

      <div className="flex items-baseline gap-8 space-y-2">
        <div className="space-y-2">
          <Label htmlFor="discountType">Discount Type</Label>
          <RadioGroup
            id="discountType"
            name="discountType"
            defaultValue={DiscountCodeType.PERCENTAGE}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                id="percentage"
                value={DiscountCodeType.PERCENTAGE}
              />
              <Label htmlFor="percentage">Percentage</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem id="fixed" value={DiscountCodeType.FIXED} />
              <Label htmlFor="fixed">Fixed</Label>
            </div>
          </RadioGroup>
          {error?.discountType && <ErrorMessage error={error.discountType} />}
        </div>

        <div className="flex-grow space-y-2">
          <Label htmlFor="discountAmount">Discount Amount</Label>
          <Input
            type="number"
            name="discountAmount"
            id="discountAmount"
            required
            min={1}
          />
          {error?.discountAmount && (
            <ErrorMessage error={error.discountAmount} />
          )}
        </div>
      </div>

      <fieldset>
        <legend className="sr-only">Optional options</legend>

        <div className="my-6 space-y-2">
          <Label htmlFor="limit">Limit</Label>
          <Input
            type="number"
            name="limit"
            id="limit"
            min={1}
            aria-describedby="limit-description"
          />
          <p id="limit-description" className="text-sm text-muted-foreground">
            Leave blank for infinite uses
          </p>
          {error?.limit && <ErrorMessage error={error.limit} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expiration</Label>
          <Input
            type="datetime-local"
            name="expiresAt"
            id="expiresAt"
            min={today.toJSON().split(":").slice(0, -1).join(":")} // Remove seconds
            className="w-max"
            aria-describedby="expiresAt-description"
          />
          <p
            id="expiresAt-description"
            className="text-sm text-muted-foreground"
          >
            Leave blank for no expiration
          </p>
          {error?.expiresAt && <ErrorMessage error={error.expiresAt} />}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend>Allowed Products</legend>
        {error?.allProducts && <ErrorMessage error={error.allProducts} />}
        {error?.productIds && <ErrorMessage error={error.productIds} />}

        <div className="max-h-96 space-y-2 overflow-y-auto py-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="allProducts"
              name="allProducts"
              checked={allProducts}
              onCheckedChange={(e) => setAllProducts(e === true)}
            />
            <Label htmlFor="allProducts">All Products</Label>
          </div>

          {products &&
            products.map((product) => (
              <div key={product.id} className="flex items-center gap-2">
                <Checkbox
                  id={product.id}
                  name="productIds"
                  disabled={allProducts}
                  value={product.id}
                />
                <Label htmlFor={product.id}>{product.name}</Label>
              </div>
            ))}
        </div>
      </fieldset>

      <SubmitButton className="w-full text-base" size={"lg"} />
    </form>
  );
}
