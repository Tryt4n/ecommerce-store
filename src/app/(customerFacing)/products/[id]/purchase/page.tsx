import React from "react";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { getProduct } from "@/db/data";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  if (product == null) notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "PLN",
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent.");
  }

  return (
    <>
      <h1 className="sr-only">Finalizing the purchase</h1>

      <CheckoutForm
        product={product}
        clientSecret={paymentIntent.client_secret}
      />
    </>
  );
}
