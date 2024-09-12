import React from "react";
import { notFound } from "next/navigation";
import { getDiscountCode, getProduct } from "@/db/data";
import CheckoutForm from "./_components/CheckoutForm";

export default async function PurchasePage({
  params: { id },
  searchParams: { coupon },
}: {
  params: { id: string };
  searchParams: { coupon?: string };
}) {
  const product = await getProduct(id);

  if (product == null) notFound();

  const discountCode = coupon
    ? await getDiscountCode(coupon, product.id)
    : undefined;

  return (
    <>
      <h1 className="sr-only">Finalizing the purchase</h1>

      <CheckoutForm product={product} discountCode={discountCode} />
    </>
  );
}
