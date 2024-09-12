import React from "react";
import { getDiscountCodes } from "@/db/adminData";
import AdminPageHeader from "../_components/AdminPageHeader";
import DiscountCodesTable from "./_components/DiscountCodesTable";
import { Button } from "@/components/ui/button";

export default async function AdminDiscountCodesPage() {
  const discountCodes = await getDiscountCodes();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <AdminPageHeader>Coupons</AdminPageHeader>
        <Button href="/admin/discount-codes/new">Add Coupon</Button>
      </div>

      <section>
        <h2 className="sr-only">Active Coupons</h2>

        {discountCodes?.unexpiredDiscountCodes ? (
          <DiscountCodesTable
            discountCodes={discountCodes.unexpiredDiscountCodes}
            canDeactivate
          />
        ) : (
          <p>No active coupons</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Expired Coupons</h2>

        {discountCodes?.expiredDiscountCodes ? (
          <DiscountCodesTable
            discountCodes={discountCodes.expiredDiscountCodes}
            isInactive
          />
        ) : (
          <p>No expired coupons</p>
        )}
      </section>
    </>
  );
}
