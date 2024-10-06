import React, { ComponentProps } from "react";
import ProductCard from "./ProductCard";
import type ProductsGridSection from "@/app/(customerFacing)/_components/ProductsGridSection";

export default async function ProductsSuspense({
  productsFetcher,
}: {
  productsFetcher: ComponentProps<
    typeof ProductsGridSection
  >["productsFetcher"];
}) {
  const products = await productsFetcher();

  return (
    <>
      {products?.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          priceInCents={product.priceInCents}
          description={product.description}
          imageUrl={product.images[0]?.url}
          categories={product.categories}
        />
      ))}
    </>
  );
}
