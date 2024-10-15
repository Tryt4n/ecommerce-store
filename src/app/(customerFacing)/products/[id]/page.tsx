import React from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/db/userData/products";
import CarouselSlider from "./_components/CarouselSlider";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  if (product == null) notFound();

  return (
    <div className="my-8 flex flex-col-reverse items-center gap-8 lg:flex-row-reverse [&>[data-carousel-slider]]:max-w-full lg:[&>[data-carousel-slider]]:w-[66%] lg:[&>[data-carousel-slider]]:max-w-[900px]">
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
      </div>

      <CarouselSlider
        productName={product.name}
        imagesUrl={product.images.map((image) => image.url)}
      />
    </div>
  );
}
