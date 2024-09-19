import React from "react";
import { getAllProducts } from "@/db/adminData/products";
import { getDiscountCode } from "@/db/adminData/discountCodes";
import { getCategories } from "@/db/userData/categories";
import AdminPageHeader from "@/app/admin/_components/AdminPageHeader";
import DiscountCodeForm from "../../_components/DiscountCodeForm";

export default async function AdminEditDiscountCodePage({
  params: { code },
}: {
  params: { code: string };
}) {
  const [products, discountCode, categories] = await Promise.all([
    getAllProducts(),
    getDiscountCode(code),
    getCategories(),
  ]);

  return (
    <>
      <AdminPageHeader withDateRange={false}>Edit Coupon</AdminPageHeader>

      <DiscountCodeForm
        products={products}
        discountCode={discountCode || undefined}
        categories={categories}
      />
    </>
  );
}
