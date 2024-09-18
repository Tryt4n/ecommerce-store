import React from "react";
import { getAllProducts } from "@/db/adminData/products";
import { getDiscountCode } from "@/db/adminData/discountCodes";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import DiscountCodeForm from "../../_components/DiscountCodeForm";

export default async function AdminEditDiscountCodePage({
  params: { code },
}: {
  params: { code: string };
}) {
  const [products, discountCode] = await Promise.all([
    getAllProducts(),
    getDiscountCode(code),
  ]);

  return (
    <>
      <AdminPageHeader withDateRange={false}>Edit Coupon</AdminPageHeader>

      <DiscountCodeForm
        products={products}
        discountCode={discountCode || undefined}
      />
    </>
  );
}
