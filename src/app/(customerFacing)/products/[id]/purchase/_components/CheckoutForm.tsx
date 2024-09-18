"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { getDiscountedAmount } from "@/lib/discountCodeHelpers";
import { formatCurrency } from "@/lib/formatters";
import StripePaymentForm from "./StripePaymentForm";
import Image from "next/image";
import type { checkDiscountCode } from "@/db/userData/discountCodes";
import type { getProduct } from "@/db/userData/products";

type CheckoutFormProps = {
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>;
  discountCode: Awaited<ReturnType<typeof checkDiscountCode>>;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function CheckoutForm({
  product,
  discountCode,
}: CheckoutFormProps) {
  const amount =
    discountCode == null
      ? product.priceInCents
      : getDiscountedAmount(
          discountCode.discountAmount,
          discountCode.discountType,
          product.priceInCents
        );
  const isDiscounted = amount !== product.priceInCents;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="flex items-center gap-4">
        <div className="relative aspect-video w-1/3 flex-shrink-0">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>

        <div>
          <p className="flex items-center text-lg">
            {isDiscounted && (
              <>
                <s
                  className="text-sm text-muted-foreground"
                  aria-label="Old price"
                >
                  {formatCurrency(product.priceInCents / 100)}
                </s>
                &nbsp;
              </>
            )}
            <span aria-label={isDiscounted ? "New price" : undefined}>
              {formatCurrency(amount / 100)}
            </span>
          </p>

          <h2 className="text-2xl font-bold">{product.name}</h2>

          <p className="line-clamp-3 text-muted-foreground">
            {product.description}
          </p>
        </div>
      </section>

      <section>
        <h2 className="sr-only">Payments</h2>

        <Elements
          stripe={stripePromise}
          options={{ amount, mode: "payment", currency: "pln" }}
        >
          <StripePaymentForm
            productId={product.id}
            priceInCents={amount}
            discountCode={discountCode}
          />
        </Elements>
      </section>
    </div>
  );
}
