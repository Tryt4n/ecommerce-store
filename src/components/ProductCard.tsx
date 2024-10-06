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
import Image from "./Image";
import PurchaseButton from "@/app/(customerFacing)/products/_components/PurchaseButton";
import { formatCurrency } from "@/lib/formatters";
import type { Category, Product } from "@prisma/client";
import type { UploadedImage } from "@/lib/imagekit/type";
import type { ProductsLayout } from "@/app/(customerFacing)/products/_types/layout";

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
  return (
    <li>
      <section className="h-full">
        <Card className="h-full">
          <Link
            href={`/products/${id}`}
            className={`flex ${layout === "grid" ? "h-full flex-col justify-between" : "flex-row"}`}
            onClick={(e) => {
              if (e.target instanceof HTMLButtonElement) {
                e.preventDefault();
              }
            }}
          >
            <div
              className={`relative grid aspect-square items-center justify-center bg-muted ${layout === "list" ? "w-[50%] md:w-[66%]" : ""}`}
            >
              <Image src={imageUrl || ""} alt={name} />
            </div>

            <div
              className={`flex flex-col ${layout === "grid" ? "flex-grow" : "w-[50%] justify-center md:w-[34%]"}`}
            >
              <CardHeader className="self-start">
                <CardTitle>{name}</CardTitle>
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

              <CardFooter>
                <PurchaseButton id={id} />
              </CardFooter>
            </div>
          </Link>
        </Card>
      </section>
    </li>
  );
}
