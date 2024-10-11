import React from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/db/userData/products";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);

  if (product == null) notFound();

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
