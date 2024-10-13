import React from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/db/userData/products";
import Stripe from "stripe";
import ImageThumbnail from "@/components/ImageThumbnail";
import { Button } from "@/components/ui/button";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function SuccessPurchasePage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  if (searchParams.payment_intent == null || searchParams.payment_intent === "")
    return notFound();
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  if (paymentIntent.metadata.productId == null) return notFound();

  const product = await getProduct(paymentIntent.metadata.productId);
  if (product == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <>
      <h1 className="sr-only">Payment verification</h1>

      <section className="mx-auto max-w-5xl space-y-8">
        <h2 className="text-balance text-4xl font-bold">
          {isSuccess ? "Success!" : "Error!"}
        </h2>

        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:items-center">
          <ImageThumbnail
            src={product.images[0]?.url}
            alt={product.name}
            width={320}
            height={320}
          />

          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>

            <p className="line-clamp-3 text-pretty text-muted-foreground">
              {product.description}
            </p>

            <Button
              href={
                isSuccess ? "/products" : `/products/${product.id}/purchase`
              }
              className="mt-4 w-full sm:w-auto"
              size={"lg"}
            >
              {isSuccess ? "Go Back" : "Try again"}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
