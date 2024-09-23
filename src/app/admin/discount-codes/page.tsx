import React from "react";
import AdminPageHeader from "../_components/AdminPageHeader";
import DiscountCodesSections from "./_layout/DiscountCodesSections";

export default async function AdminDiscountCodesPage() {
  return (
    <>
      <AdminPageHeader
        searchable
        withLink={{ label: "Add Coupon", href: "/admin/discount-codes/new" }}
      >
        Coupons
      </AdminPageHeader>

      <DiscountCodesSections />
    </>
  );
}
