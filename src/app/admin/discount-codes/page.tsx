import React from "react";
import { checkPermissions } from "@/lib/checkPermissions";
import AdminPageHeader from "../_components/AdminPageHeader";
import DiscountCodesSections from "./_layout/DiscountCodesSections";

export default async function AdminDiscountCodesPage() {
  await checkPermissions("admin");

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
