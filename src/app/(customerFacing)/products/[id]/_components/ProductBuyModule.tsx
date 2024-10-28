import React from "react";
import { formatCurrency } from "@/lib/formatters";
import AddToCartButton from "../../_components/AddToCartButton";
import { Button } from "@/components/ui/button";
import type { getProduct } from "@/db/userData/products";

type ProductBuyModuleProps = {
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>;
};

export default function ProductBuyModule({ product }: ProductBuyModuleProps) {
  return (
    <div className="w-full">
      <hgroup className="my-4">
        <h1 className="text-balance text-2xl font-medium">{product.name}</h1>
        <p className="mb-1 text-sm capitalize text-muted-foreground">
          {`${product.categories.length > 1 ? "Categories" : "Category"}: ${product.categories.join(" / ")}`}
        </p>
        <p className="text-xl font-medium">
          {formatCurrency(product.priceInCents / 100)}
        </p>
        <p className="my-2 text-pretty">{product.description}</p>
      </hgroup>

      <div className="my-6">
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            priceInCents: product.priceInCents,
            thumbnailUrl: product.images[0].url,
          }}
        />

        <Button href="/purchase" className="w-full text-base" size="lg">
          Go to Shopping Cart
        </Button>
      </div>
    </div>
  );
}
