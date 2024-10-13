"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { getDiscountedAmount } from "@/lib/discountCodeHelpers";
import { formatCurrency } from "@/lib/formatters";
import ImageThumbnail from "@/components/ImageThumbnail";
import NotRealPaymentInfo from "./NotRealPaymentInfo";
import StripePaymentForm from "./StripePaymentForm";
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

  const imageSize = 340;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <article className="flex items-center gap-4">
        <ImageThumbnail
          src={product.images[0]?.url}
          alt={product.name}
          width={imageSize}
          height={imageSize}
          containerStyles={`w-[${imageSize}px]`}
        />

        <div className="flex-grow">
          <p className="flex items-center text-pretty text-lg">
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

          <h2 className="text-balance text-2xl font-bold">{product.name}</h2>

          <p className="line-clamp-3 text-pretty text-muted-foreground">
            {product.description}
          </p>
        </div>
      </article>

      <article>
        <h2 className="sr-only">Payments</h2>

        <Elements
          stripe={stripePromise}
          options={{ amount, mode: "payment", currency: "pln" }}
        >
          <NotRealPaymentInfo />
          <StripePaymentForm
            productId={product.id}
            priceInCents={amount}
            discountCode={discountCode}
          />
        </Elements>
      </article>
    </div>
  );
}
