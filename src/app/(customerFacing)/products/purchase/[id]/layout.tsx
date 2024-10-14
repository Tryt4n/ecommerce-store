import React from "react";
import type { Metadata } from "next";
import { getAllAvailableProductsIds, getProduct } from "@/db/userData/products";

export async function generateStaticParams() {
  const productsIds = await getAllAvailableProductsIds();

  return productsIds?.map((productId) => productId.id) ?? [];
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(id);

  return {
    title: `Purchase - ${product?.name} | E-commerce store`,
    description: product?.description,
    category: product?.categories.join(", "),
    keywords: ["stripe", "stripe payments"],
    openGraph: {
      images: [
        {
          url: `${product?.images[0].url}?tr=h-630%2Cw-1200%2Cn-ik_ml_thumbnail%2Cl-image%2Ci-Logo%40%40logo-black_with_padding.svg%2Cw-100%2Ch-100%2Clfo-top_right%2Ct-false%2Cl-end`,
        },
      ],
    },
  };
}

export default function PurchasePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
