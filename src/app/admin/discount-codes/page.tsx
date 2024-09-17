import React from "react";
import AdminPageHeader from "../_components/AdminPageHeader";
import DiscountCodesSections from "./_layout/DiscountCodesSections";
import { Button } from "@/components/ui/button";

export default async function AdminDiscountCodesPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <AdminPageHeader>Coupons</AdminPageHeader>

        <Button href="/admin/discount-codes/new">Add Coupon</Button>
      </div>

      <DiscountCodesSections />
    </>
  );
}
