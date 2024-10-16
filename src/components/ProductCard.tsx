"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import ImageThumbnail from "./ImageThumbnail";
import TextWithSearchOption from "./TextWithSearchOption";
import PurchaseButton from "@/app/(customerFacing)/products/_components/PurchaseButton";
import AddToCartButton from "@/app/(customerFacing)/products/_components/AddToCartButton";
import { formatCurrency } from "@/lib/formatters";
import type { Category, Product } from "@prisma/client";
import type { UploadedImage } from "@/lib/imagekit/type";
import type { ProductsLayout } from "@/app/(customerFacing)/products/_types/layoutTypes";

type ProductCardProps = {
  id: Product["id"];
  name: Product["name"];
  priceInCents: Product["priceInCents"];
  description: Product["description"];
  imageUrl: UploadedImage["url"];
  categories: Category["name"][];
  layout?: ProductsLayout;
};

export default function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imageUrl,
  categories,
  layout = "grid",
}: ProductCardProps) {
  const maxImageSize = 590;

  return (
    <li
      className={`${layout === "list" ? `h-full max-h-[${maxImageSize}px]` : ""}`}
    >
      <section className="h-full">
        <Card
          className={`h-full overflow-visible border-0 transition-all hover:shadow-xl ${layout === "grid" ? "hover:scale-105" : "hover:scale-[102.5%]"}`}
        >
          <Link
            href={`/products/${id}`}
            className={`flex ${layout === "grid" ? "h-full flex-col justify-between" : "flex-row items-center"} overflow-hidden rounded-lg border`}
            onClick={(e) => {
              const target = e.target as Element;
              if (
                target instanceof HTMLButtonElement ||
                target.closest("[data-shopping-cart-button]")
              ) {
                e.preventDefault();
              }
            }}
          >
            <ImageThumbnail
              src={imageUrl}
              alt={name}
              width={maxImageSize}
              height={maxImageSize}
              thumbnailContainerStyles={
                layout === "list" ? { width: maxImageSize } : undefined
              }
              thumbnailContainerClassNames="bg-muted m-4"
              containerClassNames="relative aspect-square w-full max-w-full [&>img]:object-contain [&>img]:object-center"
            />

            <div className="flex flex-grow flex-col">
              <CardHeader className="self-start">
                <CardTitle>
                  <TextWithSearchOption text={name} />
                </CardTitle>
                <CardDescription className="capitalize">
                  {`${categories.length > 1 ? "Categories" : "Category"}: ${categories.join(" / ")}`}
                </CardDescription>
                <CardDescription>
                  {formatCurrency(priceInCents / 100)}
                </CardDescription>
              </CardHeader>

              <CardContent
                className={layout === "grid" ? "flex-grow" : undefined}
              >
                <p className="line-clamp-4">{description}</p>
              </CardContent>

              <CardFooter className="flex flex-col">
                <AddToCartButton
                  product={{
                    id,
                    name,
                    priceInCents,
                    thumbnailUrl: imageUrl,
                  }}
                  className="lg:gap-x-2 xl:gap-x-4"
                  data-shopping-cart-button
                />
                <PurchaseButton id={id} />
              </CardFooter>
            </div>
          </Link>
        </Card>
      </section>
    </li>
  );
}
