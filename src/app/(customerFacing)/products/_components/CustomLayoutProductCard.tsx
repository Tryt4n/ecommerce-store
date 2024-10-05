"use client";

import React, { type ComponentProps } from "react";
import { useProductsContext } from "../_hooks/useProductsContext";
import ProductCard from "@/components/ProductCard";

type CustomLayoutProductCardProps = ComponentProps<typeof ProductCard>;

export default function CustomLayoutProductCard({
  ...props
}: CustomLayoutProductCardProps) {
  const { layout } = useProductsContext();

  return <ProductCard {...props} layout={layout} />;
}
