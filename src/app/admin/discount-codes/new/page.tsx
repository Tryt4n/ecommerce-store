import React from "react";
import AdminPageHeader from "../../_components/AdminPageHeader";
import DiscountCodeForm from "../_components/DiscountCodeForm";
import { getAllProducts } from "@/db/adminData/products";
import { getCategories } from "@/db/userData/categories";

export default async function AdminAddNewDiscountCodePage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <>
      <AdminPageHeader withDateRange={false}>Add New Coupon</AdminPageHeader>

      <DiscountCodeForm products={products} categories={categories} />
    </>
  );
}
