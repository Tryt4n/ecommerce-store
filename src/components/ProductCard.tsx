import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { formatCurrency } from "@/lib/formatters";
import type { Product } from "@prisma/client";

type ProductCardProps = {
  id: Product["id"];
  name: Product["name"];
  priceInCents: Product["priceInCents"];
  description: Product["description"];
  imagePath: Product["imagePath"];
};

export default function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <li className="flex flex-col overflow-hidden">
      <Card>
        <div className="relative aspect-video h-auto w-full">
          <Image src={imagePath} fill alt={name} className="object-cover" />
        </div>

        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {formatCurrency(priceInCents / 100)}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          <p className="line-clamp-4">{description}</p>
        </CardContent>

        <CardFooter>
          <Button
            href={`/products/${id}/purchase`}
            size={"lg"}
            className="w-full"
          >
            Purchase
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}
