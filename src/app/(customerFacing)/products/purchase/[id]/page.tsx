import React from "react";
import { notFound } from "next/navigation";
import { getProduct } from "@/db/userData/products";
import { checkDiscountCode } from "@/db/userData/discountCodes";
import CheckoutForm from "../_components/CheckoutForm";

// Force dynamic rendering to not interfere with static metadata generation
export const dynamic = "force-dynamic";

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
    ? await checkDiscountCode(coupon, product.id, product.categories)
    : undefined;

  return (
    <>
      <h1 className="sr-only">Finalizing the purchase</h1>

      <CheckoutForm product={product} discountCode={discountCode} />
    </>
  );
}
