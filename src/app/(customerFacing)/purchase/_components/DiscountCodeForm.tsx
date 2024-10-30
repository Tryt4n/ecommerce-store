import React from "react";
import { useFormState } from "react-dom";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { validateDiscountCode } from "../_actions/discountCodeValidation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ErrorMessage";
import SubmitButton from "@/components/SubmitButton";
import { formatCurrency } from "@/lib/formatters";
import { Separator } from "@/components/ui/separator";

export default function DiscountCodeForm() {
  const { shoppingCart } = useShoppingCart();
  const [discountCodeValidation, action] = useFormState(
    validateDiscountCode.bind(null, shoppingCart!),
    undefined
  );

  return (
    <form action={action} className="mb-6 mt-4">
      <div>
        <Label htmlFor="discountCode" className="cursor-pointer font-semibold">
          Discount Code&nbsp;<span className="font-normal">(optional)</span>
        </Label>
        <div className="mt-1 flex items-center gap-4">
          <Input
            type="text"
            name="discountCode"
            id="discountCode"
            placeholder="Enter discount code"
            minLength={3}
            maxLength={40}
            className={`max-w-[300px] ${discountCodeValidation?.success ? "valid:border-green-600 valid:text-green-600" : ""}`}
            required
            aria-invalid={
              discountCodeValidation
                ? discountCodeValidation.error
                  ? true
                  : false
                : undefined
            }
          />

          <SubmitButton initialText="Activate" pendingText="Activating..." />
        </div>
      </div>

      {discountCodeValidation?.error && (
        <ErrorMessage error={discountCodeValidation.error} />
      )}
      {discountCodeValidation?.success && (
        <p className="mt-1 indent-1 text-sm text-green-600">
          Discount Code Applied
        </p>
      )}

      {discountCodeValidation?.discountedProducts && (
        <div className="my-4">
          <ul className="my-4 list-decimal indent-2">
            {discountCodeValidation.discountedProducts.map((product, index) => (
              <li key={`${product.id}-${index}`}>
                {index === 0 && <Separator className="my-1" />}

                <div className="flex justify-between">
                  <div className="inline-flex gap-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="inline-flex">
                      {product.oldPriceInCents !== product.priceInCents && (
                        <>
                          <s
                            className="font-light text-muted-foreground"
                            aria-label="Old price"
                          >
                            {formatCurrency(product.oldPriceInCents / 100)}
                          </s>
                          &nbsp;
                        </>
                      )}
                      <span aria-label="New discounted price">
                        {formatCurrency(product.priceInCents / 100)}
                      </span>
                    </p>
                  </div>

                  <p className="inline-flex">
                    <span aria-label="Quantity">x{product.quantity}</span>
                    <Separator orientation="vertical" className="ml-2" />
                    <span
                      className="font-medium"
                      aria-label="Total amount for products"
                    >
                      {formatCurrency(
                        (product.priceInCents * product.quantity) / 100
                      )}
                    </span>
                  </p>
                </div>

                <Separator className="my-1" />
              </li>
            ))}
          </ul>

          <div className="text-end">
            <p className="text-sm">
              Total Discount:&nbsp;
              {formatCurrency(
                discountCodeValidation.discountedProducts.reduce(
                  (acc, product) =>
                    acc +
                    product.oldPriceInCents * product.quantity -
                    product.priceInCents * product.quantity,
                  0
                ) / 100
              )}
            </p>
            <p>
              Total Discounted Amount:&nbsp;
              {formatCurrency(
                discountCodeValidation.discountedProducts.reduce(
                  (acc, product) =>
                    acc + product.priceInCents * product.quantity,
                  0
                ) / 100
              )}
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
