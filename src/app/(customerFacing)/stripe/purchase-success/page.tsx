import React from "react";
import Image from "next/image";
import Stripe from "stripe";
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
        <h2 className="text-4xl font-bold">
          {isSuccess ? "Success!" : "Error!"}
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative aspect-video w-full sm:w-1/3 sm:flex-shrink-0">
            <Image
              src={product.imagePath}
              fill
              alt={product.name}
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold">{product.name}</h2>

            <p className="line-clamp-3 text-muted-foreground">
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
