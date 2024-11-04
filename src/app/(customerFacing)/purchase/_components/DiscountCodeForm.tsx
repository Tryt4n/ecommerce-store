import React, { useRef } from "react";
import { useFormState } from "react-dom";
import { useShoppingCart } from "@/app/_hooks/useShoppingCart";
import { validateDiscountCode } from "../_actions/discountCodeValidation";
import { formatCurrency } from "@/lib/formatters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ErrorMessage";
import SubmitButton from "@/components/SubmitButton";

export default function DiscountCodeForm({
  discountCode,
  setDiscountCode,
}: {
  discountCode: string | undefined;
  setDiscountCode: (value: string) => void;
}) {
  const { shoppingCart } = useShoppingCart();
  const [discountCodeValidation, action] = useFormState(
    validateDiscountCode.bind(null, shoppingCart!),
    undefined
  );

  const discountCodeRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action={action}
      onSubmit={() => setDiscountCode(discountCodeRef.current?.value || "")}
      className="mb-6 mt-4"
    >
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
            ref={discountCodeRef}
          />

          <SubmitButton initialText="Activate" pendingText="Activating..." />
        </div>
      </div>

      {discountCodeValidation?.error && (
        <ErrorMessage error={discountCodeValidation.error} />
      )}
      {discountCodeValidation?.success && (
        <p className="mt-1 indent-1 text-sm text-green-600">
          Discount Code Applied:&nbsp;{discountCode}
        </p>
      )}

      {discountCodeValidation &&
        discountCodeValidation.allProducts &&
        discountCodeValidation.discountedAmount && (
          <section className="my-4">
            <h3 className="sr-only">Discounts applied</h3>

            {discountCodeValidation.discountedProduct && (
              <div className="inline-flex gap-2">
                <h3 className="font-medium">
                  {discountCodeValidation.discountedProduct.name}
                </h3>
                <p className="inline-flex">
                  {discountCodeValidation.discountedProduct.oldPriceInCents !==
                    discountCodeValidation.discountedProduct.priceInCents && (
                    <>
                      <s
                        className="font-light text-muted-foreground"
                        aria-label="Old price"
                      >
                        {formatCurrency(
                          discountCodeValidation.discountedProduct
                            .oldPriceInCents / 100
                        )}
                      </s>
                      &nbsp;
                    </>
                  )}
                  <span aria-label="New discounted price">
                    {formatCurrency(
                      discountCodeValidation.discountedProduct.priceInCents /
                        100
                    )}
                  </span>
                </p>
              </div>
            )}

            <div className="my-2 text-end">
              <p className="text-sm">
                Total Discount:&nbsp;
                <span className="font-semibold">
                  &minus;
                  {formatCurrency(
                    discountCodeValidation.discountedAmount / 100
                  )}
                </span>
              </p>
              <p>
                Total Discounted Amount:&nbsp;
                <span className="font-semibold">
                  {formatCurrency(
                    discountCodeValidation.allProducts.reduce(
                      (acc, product) =>
                        acc + product.priceInCents * product.quantity,
                      0
                    ) / 100
                  )}
                </span>
              </p>
            </div>
          </section>
        )}
    </form>
  );
}
