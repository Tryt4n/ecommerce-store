import React from "react";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { getDiscountCode, getProduct } from "@/db/data";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function PurchasePage({
  params: { id },
  searchParams: { coupon },
}: {
  params: { id: string };
  searchParams: { coupon?: string };
}) {
  const product = await getProduct(id);

  if (product == null) notFound();

  const discountCode = coupon
    ? await getDiscountCode(coupon, product.id)
    : undefined;

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
        discountCode={discountCode}
        clientSecret={paymentIntent.client_secret}
      />
    </>
  );
}
