import React from "react";
import AdminPageHeader from "../../_components/AdminPageHeader";
import DiscountCodeForm from "../_components/DiscountCodeForm";
import { getAllProducts } from "@/db/adminData/products";

export default async function AdminAddNewDiscountCodePage() {
  const products = await getAllProducts();

  return (
    <>
      <AdminPageHeader>Add New Coupon</AdminPageHeader>

      <DiscountCodeForm products={products} />
    </>
  );
}
