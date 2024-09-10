"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "./StripePaymentForm";
import type { Product } from "@prisma/client";

type CheckoutFormProps = {
  product: Partial<Product> &
    Required<
      Pick<
        Product,
        "id" | "name" | "priceInCents" | "description" | "imagePath"
      >
    >;
  clientSecret: string;
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function CheckoutForm({
  product,
  clientSecret,
}: CheckoutFormProps) {
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
          <p className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </p>

          <h2 className="text-2xl font-bold">{product.name}</h2>

          <p className="line-clamp-3 text-muted-foreground">
            {product.description}
          </p>
        </div>
      </section>

      <section>
        <h2 className="sr-only">Payments</h2>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePaymentForm
            productId={product.id}
            priceInCents={product.priceInCents}
          />
        </Elements>
      </section>
    </div>
  );
}
