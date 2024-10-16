import React from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/db/userData/products";
import ProductBuyModule from "./_components/ProductBuyModule";
import CarouselSlider from "./_components/CarouselSlider";
import ProductDescription from "./_components/ProductDescription";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  if (product == null) notFound();

  return (
    <div className="my-8">
      <div className="flex flex-col-reverse items-center gap-8 lg:flex-row-reverse [&>[data-carousel-slider]]:max-w-full lg:[&>[data-carousel-slider]]:w-[66%] lg:[&>[data-carousel-slider]]:max-w-[900px]">
        <ProductBuyModule product={product} />

        <CarouselSlider
          productName={product.name}
          imagesUrl={product.images.map((image) => image.url)}
        />
      </div>

      <ProductDescription />
    </div>
  );
}
