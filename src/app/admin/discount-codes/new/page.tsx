import React from "react";
import AdminPageHeader from "../../_components/AdminPageHeader";
import DiscountCodeForm from "../_components/DiscountCodeForm";
import { getProducts } from "@/db/data";

export default async function AdminAddNewDiscountCodePage() {
  const products = await getProducts();

  return (
    <>
      <AdminPageHeader>Add New Coupon</AdminPageHeader>

      <DiscountCodeForm products={products} />
    </>
  );
}
