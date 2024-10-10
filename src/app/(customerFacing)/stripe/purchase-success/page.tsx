import React from "react";
import Stripe from "stripe";
import ImageThumbnail from "@/components/ImageThumbnail";
import { notFound } from "next/navigation";
import { getProduct } from "@/db/userData/products";
import { Button } from "@/components/ui/button";
import { createDownloadVerification } from "@/app/_actions/download";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function SuccessPurchasePage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
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
                isSuccess
                  ? `/products/download/${(await createDownloadVerification(product.id))?.id}`
                  : `/products/${product.id}/purchase`
              }
              className="mt-4 w-full sm:w-auto"
              size={"lg"}
            >
              {isSuccess ? "Download" : "Try again"}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
